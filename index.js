import Gateway from './core/micromq/gateway.js'
import dotenv from 'dotenv'
import { createRequire } from 'module'

import { error } from './core/error.js'

import { middlewares } from './core/middlewares.js'

import { action } from './core/action.js'

const require = createRequire(import.meta.url)

/**
 * Загрузка файлов.
 */
// const upload = require('./core/upload/index.cjs')
// import { upload } from './core/upload/index.cjs'
import { uploadFile } from './core/upload/index.js'

dotenv.config()

// var headers = Object.keys(headers).reduce((newHeaders, key) => {
//   newHeaders[key.toLowerCase()] = headers[key]
//   return newHeaders
// }, {})

const rabbitUrl = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672/'
const timeout = process.env.TIMED_OUT || 5000
// === === === === === === === === === === === ===
// 1. Gateway connection
// === === === === === === === === === === === ===
const app = new Gateway({
  microservices: ['auth', 'users', 'render', 'files', 'article'],
  rabbit: {
    url: rabbitUrl,
  },
  requests: {
    timeout: timeout,
  },
})

// === === === === === === === === === === === ===
// 2. error - Create an Error event and handler
//    error - создаем событие error и обработчик
// === === === === === === === === === === === ===
error(app)

// === === === === === === === === === === === ===
// 3. actions
// === === === === === === === === === === === ===
action(app)

// === === === === === === === === === === === ===
// 4. middleware - setup route middlewares
// === === === === === === === === === === === ===
middlewares(app)

// === === === === === === === === === === === ===
// 5. Connecting and microservice endpoints
// === === === === === === === === === === === ===
app.post('/upload/:microservice-:upload(.*)', async (req, res) => {
  try {
    console.log('⚡ req.session.auth::1', req.session.auth)
    if (req.session.auth === true) {
      console.log('⚡ req.params::1', req.params)
      let microservice = req.params.microservice
      let mi = req.params.upload
      let options = {
        upload: true,
        path: process.env.UPLOAD_DIR + microservice + '/' + mi + '/original/',
        resize:
          process.env.UPLOAD_DIR +
          microservice +
          '/' +
          mi +
          process.env.UPLOAD_RESIZE,
        basename: true,
        limits: {
          fileSize: 100 * 1024 * 1024,
        },
        mimeTypeLimit: process.env.UPLOAD_MIMETYPE,
      }
      console.log(
        '⚡ process.env.UPLOAD_MIMETYPE::',
        process.env.UPLOAD_MIMETYPE,
      )
      // try {
      // req.body = await upload(req, 'article')
      req.body = await uploadFile(req, options)
      console.log('⚡ req.body::gateway', req.body)
      // await res.delegate(microservice)
      await res.json({ ok: 200 })
      // } catch (err) {
      //   console.log('🌡 Error:upload:gateway', err)
      // }
    } else {
      await res.status(403).end({
        message: 'Unauthorized',
      })
    }
  } catch (err) {
    console.log('⚡ err::upload', err)
  }
})
app.all('/:microservice/(.*)', async (req, res) => {
  await res.delegate(req.params.microservice, req.pipe)
})

// We listen to the port and accept requests
app.listen(process.env.PORT || 7606)
