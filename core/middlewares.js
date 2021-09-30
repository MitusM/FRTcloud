'use strict'
const csrf = require('csurf')


module.exports = (app) => {
  // 3.1 Session

  // 3.2 CSRF
  app.use(csrf())

  return app
}