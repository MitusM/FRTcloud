import {
  UserModel
} from '../service/modelServices.js'



const action = async (app) => {

  const db = await new UserModel().connect({
    db: process.env.ORIENTDB_BD,
    username: process.env.ORIENTDB_USERNAME,
    password: process.env.ORIENTDB_PASSWORD,
  })

  app.action('user:auth', async (meta, res) => {
    try {
      const auth = await db.getLogin({
        username: meta.username,
        password: meta.password
      })

      res.json({
        user: auth
      })
    } catch (err) {
      console.log('⚡ err::user:auth', err)
      process.exit(err)

    }
  })

  // app.action('', async (meta, res) => {
  //   try {

  //   } catch (err) {
  //     console.log('⚡ err::', err)
  //     process.exit(err)
  //   }
  // })
  return app
}

export {
  action
}