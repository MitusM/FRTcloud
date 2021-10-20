// === === === === === === === === === === === ===
// 
// === === === === === === === === === === === ===

import {
  PDO
} from './dbServices.js'
import Authorization from './autServices.js'

class UserModel extends PDO {
  constructor(options) {
    super(options)
  }

  //username, password
  async getLogin(obj) {
    try {
      return await this.queryOne("SELECT FROM User WHERE username= :username", {
        params: {
          username: obj.username
        }
      }).then(user => {
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
    return this.queryAll("SELECT @rid as rid, _id, username as login, email, block, group, created, quota FROM User")
  }

  /**
   * Получаем все данные о пользователе
   * @param {Object} user логин пользователя
   * @returns {Object}
   */
  getUser(user) {
    // firstName as firstName, lastName as 
    return this.queryOne("select @rid as rid, username, email, block, group, created, quota from User where username =: name ", {
      params: {
        name: user
      }
    })
  }


  /**
   * Получаем @rid пользователя
   * @param {Object} user логин пользователя
   * @returns { '@rid': RecordID { cluster: integer, position: integer } }
   */
  getRid(user) {
    return this.queryOne("select @rid from User where username =: name ", {
      params: {
        name: user
      }
    })
  }
}

export {
  UserModel
}