const action = async (app) => {
  const client = app.options.redis
  app.action('cache:get', async (meta, res) => {
    try {
      let options = meta.options
      let getRedis = await new client(options).get(meta.list)

      res.json({
        value: getRedis,
      })
    } catch (err) {
      process.exit(err)
    }
  })

  app.action('cache:set', async (meta, res) => {
    try {
      let options = meta.options
      let setRedis = await new client(options).set(meta.key, meta.val)

      res.json({
        value: setRedis,
      })
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  app.action('cache:multi', async (meta, res) => {
    let options = meta.options
    let list = meta.list
    let multi = await new client(options).multi(list).exec()

    res.json({ ...multi })
  })

  app.action('cache:del', async (meta, res) => {
    try {
      let options = meta.options
      let pattern = meta.pattern
      let del = await new client(options).delPattern(pattern)
      console.log('⚡ del::', del)
      res.end(del)
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  return app
}

export { action }
