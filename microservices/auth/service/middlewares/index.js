/** ***** ***** ***** ***** ***** ***** *****
 ** middleware - setup route middlewares
 * Copyright 
 *   
 * ***** ***** ***** ***** ***** ***** ***** */
'use strict'

import csrf from 'csurf'

const middlewares = (app) => {
    // 3.1 Session

    // 3.2 CSRF
    app.use(csrf())

    return app
}

export {
    middlewares
}