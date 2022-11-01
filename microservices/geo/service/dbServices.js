// === === === === === === === === === === === ===
//
// === === === === === === === === === === === ===
import mysql from 'mysql2/promise'

class PDO {
  constructor() {}

  async connect(options = {}) {
    try {
      this.user = options.user
      this.password = options.password
      this.database = options.database
      this.options = options
      this.pool = mysql.createPool({
        host: options.localhost || 'localhost',
        user: options.user,
        database: options.database,
        password: options.password,
        waitForConnections: true,
        connectionLimit: options.connectionLimit || 10,
        queueLimit: options.queueLimit || 0,
      })

      return this
    } catch (err) {
      console.log('⚡ err::PDO.connect', err)
    }
  }

  async query(query) {
    return this.pool.query(query)
  }
}

export { PDO }
