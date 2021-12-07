const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = () => {
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: "../css/[name].css",
        chunkFilename: "../css/[name].[id].css",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "../images/",
                // out
              },
            },
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
  };
};
