const action = async (app) => {
  app.action('geo:division:country', async (meta, res) => {
    try {
      const client = await app.options.db
      const listCountry = await client.countryList()
      // .then((country) => res.json(country))
      // .catch((err) => res.json(err))
      res.json({
        country: listCountry,
      })
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  return app
}

export { action }
