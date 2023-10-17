import dotenv from 'dotenv'
dotenv.config()

const action = async (app) => {
  /** PostgresSQL */
  const client = app.options.bd
  app.action('geo:division:country', async (meta, res) => {
    try {
      let listCountry
      /** Получаем данные из Redis */
      const { status, response } = await res.app.ask('cache', {
        server: {
          action: 'cache:get',
          meta: {
            options: { db: 2 },
            list: 'country',
          },
        },
      })
      /**
       * Заносим данные полученные от Redis в переменную извлекая из объекта конечное значение
       
       * @returns {Boolean | Object} null - if no result or Object if the data is in redis
       */
      let country = response.value
      /** Если данные есть в Redis заносим в переменную и отдаём клиенту */
      if (country !== null) {
        listCountry = JSON.parse(country)
      } else {
        /** Если данных нет, то запрашиваем в БД и заносим в Redis */
        listCountry = await client.countryList()
        //TODO: status, response не использованы в коде. Игнорить или использовать?
        const { status, response } = await res.app.ask('cache', {
          server: {
            action: 'cache:set',
            meta: {
              options: { db: 2 },
              key: 'country',
              val: JSON.stringify(listCountry),
            },
          },
        })
      }

      res.json({
        country: listCountry,
      })
    } catch (err) {
      console.log('⚡ err::geo:division', err)
      process.exit(err)
    }
  })

  app.action('geo:division:list', async (meta, res) => {})

  return app
}

export { action }
