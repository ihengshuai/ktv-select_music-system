const webpack = require("webpack");
module.exports = {
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        })
      ],
      externals: 'hls.js'    //  忽略hls.js报的错
    }
  }