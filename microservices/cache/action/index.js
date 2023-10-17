const action = async (app) => {
  const client = app.options.redis
  app.action('cache:get', async (meta, res) => {
    let options = meta.options
    let getRedis = await new client(options).get(meta.list)

    res.json({
      value: getRedis,
    })
    try {
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  app.action('cache:set', async (meta, res) => {
    let options = meta.options
    let setRedis = await new client(options).set(meta.key, meta.val)

    res.json({
      value: setRedis,
    })
    try {
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  return app
}

export { action }
