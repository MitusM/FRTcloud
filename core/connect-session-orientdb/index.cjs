const crypto = require('crypto');
let _ = require('lodash');
let log = require('debug-logger')('session-orient');

const OrientDBClient = require("orientjs").OrientDBClient;

const noop = () => {};
const unit = (a) => a;
/**
 * Default options
 */
const defaultOptions = {
  // Global options
  tableName: 'userSessions',
  stringify: true,
  hash: false,
  // ttl: 60 * 60 * 24 * 14, // 14 days
  ttl: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
  autoRemove: 'interval',
  autoRemoveInterval: 10, // min
  pool: {
    max: 10
  }
};

const client = new OrientDBClient({
  host: "localhost",
  poll: defaultOptions.pool
});

function defaultSerializeFunction(session) {
  // Copy each property of the session to a new object
  const obj = {};
  let prop;
  for (prop in session) {
    if (prop === 'cookie') {
      obj.cookie = session.cookie.toJSON ? // @ts-ignore FIXME:
        session.cookie.toJSON() :
        session.cookie;
    } else {
      obj[prop] = session[prop];
    }
  }
  return obj;
}

function computeTransformFunctions(options) {
  if (options.serialize || options.unserialize) {
    return {
      serialize: options.serialize || defaultSerializeFunction,
      unserialize: options.unserialize || unit,
    };
  }
  if (options.stringify === false) {
    return {
      serialize: defaultSerializeFunction,
      unserialize: unit,
    };
  }
  // Default case
  return {
    serialize: JSON.stringify,
    unserialize: JSON.parse,
  };
}
exports = module.exports = function (connect) {
  var Store = connect.Store || connect.session.Store;

  class OrientStore extends Store {

    constructor(options) {

      options = _.clone(options);
      options = _.defaults(options || {}, defaultOptions);
      if (options.hash) {
        options.hash = _.defaults(options.hash, defaultHashOptions);
      }
      super(options);

      this.options = options;
      // this.dbConnect();
      this.transformFunctions = computeTransformFunctions(options);
      this.defaultSerializeFunction = defaultSerializeFunction;
      this._db = this.dbConnect()
        .then(pool => {
          this.db = pool;
          return pool;
        })
    }

    changeState(newState) {
      console.info('switched to state: %s', newState);
      this.state = newState;
      this.emit(newState);
    }


    /** 
     * Get a session from the store given a session ID (sid)
     * @param sid session ID
     */
    get(sid, callback) {
      (async () => {
        try {
          console.log('get')
          const session = await this.getCollection(sid)
          const s = session && this.transformFunctions.unserialize(session.session)
          if (s) s['rid'] = session && session.rid
          this.emit('get', sid);
          callback(null, s === undefined ? null : s)

        } catch (err) {
          return callback(err);
        }
      })();
    }
    /**
     * Upsert a session into the store given a session ID (sid) and session (session) object.
     * @param sid session ID
     * @param session session object
     */
    set(sid, session, callback = noop) {
      (async () => {
        try {
          console.log('set')
          sid = this.getSessionId(sid)
          // Если не указана дата истечения срока, то это
          // cookie сеанса браузера или вообще нет cookie,
          // в соответствии с документами подключения.
          //
          // Итак, мы устанавливаем срок действия через две недели
          // - как это принято в отрасли (например, Django) -
          // или значение по умолчанию, указанное в опциях.
          let s = {
            "session": this.transformFunctions.serialize(session),
            "expires": new Date(session.cookie.expires)
          }

          if (session.hasOwnProperty('rid')) {
            let update = await this.update(session.rid, s)
            this.emit('update', sid)
            callback(null, s.update)
          } else {
            s['id'] = sid
            let create = await this.create(s)
            callback(null, create)
            this.emit('create', sid)
          }
        } catch (error) {
          return callback(error);
        }
      })();
    }

    touch(sid, session, callback) {
      (async () => {
        try {
          console.log('touch')
          sid = this.getSessionId(sid)
          let s = {
            "session": this.transformFunctions.serialize(session),
            "expires": new Date(session.cookie.expires)
          }

          let update = await this.update(session.rid, s)
          this.emit('touch', sid, update);
          callback(null, s.update)
        } catch (error) {
          return callback(error);
        }
      })();
    }

    /**
     * Destroy/delete a session from the store given a session ID (sid)
     * @param sid session ID
     */
    destroy(sid, callback = noop) {
      (async () => {
        try {
          console.log('⚡ [destroy]')
          let del = await this.delete(sid)
          if (del) {
            this.emit('destroy', sid);
            callback(null)
          }
        } catch (err) {
          callback(err);
        }
      })()
    }

    /**
     * Get the count of all sessions in the store
     */
    length(callback) {
      (async () => {
        try {
          console.log('⚡ sid::[length]', sid)
          this.db.select("count(*)").from(this.options.tableName)
            .scalar()
            .then(function (total) {
              callback(null, total)
            })
        } catch (error) {
          callback(error);
        }
      })();
    }
    /**
     * Delete all sessions from the store.
     */
    clear(callback) {
      console.log('⚡ sid::[clear]', sid)
    }

    getSessionId(sid) {
      if (this.options.hash) {
        return crypto.createHash(this.options.hash.algorithm).update(this.options.hash.salt + sid).digest('hex');
      } else if (this.options.transformId &&
        typeof this.options.transformId === 'function') {
        return this.options.transformId(sid);
      } else {
        return sid;
      }

    }

    dbConnect() {
      console.log('dbConnect')
      return client.connect().then(() => {
          return client.sessions({
            name: this.options.name,
            username: this.options.username,
            password: this.options.password,
            pool: {
              max: 25
            }
          })
        }).then(pool => {
          return pool.acquire().then(session => {
            session.close();
            return session;
          }).catch(err => {
            this.changeState('disconnected');
            return err
          });
        })
        .catch(err => {
          console.log(err);
          this.changeState('disconnected');
        })
    }

    async getCollection(sid) {
      sid = this.getSessionId(sid)
      return await this.db.select('@rid as rid, expires, session, @version as version').from(this.options.tableName).where({
        id: sid
      }).one().then(session => session)
    }

    async create(session) {
      try {
        return await this.db.create('VERTEX', this.options.tableName)
          .set(session).one()
          .then(data => {
            let s = data && this.transformFunctions.unserialize(data.session)
            s['rid'] = data && data['@rid']
            return s === undefined ? null : s
          })
      } catch (err) {
        return err;
      }
    }

    async update(rid, session) {
      try {
        console.log('update session')
        let db = await this._db
        return await this.db.update(rid).set(session).one()
          .then(update => {
            update = update.count === 1 ?
              session :
              new Error('update session failed')
            return update;
          })
      } catch (err) {
        return err;
      }
    }

    async delete(sid) {
      try {
        sid = this.getSessionId(sid)
        await this._db
        return await this.db.delete('VERTEX', this.options.tableName)
          .where({
            id: sid
          }).one()
          .then((del) => {
            return del.count === 1 ? true : false;
          })
      } catch (err) {
        return err;
      }
    }


  }



  return OrientStore;

}