// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===

import { PDO } from './dbServices.js'
import Authorization from './autServices.js'

class UserModel extends PDO {
  constructor(options) {
    super(options)
  }

  async queryAll(query, params) {
    try {
      const session = await this.pool.acquire()
      const message = await session.query(query, params).all()
      session.close()
      return message
    } catch (err) {
      console.log('⚡ err::PDO.queryAll => ', err)
      process.exit()
    }
  }

  async queryOne(query, params) {
    try {
      const session = await this.pool.acquire()
      const message = await session.query(query, params).one()
      session.close()
      return message
    } catch (err) {
      console.log('⚡ err::PDO.query => ', err)
      process.exit()
    }
  }

  async queryRid(query) {
    try {
      console.log('RID')
      const session = await this.pool.acquire()
      const message = await session.query(query).one()
      session.close()
      return message
    } catch (err) {
      return err
    }
  }

  liveQuery(options) {}

  async insert(query, json) {
    try {
      const session = await this.pool.acquire()
      const message = await session.command(query, json).one()
      session.close()
      return message
    } catch (err) {
      console.log('⚡ err::PDO.insert => ', err)
      return err
    }
  }

  async create(edgeClass, from, to) {
    try {
      const session = await this.pool.acquire()
      const message = await session
        .create('EDGE', edgeClass)
        .from(from)
        .to(to)
        .one()
      session.close()
      return message
    } catch (err) {
      console.log('⚡ err::PDO.create => ', err)
      process.exit()
    }
  }

  command(options) {}

  //username, password
  async getLogin(obj) {
    try {
      return await this.queryOne('SELECT FROM User WHERE username= :username', {
        params: {
          username: obj.username,
        },
      }).then((user) => {
        if (!user) {
          // if the user does not exist | если пользователя не существует
          return null
        } else {
          // If the login matched (the user exists) | если совпал логин (пользователь существует)
          let salt = new Authorization().hashPassword(obj.password, user.salt)
          if (user.hashedPassword === salt && user.block === false) {
            // если совпал логин, и совпадают пароли
            return user
          } else {
            // если совпал логин, но не совпадают пароли
            return false
          }
        }
      })
    } catch (err) {
      console.log('⚡ err::getLogin', err)
    }
  }

  getUserAll() {
    return this.queryAll(
      'SELECT @rid as rid, _id, username, email, block, group, created, quota FROM User ORDER BY created DESC LIMIT 20',
    )
  }

  /**
   * Получаем все данные о пользователе, по его логину, или @rid
   * @param {Object} user логин пользователя
   * @returns {Object}
   */
  async getUser(user) {
    try {
      if (typeof user === 'Object') {
        return this.queryOne(
          'select @rid as rid, username, email, block, group, created, quota from User where username =: name ',
          {
            params: {
              name: user,
            },
          },
        )
      } else if (typeof user === 'string') {
        return this.queryRid('SELECT FROM User WHERE @rid = ' + user)
      }
    } catch (err) {
      return err
    }
  }

  /**
   * Получаем @rid пользователя, по его логину
   * @param {Object} user логин пользователя
   * @returns { '@rid': RecordID { cluster: integer, position: integer } }
   */
  getRid(user) {
    return this.queryOne('select @rid from User where username =: name ', {
      params: {
        name: user,
      },
    })
  }

  setCreated(obj) {
    return this.insert(
      'INSERT INTO User SET username =:username, hashedPassword =:hashedPassword, salt =:salt, email =:email, group =:group, quota =:quota, block=:block, created =sysdate(), _id =:_id',
      { params: { ...obj } },
    )
  }

  update(obj) {
    return this.insert(
      'UPDATE User SET username =:username email =:email group =:group, quota =:quota, block = :block',
    )
  }

  validateFields(field, value) {
    return this.queryOne(
      'select ' + field + ' from User where ' + field + " ='" + value + "'",
    )
  }

  hashPassword(password) {
    let auth = new Authorization()
    return {
      password: auth.hashPassword(password),
      salt: auth.salt,
    }
  }
}

export { UserModel }
