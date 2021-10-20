import dotenv from 'dotenv'
import {
  session
} from './session.js'
dotenv.config()

let options = {
  host: process.env.ORIENTDB_HOST,
  port: process.env.ORIENTDB_PORT,
  httpPort: process.env.ORIENTDB_HTTPPORT,
  username: process.env.ORIENTDB_USERNAME,
  password: process.env.ORIENTDB_PASSWORD,
  name: process.env.ORIENTDB_NAME,
  pool: process.env.ORIENTDB_POOL,
  tableName: process.env.ORIENTDB_TABLENAME,
}


const action = (app) => {
  class UpdateSession extends session(app) {
    constructor(options) {
      super(options)
    }

    async query(rid, sid, session) {
      let s = {
        "session": this.transformFunctions.serialize(session),
        "expires": new Date(session.cookie.expires)
      }
      let q = await super.update(rid, s)
      super.emit('update', sid)
      return q
    }

    async delete(sid, callback) {
      let d = await super.delete(sid)
      super.emit('destroy', sid);
      return d
    }
  }

  app.action('gateway:session', async (meta, res) => {
    try {
      let rid = meta.session.rid
      let sess = {
        ...meta.session,
        auth: meta.auth,
        user: meta.user
      }
      let connect = new UpdateSession(options)
      let query = await connect.query(rid, meta.sid, sess)
      return UpdateSession
    } catch (err) {
      console.error(err)
      return err
    }
  })

  app.action('gateway:session-destroy', async (meta, res) => {
    try {
      let sid = meta.sid
      let connect = new UpdateSession(options)
      let destroy = await connect.delete(sid)
      if (destroy) {
        res.writeHead(302, {
          location: meta.location
        }).end()
      }

    } catch (err) {
      console.error(err)
      return err
    }
  })

  return app
}

export {
  action
}