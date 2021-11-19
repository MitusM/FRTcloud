import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dotenv from "dotenv";
dotenv.config();

const redis = require("redis");
const session = require("./session/index");
let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient();

let sessionApp = (app) => {
  // TODO: Перенести в конфиг .env
  app.use(
    session({
      secret: "wuxHK8j2m2DiOkbFb8Hm",
      name: "sid",
      resave: false, // не сохранять сеанс, если он не изменен
      saveUninitialized: true,
      cookie: {
        path: "/",
        httpOnly: false,
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 14, // expires in 14 days
      },
      store: new RedisStore({ client: redisClient }),
    })
  );
};

export { sessionApp as session };
