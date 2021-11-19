import { createRequire } from "module";
const require = createRequire(import.meta.url);
import dotenv from "dotenv";
dotenv.config();

const redis = require("redis");
const session = require("./session/index");
const RedisStore = require("connect-redis")(session);
const redisClient = redis.createClient();
const RedisSess = new RedisStore({ client: redisClient });

const action = (app) => {
  app.action("gateway:session", async (meta, res) => {
    try {
      let sid = meta.sid;
      let sess = {
        ...meta.session,
        auth: meta.auth,
        user: meta.user,
      };
      let query = RedisSess.set(sid, sess);
    } catch (err) {
      console.error(err);
      return err;
    }
  });

  app.action("gateway:session-destroy", async (meta, res) => {
    try {
      //   let sid = meta.sid
      //   let connect = new UpdateSession(options)
      //   let destroy = await connect.delete(sid)
      //   if (destroy) {
      //     res.writeHead(302, {
      //       location: meta.location
      //     }).end()
      //   }
    } catch (err) {
      console.error(err);
      return err;
    }
  });

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
      store: RedisSess,
    })
  );

  return app;
};

export { action };
