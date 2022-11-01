/** ***** ***** ***** ***** ***** ***** *****
 * *  middleware - setup route middlewares  *
 * Copyright (c) 2021 MitusM.
 *
 * ***** ***** ***** ***** ***** ***** ***** */
'use strict'

const middlewares = (app) => {
  app.all(['/geo/:endpoint'], async (req, res, next) => {
    console.log('🪐 req::endpoint', req.params.endpoint)
    if (!req.session.auth) {
      const redirect = await res.app.ask('auth', {
        server: {
          action: 'aut:redirect',
          meta: {
            csrf: req.session.csrfSecret,
          },
        },
      })
      res.end(redirect.response)
    } else {
      next()
    }
  })

  return app
}

export { middlewares }
