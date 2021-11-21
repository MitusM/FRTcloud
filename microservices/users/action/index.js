const action = async (app) => {
  app.action("user:auth", async (meta, res) => {
    try {
      const client = await app.options.db;
      const auth = await client.getLogin({
        username: meta.username,
        password: meta.password,
      });

      res.json({
        user: auth,
      });
    } catch (err) {
      console.log("⚡ err::user:auth", err);
      process.exit(err);
    }
  });

  return app;
};

export { action };
