'use strict'

module.exports = (app) => {
  app.on('error', (err, req, res) => {
    res.status(err.status || 500)
    console.log('error:::::::::::::::', err)
    res.json({
      error: err.message || 'Server error'
    })
  })
  
  
  app.use(async (req, res, next) => {
    try {
      await next();
    } catch (err) {
      res.status(err.status || 500)
      res.json({
        error: err.message || 'Server error'
      })
      app.emit('error', err, req, res)
    }
  })
  return app
}