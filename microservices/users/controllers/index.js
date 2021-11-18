import path from "path";
// import * as path from "path";
import pkg from "app-root-path";
import dotenv from "dotenv";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { UserModel } from "../service/modelServices.js";

const appRoot = pkg.path;
dotenv.config();
/**  */
const lang = require("../lang/ru");
/** */
const templateDir = path.join(appRoot, process.env.VIEW_DIR);
console.log("⚡ templateDir::", templateDir);

const endpoints = async (app) => {
  /**  */
  const db = await new UserModel().connect({
    name: process.env.ORIENTDB_NAME,
    username: process.env.ORIENTDB_USERNAME,
    password: process.env.ORIENTDB_PASSWORD,
  });

  app.get("/users/", async (req, res) => {
    try {
      /**  */
      const users = await db.getUserAll();

      const auth = await db.getLogin({
        username: "misha",
        password: "#23a50zJs&$",
      });
      console.log("⚡ auth::", auth);

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
              users: users,
              lang: lang,
              page: "./page/main-content.html",
              breadcrumb: "users",
            },
          },
        },
      });

      res.status(200).end(response.html);
    } catch (err) {
      console.log("⚡ err", err);
      console.log("⚡ err::users", err);
      process.exit();
    }
  });

  app.get("/users/settings(.*)", async (req, res) => {
    try {
      /**  */

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
      process.exit();
    }
  });

  return app;
};

export { endpoints };
