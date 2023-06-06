const path = require("path");

module.exports = {
  mode: "development",  //production
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      // css 載入器
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      },
      // babel 載入器
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      // file-loader
      {
        test: /\.(jpg|png|gif)$/, 
        use: {
          loader: 'file-loader',
          options: {
            // 定義打包後的檔案名稱；
            // [name]:原檔案名，[hash]:hash字串（如果沒定義，默認以hash命名，[ext]:原檔案的副檔名）
            name: '[name]_[hash].[ext]',
            outputPath: 'images/' //  圖片輸出的路徑（在output.path目錄下）
          }
        }
      },
      //svg loader
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      },

    ]
  },
  devServer: {
    port: 9000,
    static: "./dist",
    allowedHosts: ['all'],
    historyApiFallback: true,
    // historyApiFallback: { index: '/dist/index.html' }
  },
  performance: {
    hints: false
  },
  externals: {
    fs: 'commonjs fs'
  },
  devtool: 'inline-source-map'
};