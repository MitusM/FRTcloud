import dotenv from 'dotenv'
import pkg from 'app-root-path'
const reqModule = pkg.require
const MicroMQ = reqModule('./core/micromq/src/MicroService.js')

import { error } from './service/errorServices.js'

import { middlewares } from './service/middlewares/index.js'

import { action } from './action/index.js'

import { endpoints } from './controllers/index.js'

dotenv.config()
const rabbitUrl = process.env.RABBIT_URL || 'amqp://guest:guest@localhost:5672/'
const timeout = process.env.TIMED_OUT
// === === === === === === === === === === === ===
// 1. Create an instance of a MicroService class
// === === === === === === === === === === === ===
const app = new MicroMQ({
  microservices: ['users', 'render', 'files', 'article'],
  name: 'auth',
  rabbit: {
    url: rabbitUrl,
  },
  requests: {
    timeout: timeout,
  },
})
// === === === === === === === === === === === ===
// 2. error - Create an Error event and handler
// === === === === === === === === === === === ===
error(app)

// === === === === === === === === === === === ===
// 3. middlewares - setup route middlewares
// === === === === === === === === === === === ===
middlewares(app)

// === === === === === === === === === === === ===
// 4. actions
// === === === === === === === === === === === ===
action(app)

// === === === === === === === === === === === ===
// 5.URL (interfaces)
// === === === === === === === === === === === ===
endpoints(app)

// === === === === === === === === === === === ===
// 6. Run Microservice
// === === === === === === === === === === === ===
app.start()
