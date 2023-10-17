import pg from 'pg'
import Cursor from 'pg-cursor'
// import { Sequelize } from 'sequelize'
import { Sequelize, Model, DataTypes } from 'sequelize'
const { Pool } = pg

class bdPostgreSQL {
  constructor() {}

  /**
   *
   * @param {Object} options
   * @returns
   */
  async connect(options = {}) {
    try {
      this.user = options.user
      this.password = options.password
      this.database = options.database
      this.host = options.host || 'localhost'
      this.port = options.port || 5432
      this.ssl = options.ssl || true
      this.dialect = options.dialect || 'postgres'

      const pool = new Pool({
        user: this.user,
        host: this.host,
        database: this.database,
        password: this.password,
        port: this.port,
      })
      pool.on('error', (err, client) => {
        console.error('Error:', err)
      })

      this.pool = pool
      this.cursor = Cursor

      this.sequelize = new Sequelize(this.database, this.user, this.password, {
        host: this.host,
        dialect: this.dialect,
        pool: options.pool,
      })
        .authenticate()
        .then(() => {
          console.log('⚽️ Success!')
        })
        .catch((err) => {
          console.log(err)
        })

      // .sync()
      // .then(() => {
      //   console.log('Synced db.')
      // })
      // .catch((err) => {
      //   console.log('Failed to sync db: ' + err.message)
      // })

      return this
    } catch (err) {
      console.log('⚡ err ::PostgreSQL=>connect', err)
    }
  }
  /**
   *
   * @returns
   */
  endPool() {
    return this.pool.end()
  }
}

export { bdPostgreSQL, Model, DataTypes }
