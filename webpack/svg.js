module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.svg/,
          // type: "asset",
          // use: "svgo-loader",
          // type: "asset/inline",
          use: "file-loader",
          //   use: {
          //     // loader: 'svg-inline-loader?classPrefix',
          //     loader: "svg-url-loader",
          //     options: {
          //       encoding: "base64",
          //     },
          //   },
        },
      ],
    },
  };
};
