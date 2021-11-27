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

const endpoints = async (app) => {
  app.get("/users/", async (req, res) => {
    try {
      /** Получаем список пользователей  */
      const db = await app.options.db;
      // const users = await db.getUserAll();

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
              users: await db.getUserAll(),
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

  return app;
};

export { endpoints };
