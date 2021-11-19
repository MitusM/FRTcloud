import path from "path";
import pkg from "app-root-path";
import dotenv from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const appRoot = pkg.path;
dotenv.config();

/**  */
const lang = require("../lang/ru");
/** */
const templateDir = path.join(appRoot, process.env.VIEW_DIR);
export let endpoints = (app) => {
  app.get("/auth/login(.*)", async (req, res) => {
    try {
      /**  */
      const { response } = await res.app.ask("render", {
        server: {
          action: "html",
          meta: {
            dir: templateDir, // directory users template
            page: process.env.TEMPLATE_FILE, // file template
            // data for template
            data: {
              csrf: req.session.csrfSecret,
              title: "Авторизация | cloudFRT",
              lang: lang,
            },
          },
        },
      });

      res.status(200).end(response.html);
    } catch (err) {
      console.log("⚡ err::login", err);
    }
  });

  app.get("/auth/logout(.*)", async (req, res) => {
    let location = req.headers.referer;
    res.json({
      server: {
        action: "gateway:session-destroy",
        meta: {
          sid: req.sessionID,
          location: location,
        },
      },
    });
  });

  app.post("/auth/signin(.*)", async (req, res) => {
    try {
      /** username and password and csrf */
      let body = req.body;
      if (req.session.csrfSecret === body.csrf) {
        /**
         * null - пользователя не существует
         * false - если совпал логин, но не совпадают пароли
         * object - {данные пользователя}
         * */
        const { response } = await res.app.ask("users", {
          server: {
            action: "user:auth",
            meta: {
              username: body.username,
              password: body.password,
            },
          },
        });
        console.log("⚡ response::", response);
        let message;
        let location;
        let status;

        switch (response.user) {
          case false:
            status = 203;
            message = "Не верный логин, или пароль";
            break;
          case null:
            status = 204;
            message = "Пользователя не существует";
            break;
          default:
            status = 302;
            location = req.headers.referer;
            res.headers.location = location;
            res.json({
              server: {
                action: "gateway:session",
                meta: {
                  sid: req.sessionID,
                  session: req.session,
                  auth: true,
                  user: {
                    username: response.user.username,
                    _id: response.user._id,
                    block: response.user.block,
                    group: response.user.group,
                    quote: response.user.quota,
                    email: response.user.email,
                    salt: response.user.salt,
                    created: response.user.created,
                    rid: response.user["@rid"],
                  },
                },
              },
            });
            break;
        }

        res.status(200).end(
          location || {
            status: status,
            message: message,
          }
        );
        // .end(message)
      } else {
        res.status(403).end();
      }
    } catch (err) {
      console.log("⚡ err::login[post]", err);
      // process.exit()
    }
  });

  return app;
};
