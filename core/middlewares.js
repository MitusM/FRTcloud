'use strict'
// const csrf = require('csurf')
import csrf from 'csurf'
import {
  session
} from './session.js'

const middlewares = (app) => {
  // 3.1 Session
  session(app)
  // 3.2 CSRF
  app.use(csrf())

  return app
}

export {
  middlewares
}