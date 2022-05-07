import { createRequire } from 'module'
const require = createRequire(import.meta.url)
import dotenv from 'dotenv'

import csrf from 'csurf'

dotenv.config()
const redis = require('redis')
var session = require('express-session')
const RedisStore = require('connect-redis')(session)
const redisClient = redis.createClient()
const RedisSess = new RedisStore({ client: redisClient })

const action = (app) => {
  app.action('gateway:session', async (meta, res) => {
    try {
      RedisSess.set(meta.sid, {
        ...meta.session,
        auth: meta.auth,
        user: meta.user,
      })
    } catch (err) {
      console.error(err)
      return err
    }
  })

  app.action('gateway:session-destroy', async (meta, res) => {
    try {
      RedisSess.destroy(meta.sid)
      res
        .writeHead(302, {
          location: meta.location,
        })
        .end()
    } catch (err) {
      console.error(err)
      return err
    }
  })

  app.use(
    session({
      secret: 'wuxHK8j2m2DiOkbFb8Hm',
      name: 'sid',
      resave: false, // не сохранять сеанс, если он не изменен
      saveUninitialized: true,
      cookie: {
        path: '/',
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
      },
      store: RedisSess,
    }),
  )
  // 3.2 CSRF
  app.use(csrf())

  return app
}

export { action }
