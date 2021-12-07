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

const errorHandler = (res, message) => {
  return res.status(200).json({ message: message });
};

const endpoints = async (app) => {
  /**  */
  const db = await app.options.db;
  /**  */
  app.get("/users/", async (req, res) => {
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
              title: "Пользователи | cloudFRT",
              users: await db.getUserAll(), // Получаем список пользователей
              lang: lang,
              page: "./page/main-content.html",
              breadcrumb: "users",
            },
          },
        },
      });

      res.status(200).end(response.html);
    } catch (err) {
      console.log("⚡ err::/users/", err);
      return err;
    }
  });

  /**
   *
   */
  app.get("/users/settings(.*)", async (req, res) => {
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
              title: "Настройки | cloudFRT",
              lang: lang,
              page: "./page/settings.html",
              breadcrumb: "settings",
            },
          },
        },
      });

      res.status(200).end(response.html);
    } catch (err) {
      console.log("⚡ err", err);
      console.log("⚡ err::users", err);
      return err;
    }
  });

  /*************************************
   *  * * * * * * POST * * * * * * *  *
   *************************************/
  app.post("/users/create(.*)", async (req, res) => {
    try {
      const body = req.body;

      if (body.csrf === req.session.csrfSecret) {
        let arr = [
          { group: body.group },
          { _id: body.id },
          { block: false },
          { quota: body.quota * (1024 * 1024 * 1024) },
        ];
        if (body.username === "") {
          arr.push(Promise.reject("Username is required"));
        } else {
          let username = await db.validateFields("username", body.username);
          username = username
            ? Promise.reject("Логин занят")
            : new Promise((resolve) => resolve(body.username));
          arr.push({ username: await username });
        }

        if (body.password === "") {
          arr.push(Promise.reject("Password is required"));
        } else {
          /**  */
          let passSALT = body.password + process.env.SALT;

          let data = await db.hashPassword(passSALT);
          arr.push({ hashedPassword: data.password });
          arr.push({ salt: data.salt });
        }

        // req.session.user.group !== "admin":: false
        console.log(body.email === "" && req.session.user.group !== "admin");
        if (body.email === "" && req.session.user.group !== "admin") {
          arr.push(Promise.reject("Email is required"));
        } else {
          let email = await db.validateFields("email", body.email);
          email = email
            ? Promise.reject("Email уже используется")
            : new Promise((resolve) => resolve(body.email)); //{ email:  body.email }
          arr.push({ email: await email });
        }

        let obj = await Promise.all(arr)
          .then((arrs) => {
            return arrs.reduce((o, v) => {
              let key = Object.keys(v);
              let val = v[key];
              return (o[key] = val), o;
            }, {});
          })
          .catch((err) => {
            return err.message;
          });

        let user = await db.setCreated(obj).catch((err) => {
          // errorHandler(res, err);
          return err;
        });

        const { response } = await res.app.ask("render", {
          server: {
            action: "html",
            meta: {
              dir: templateDir, // directory users template
              page: "page/user-table-item.html", // file template
              // data for template
              data: {
                user: user,
              },
            },
          },
        });

        res
          .status(200)
          .json({ status: 200, html: response.html, id: user._id });
      } else {
        // crf token is no
      }
    } catch (err) {
      console.log("⚡ err::create", err);
      errorHandler(res, err);
    }
  });

  return app;
};

export { endpoints };
