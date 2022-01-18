import path from 'path'
import pkg from 'app-root-path'
import dotenv from 'dotenv'
import { createRequire } from 'module'

import { Cache } from '../service/cacheServices.js'

const require = createRequire(import.meta.url)
const appRoot = pkg.path
dotenv.config()
/**  */
const lang = require('../lang/ru')
/** */
const templateDir = path.join(appRoot, process.env.VIEW_DIR)

const Redis = new Cache({ db: 1 })

const errorHandler = (res, message) => {
  // {"message":{}}
  return res.status(200).json({ message: message })
}

async function arrToObject(arr) {
  return await Promise.all(arr)
    .then((arrs) => {
      return arrs.reduce((o, v) => {
        let key = Object.keys(v)
        let val = v[key]
        return (o[key] = val), o
      }, {})
    })
    .catch((err) => {
      return err.message
    })
}

let extend = function () {
  let merged = {}
  Array.prototype.forEach.call(arguments, function (obj) {
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) return
      merged[key] = obj[key]
    }
  })
  return merged
}

Array.prototype.last = function () {
  return this[this.length - 1]
}

const lastRid = function (arr) {
  return arr.last().rid
}

const endpoints = async (app) => {
  /**  */
  const db = await app.options.db
  /**  */
  app.get('/users/', async (req, res) => {
    try {
      let users
      let limit
      let quota
      let page
      // let del = await Redis.delPattern('userPage:Admin:*')
      // console.log('⚡ del::', del)
      // FIXME: this settings limit paginate
      let multi = await Redis.multi()
        .get('users:settings')
        .get('userPage:Admin:list:1')
        .exec()

      let settings = JSON.parse(multi[0][1])
      /**  */
      if (multi[0][0] !== null || multi[1][0] !== null) {
        // FIXME: this errorHandler - get
        return errorHandler(res, 'Multiple error Redis')
      }
      /** Settings User */
      /** Если данных нет в Redis */
      if (settings === null) {
        /** Запрашиваем настройки в БД */
        let s = await db.getSettings()
        // Если нет в БД, то берём по дефолту
        if (s === undefined) {
          limit = process.env.USER_LIMIT
          quota = process.env.USER_QUOTA
        } else {
          limit = s.settings.limit
          quota = s.settings.quota
        }
      } else {
        // берём из Redis
        limit = settings.limit
        quota = settings.quota
      }

      /** User page */
      if (multi[1][1] === null) {
        users = await db.getUserAll(limit)
        const { response } = await res.app.ask('render', {
          server: {
            action: 'html',
            meta: {
              dir: templateDir, // directory users template
              page: process.env.TEMPLATE_FILE, // file template
              // data for template
              data: {
                csrf: req.session.csrfSecret,
                title: 'Пользователи | cloudFRT',
                users: users, // Получаем список пользователей
                lang: lang,
                page: './page/main-content.html',
                breadcrumb: 'users',
                last_rid: lastRid(users), //users.last().rid,
                number: 1,
                quota: quota,
              },
            },
          },
        })
        Redis.set('userPage:Admin:list:1', response.html)
        page = response.html
      } else {
        page = multi[1][1]
      }
      res.status(200).end(page)
    } catch (err) {
      console.log('⚡ err::/users/', err)
      return errorHandler(res, err)
    }
  })

  /**
   * Настройки - Settings
   */
  app.get('/users/settings(.*)', async (req, res) => {
    try {
      /**  */
      let settings
      let page = await Redis.multi()
        .get('users:settings')
        .get('userPage:Admin:settings')
        .exec()

      if (page[0][1] === null) {
        settings = {
          quota: process.env.USER_QUOTA,
          limit: process.env.USER_LIMIT,
          cache: process.env.CACHE,
        }
      } else {
        settings = JSON.parse(page[0][1])
      }

      if (page[1][1] === null) {
        const { response } = await res.app.ask('render', {
          server: {
            action: 'html',
            meta: {
              dir: templateDir, // directory users template
              page: process.env.TEMPLATE_FILE, // file template
              // data for template
              data: {
                csrf: req.session.csrfSecret,
                title: 'Настройки | cloudFRT',
                lang: lang,
                page: './page/settings.html',
                breadcrumb: 'settings',
                settings: settings,
              },
            },
          },
        })
        Redis.set('userPage:Admin:settings', response.html)
        page = response.html
      } else {
        page = page[1][1]
      }

      res.status(200).end(page)
    } catch (err) {
      console.log('⚡ err::settings', err)
      // {"message":{}}
      return errorHandler(res, err)
    }
  })

  /*************************************
   *  * * * * * * POST * * * * * * *  *
   *************************************/

  // async function emailValidate(body, arr) {
  //   let email = await db.validateFields('email', body.email)
  //   email = email
  //     ? Promise.reject('Email уже используется')
  //     : new Promise((resolve) => resolve(body.email))
  //   arr.push({ email: await email })
  //   return arr
  // }

  // async function valPassword(body, arr) {
  //   let passSALT = body.password + process.env.SALT

  //   let data = await db.hashPassword(passSALT)
  //   arr.push({ hashedPassword: data.password })
  //   arr.push({ salt: data.salt })
  //   return arr
  // }

  //   async function userName(body, arr) {
  //     let username = await db.validateFields('username', body.username)
  //     // ------------------->
  //     username = username
  //       ? Promise.reject('Логин занят')
  //       : new Promise((resolve) => resolve(body.username))
  //     arr.push({ username: await username })
  //     return arr
  //   }
  // })

  app.post('/users/update', async (req, res) => {
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        let rid = body.rid
        let arr = []
        let set = []

        if (rid) {
          let quota = body.quota * (1024 * 1024 * 1024)
          let user = await db.getUser(rid)
          console.log('⚡ user::', user)
          if (user.username !== body.username) {
            let username = await db.validateFields('username', body.username)
            username = username
              ? Promise.reject('Логин занят')
              : new Promise((resolve) => resolve(body.username))
            arr.push({ username: await username })

            set.push('username =:username')
          }

          if (user.email !== body.email) {
            // arr = emailValidate(body, arr)

            let email = await db.validateFields('email', body.email)
            email = email
              ? Promise.reject('Email уже используется')
              : new Promise((resolve) => resolve(body.email))
            arr.push({ email: await email })
            set.push('email =:email')
          }

          if (quota !== user.quota) {
            // console.log('⚡ quota !== user.quota::', quota !== user.quota)
            arr.push({ quota: await new Promise((resolve) => resolve(quota)) })
            set.push('quota =:quota')
          }

          if (body.group !== user.group) {
            arr.push({
              group: await new Promise((resolve) => resolve(body.group)),
            })
            set.push('group =:group')
          }

          if (body.password !== '') {
            // arr = valPassword(body, arr)

            let passSALT = body.password + process.env.SALT
            let data = await db.hashPassword(passSALT)
            arr.push({ hashedPassword: data.password })
            arr.push({ salt: data.salt })
            set.push('password =:password, salt =:salt')
          }

          let obj = await arrToObject(arr)
          let userUpdated = await db.update(set.toString(), rid, obj)
          // FIXME: Убрать hashPassword, salt
          let newUser = extend(user, obj)
          //   {
          //     username: user.username,
          //     email: user.email,
          //     group: user.group,
          //     block: user.block,
          //     quota: user.quota,
          //     rid: user.rid,
          //     _id: user._id,
          //   },
          //   obj,
          // )

          if (userUpdated.count > 0) {
            res.status(200).json({
              status: 200,
              // html: response.html,
              id: user._id,
              user: obj,
              attr: newUser,
            })
          }
        } else {
          errorHandler(res, 'No rid')
        }
      }
    } catch (err) {
      errorHandler(res, err)
    }
  })

  app.post('/users/delete/:id', async (req, res) => {
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        if (body.rid) {
          /**
           * @type {Object} count: 1
           **/
          let user = await db.deleteUser(body.rid).catch((err) => {
            return errorHandler(res, err)
          })

          if (user.count > 0) {
            res.status(200).json({ status: 200, count: user })
          } else {
            errorHandler(res, 'No User delete')
          }
        }
      }
    } catch (err) {
      errorHandler(res, err)
    }
  })

  app.post('/users/page-:num', async (req, res) => {
    // TODO: num is not supported
    try {
      const num = req.params.num || 1
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        let usersPage = `userPage:Admin:list:${num}`
        let limit
        let quota
        let obj = {}
        let multi = await Redis.multi()
          .get('users:settings')
          .get(usersPage)
          .exec()

        let settings = JSON.parse(multi[0][1])

        /**  */
        if (multi[0][0] !== null || multi[1][0] !== null) {
          // FIXME: this errorHandler - get
          return errorHandler(res, 'Multiple error Redis')
        }

        /** Settings User */
        if (settings === null) {
          /** Запрашиваем настройки в БД */
          let s = await db.getSettings()
          // Если нет в БД, то берём по дефолту
          if (s === undefined) {
            limit = process.env.USER_LIMIT
            quota = process.env.USER_QUOTA
          } else {
            limit = s.settings.limit
            quota = s.settings.quota
          }
        } else {
          // берём из Redis
          limit = settings.limit
          quota = settings.quota
        }

        /** User page */
        if (multi[1][1] === null) {
          // FIXME: this settings limit paginate
          let users = await db.paginate(body.rid, limit)
          let length = users.length
          // let obj = {}
          if (length > 0) {
            let last = users.last().rid

            const { response } = await res.app.ask('render', {
              server: {
                action: 'html',
                meta: {
                  dir: templateDir, // directory users template
                  page: 'page/user-table-body.html', // file template
                  // data for template
                  data: {
                    users: users,
                    number: num,
                  },
                },
              },
            })
            obj.page = response.html
            obj.last = last
            obj.total = length
          } else {
            obj.total = length
          }
          Redis.set(usersPage, JSON.stringify(obj))
          // res.status(200).json({ status: 200, ...obj })
        } else {
          obj = JSON.parse(multi[1][1])
          // res.status(200).json({ status: 200, ...o })
        }

        res.status(200).json({ status: 200, ...obj })
      } else {
        // no CSRF protection
      }
    } catch (err) {
      console.log('⚡ err::page', err)
      errorHandler(res, err)
    }
  })

  /** POST: We receive user data */
  // FIXME: id-:id Не везде срабатывает, если id-kGSY-eASsnxSR-Y897dLo
  app.post('/users/:id', async (req, res) => {
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        if (body.rid) {
          let user = await db.getUser(body.rid).catch((err) => {
            return errorHandler(res, err)
          })
          res.status(200).json(user)
        } else {
          errorHandler(res, 'User not rid') // User not found
        }
      } else {
        // no CSRF protection
      }
    } catch (err) {
      errorHandler(res, err)
    }
  })

  /*************************************
   * * * * * * * * PUT * * * * * * * * *
   *************************************/

  app.put('/users/settings(.*)', async (req, res) => {
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        let obj = {
          limit: body.limit,
          quota: body.quota,
          cache: body.cache,
        }
        /** Сохраняем или обновляем настройки в БД */
        let settings = await db.setSettings(obj)
        /** Сохраняем или обновляем настройки в Redis */
        let setRedis = await Redis.set('users:settings', JSON.stringify(obj))
        /** Удаляем страницы из Redis - кэш */
        let del = await Redis.delPattern('userPage:Admin:*')
        // console.log('⚡ del::', del)
        let status = 201
        let message = {}
        if (settings.count === 1) {
          message.bd = 1
        } else {
          status = 200
          message.bd = 0
        }

        if (setRedis === 'OK') {
          message.redis = 1
        } else {
          status = 200
          message.redis = 0
        }

        if (del === true) {
          message.cache = 1
        } else {
          status = 200
          message.cache = 0
        }
        res.status(200).end({ status: status, message: message })
      } else {
        // no CSRF protection
      }
    } catch (err) {
      return errorHandler(res, err)
    }
  })

  /** PUT User Create */
  app.put('/users/create(.*)', async (req, res) => {
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        let arr = [
          { group: body.group },
          { _id: body.id },
          { block: false },
          // ------------------->
          { quota: body.quota * (1024 * 1024 * 1024) },
          // <-------------------
        ]
        if (body.username === '') {
          arr.push(Promise.reject('Username is required'))
        } else {
          // arr = await userName(body, arr)
          let username = await db.validateFields('username', body.username)
          // ------------------->
          username = username
            ? Promise.reject('Логин занят')
            : new Promise((resolve) => resolve(body.username))
          arr.push({ username: await username })
          // <-------------------
        }

        if (body.password === '' && body.target === 'add') {
          arr.push(Promise.reject('Password is required'))
        } else {
          // ------------------->
          /**  */
          // arr = await valPassword(body, arr)
          let passSALT = body.password + process.env.SALT

          let data = await db.hashPassword(passSALT)
          arr.push({ hashedPassword: data.password })
          arr.push({ salt: data.salt })

          // <-------------------
        }

        // console.log(body.email === '' && req.session.user.group !== 'admin')
        if (body.email === '' && req.session.user.group !== 'admin') {
          arr.push(Promise.reject('Email is required'))
        } else {
          // ------------------->
          // arr = await emailValidate(body, arr)
          let email = await db.validateFields('email', body.email)
          email = email
            ? Promise.reject('Email уже используется')
            : new Promise((resolve) => resolve(body.email))
          arr.push({ email: await email })
          // <-------------------
        }
        // ------------------->
        let obj = await arrToObject(arr)
          // let obj = await Promise.all(arr)
          //   .then((arrs) => {
          //     return arrs.reduce((o, v) => {
          //       let key = Object.keys(v)
          //       let val = v[key]
          //       return (o[key] = val), o
          //     }, {})
          //   })
          .catch((err) => {
            return err.message
          })
        // <-------------------

        let user = await db.setCreated(obj)
        /** Удаляем страницы из Redis - кэш */
        let del = await Redis.delPattern('userPage:Admin:*')

        // ------------------->
        const { response } = await res.app.ask('render', {
          server: {
            action: 'html',
            meta: {
              dir: templateDir, // directory users template
              page: 'page/user-table-item.html', // file template
              // data for template
              data: {
                user: user,
              },
            },
          },
        })

        res.status(200).json({ status: 200, html: response.html, id: user._id })
        // <-------------------
      } else {
        // crf token is no
      }
    } catch (err) {
      console.log('⚡ err::create', err)
      errorHandler(res, err)
    }
  })

  app.put('/users/(lock|unlock)-:id(.*)', async (req, res) => {
    // TODO: lock unlock and id is not supported
    try {
      const body = req.body
      if (body.csrf === req.session.csrfSecret) {
        let rid = body.rid
        if (rid) {
          let updated = await db
            .update('block= :block', rid, {
              block: body.lock,
            })
            .catch((err) => {
              return err //errorHandler(res, err)
            })
          if (updated.count > 0) {
            /** Удаляем страницы из Redis - кэш */
            let del = await Redis.delPattern('userPage:Admin:*')
          }
          let t =
            updated.count > 0
              ? { status: 201, count: 1 }
              : { status: 200, count: 0 }
          res.status(200).json({ ...t })
        } else {
          errorHandler(res, 'No rid found')
        }
      } else {
        // no CSRF protection
      }
    } catch (err) {
      errorHandler(res, err)
    }
  })

  return app
}

export { endpoints }
