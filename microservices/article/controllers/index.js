import path from 'path'
import pkg from 'app-root-path'
import dotenv from 'dotenv'
import { createRequire } from 'module'

import { Cache } from '../service/cacheServices.js'

// import Files from '../../../core/cloud/index.js'
import File from '../core/images/index.js'
import { stat } from 'fs/promises'

const require = createRequire(import.meta.url)
const appRoot = pkg.path
dotenv.config()
/**  */
const lang = require('../lang/ru')
/** */
const templateDir = path.join(appRoot, process.env.VIEW_DIR)

const Redis = new Cache({ db: 1 })

const errorHandler = (res, message) => {
  // get: {"message":{}}
  return res.status(200).json({ message: message })
}

// async function arrToObject(arr) {
//   return await Promise.all(arr)
//     .then((arrs) => {
//       return arrs.reduce((o, v) => {
//         let key = Object.keys(v)
//         let val = v[key]
//         return (o[key] = val), o
//       }, {})
//     })
//     .catch((err) => {
//       return err.message
//     })
// }
/**
 * Удаляем страницы из кэша (Redis)
 * @returns {Promise }
 */
let delCachePage = () => Redis.delPattern('article:Admin:*')

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
  app.get('/article/', async (req, res) => {
    try {
      console.log('⚡ req.params::/article/', req.params)
      // let users
      let limit
      let quota
      let page
      let del = await Redis.delPattern('articlePage:Admin:*')
      // FIXME: this settings limit paginate
      let multi = await Redis.multi()
        .get('settings:article')
        .get('articlePage:Admin:list:1')
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
        // users = await db.getAll(limit);
        const { response } = await res.app.ask('render', {
          server: {
            action: 'html',
            meta: {
              dir: templateDir, // directory users template
              page: process.env.TEMPLATE_FILE, // file template
              // data for template
              data: {
                csrf: req.session.csrfSecret,
                title: 'Статьи - Материалы | cloudFRT',
                lang: lang,
                page: './page/main-content.html',
                breadcrumb: 'article',
                number: 1,
              },
            },
          },
        })
        Redis.set('articlePage:Admin:list:1', response.html)
        page = response.html
      } else {
        page = multi[1][1]
      }
      res.status(200).end(page)
    } catch (err) {
      console.log('⚡ err::/article/', err)
      return errorHandler(res, err)
    }
  })

  app.get('/article/create-:add.:html', async (req, res) => {
    try {
      console.log('⚡ req.params::', req.params)
      let add = req.params.add
      let articleLimit
      let cacheServices
      let articleQuota
      let page
      let multi = await Redis.multi()
        .get('settings:article')
        .get(`articlePage:Admin:${add}`)
        .exec()

      let settings = JSON.parse(multi[0][1])

      if (settings === null) {
        let s = await db.getSettings()

        if (s === undefined) {
          articleLimit = process.env.ARTICLE_LIMIT
          cacheServices = process.env.CACHE
          articleQuota = process.env.ARTICLE_QUOTA
        } else {
          articleLimit = settings.limit
          cacheServices = settings.cache
          articleQuota = settings.quota
        }

        /**
         * cacheServices => false
         * Если кэширование страницы отклонено в настройках
         */
        if (!!cacheServices) {
          console.log('⚡ articleLimit::', articleLimit)
          console.log('⚡ articleQuota::', articleQuota)
          let title = lang.menu.add[add]
          console.log('⚡ title::', title)
          const { response } = await res.app.ask('render', {
            server: {
              action: 'html',
              meta: {
                dir: templateDir, // directory users template
                // FIXME: Перенести в настройки расположенные в БД
                page: process.env.TEMPLATE_FILE, // file template
                // data for template
                data: {
                  csrf: req.session.csrfSecret,
                  title: title,
                  lang: lang,
                  page: `./page/create/${add}.html`,
                  breadcrumb: add,
                  settings: settings, //? -
                },
              },
            },
          })

          page = response.html
        } else {
        }
      }
      res.status(200).end(page)
    } catch (err) {
      console.log('⚡ err::', err)
    }
  })

  /**
   * Настройки - Settings
   */
  app.get('/article/settings(.*)', async (req, res) => {
    try {
      /**  */
      let settings
      let page = await Redis.multi()
        .get('settings:users')
        .get('articlePage:Admin:settings')
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
                title: 'Настройки - Статьи | cloudFRT',
                lang: lang,
                page: './page/settings.html',
                breadcrumb: 'settings',
                settings: settings,
              },
            },
          },
        })
        Redis.set('article:Admin:settings', response.html)
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
  app.post('/upload/article-country', async (req, res) => {
    try {
      console.log('⚡ req.params::/upload/article-country', req.params)

      const body = req.body
      const files = body.files[0]
      /** Папка для уменьшенных копий */
      const resizeFolder = files.resize

      let Images = new File({
        webQuality: 50,
        jpgQuality: 70,
      })
      /** абсолютный путь до файла*/
      let absolutePathFile = files.isAbsolute
      // /**
      //  * Статистика файла
      //  */
      // let statFile = await Images.statFile(absolutePathFile)
      // /** Ширина изображения */
      // let imgWidth = statFile.width
      /** webp the images */
      let webpFolder = process.env.WEBP_FOLDER_COUNTRY
      /** Создаём копию оригинала в webp */
      let webp = await Images.webp(absolutePathFile, webpFolder)
      let wepFile = webp[0].destinationPath
      /**
       * Статистика файла
       */
      let statFile = await Images.statFile(wepFile)
      /** Ширина изображения */
      let imgWidth = statFile.width

      /**
       * Resize the image
       */
      let resolutionsArr = [360, 480, 768, 960, 1024, 1280, 1536]
      /**  */
      let minResolution = Images.util.minFilter(resolutionsArr, imgWidth)
      let img = await Images.resizeWEBP(minResolution, wepFile, resizeFolder)
      /** Превращаем массив с данными уменьшенных копий в объект */
      let obj = await Images.util.arrayToObject(img, 'width')
      /** Записываем данные оригинального webp изображения */
      obj[imgWidth] = {
        originalName: statFile.name,
        name: statFile.name,
        pathFile: wepFile.split(appRoot)[1],
        format: statFile.type,
        size: statFile.size,
        bytes: statFile.bytes,
        height: statFile.height,
        width: imgWidth,
      }
      /** Папки в которые сохраняем изображения */
      let folder = {
        webp: webpFolder,
        original: files.folder,
        resize: resizeFolder,
      }
      /** Оригинальное изображение */
      let statOriginalFile = await Images.metadata(files.isAbsolute)
      let file = {
        name: files.newName,
        pathFile: files.path,
        ...statOriginalFile,
      }

      console.log('⚡ files::', files)
      console.log('⚡ statFile::', statFile)
      console.log('⚡ folder::', folder)
      console.log('⚡ r::', minResolution)
      console.log('⚡ obj::', obj)
      console.log('⚡ f::', statOriginalFile)
      console.log('⚡ file::', file)

      res.status(200).json({
        status: 200,
        body: {
          folder: folder,
          original: file,
          resize: obj,
          resolution: minResolution,
        },
      })
    } catch (err) {
      console.log('⚡ err::upload', err)
      res.status(500).json({ status: 500, message: 'Server error' })
    }
  })

  /*************************************
   * * * * * * * * PUT * * * * * * * * *
   *************************************/

  app.put('/article/settings(.*)', async (req, res) => {
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
        let setRedis = await Redis.set('settings:users', JSON.stringify(obj))
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

  /*************************************
   * * * * * * * DELETE * * * * * * * * *
   *************************************/

  return app
}

export { endpoints }