module.exports = () => {
  return {
    module: {
      rules: [
        {
          test: /\.(gif|png|jpe?g|webp|svg)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                outputPath: "../images/",
                name: "[name].[ext]",
              },
            },
            {
              loader: "image-webpack-loader",
              options: {
                bypassOnDebug: true, // webpack@1.x
                disable: true, // webpack@2.x and newer
                mozjpeg: {
                  progressive: true,
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.9],
                  speed: 4,
                },
                // gifsicle: {
                //   interlaced: false,
                // },
                // the webp option will enable WEBP
                webp: {
                  quality: 75,
                },
              },
            },
          ],
        },
      ],
    },
  };
};
