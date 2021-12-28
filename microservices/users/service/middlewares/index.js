/** ***** ***** ***** ***** ***** ***** *****
 * *  middleware - setup route middlewares  *
 * Copyright (c) 2021 MitusM.
 *
 * ***** ***** ***** ***** ***** ***** ***** */
'use strict'

const middlewares = (app) => {
  app.all(
    [
      '/users/',
      '/users/id-:id?.html',
      '/users/:page?-:number?.html',
      '/users/info-:id',
      '/users/create',
    ],
    async (req, res, next) => {
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
    },
  )

  return app
}

export { middlewares }
