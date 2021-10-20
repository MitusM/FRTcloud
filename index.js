import Gateway from './core/micromq/gateway.js'
import dotenv from 'dotenv'

import {
    error
} from './core/error.js'

import {
    middlewares
} from './core/middlewares.js'

import {
    action
} from './core/action.js'

dotenv.config()

const rabbitUrl = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672/'
const timeout = process.env.TIMED_OUT || 5000
// === === === === === === === === === === === ===
// 1. Gateway connection
// === === === === === === === === === === === ===
const app = new Gateway({
    microservices: ['auth', 'users', 'render', 'files'],
    rabbit: {
        url: rabbitUrl
    },
    requests: {
        timeout: timeout,
    }
})

// === === === === === === === === === === === ===
// 2. error - Create an Error event and handler
//    error - создаем событие error и обработчик
// === === === === === === === === === === === ===
error(app)

// === === === === === === === === === === === ===
// 3. middleware - setup route middlewares
// === === === === === === === === === === === ===
middlewares(app)

// === === === === === === === === === === === ===
// 4. actions
// === === === === === === === === === === === ===
action(app)

// === === === === === === === === === === === ===
// 5. Connecting and microservice endpoints
// === === === === === === === === === === === ===
app.all('/:microservice/(.*)', async (req, res) => {
    await res.delegate(req.params.microservice);
})

// We listen to the port and accept requests
app.listen(process.env.PORT || 7606)