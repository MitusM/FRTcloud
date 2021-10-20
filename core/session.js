import {
    createRequire
} from "module";
const require = createRequire(
    import.meta.url);
import dotenv from 'dotenv'
dotenv.config()

const session = require("./session/index")
const Connect = require('./connect-session-orientdb/index.cjs')(session)
const options = {
    host: process.env.ORIENTDB_HOST, //
    port: process.env.ORIENTDB_PORT, //
    httpPort: process.env.ORIENTDB_HTTPPORT, //
    username: process.env.ORIENTDB_USERNAME,
    password: process.env.ORIENTDB_PASSWORD,
    name: process.env.ORIENTDB_NAME,
    pool: process.env.ORIENTDB_POOL,
    tableName: process.env.ORIENTDB_TABLENAME,
}

let sessionApp = (app) => {
    // TODO: Перенести в конфиг
    app.use(session({
        secret: 'wuxHK8j2m2DiOkbFb8TzaqHm',
        name: 'sid',
        resave: false, // не сохранять сеанс, если он не изменен
        saveUninitialized: true,
        cookie: {
            "path": "/",
            "httpOnly": false,
            "secure": false,
            // "maxAge": 36000000
            "maxAge": 1000 * 60 * 60 * 24 * 14 // expires in 14 days
        },
        store: new Connect(options)
    }))
    return Connect
}

export {
    sessionApp as session
}