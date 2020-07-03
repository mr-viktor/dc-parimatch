const path = require("path");

import TerserWebpackPlugin from "terser-webpack-plugin";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = !isProduction;

const plugins = () => {
  const base = [];

  if (isProduction) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

const jsLoaders = () => {
  const loaders = [
    {
      loader: "babel-loader"
    }
  ];

  if (isDevelopment) {
    loaders.push("eslint-loader");
  }

  return loaders;
};

module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", path.resolve(__dirname, "src/js/index.js")],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: jsLoaders()
      },
      {
        loader: "webpack-modernizr-loader",
        test: /\.modernizrrc\.js$/
      }
    ]
  },
  plugins: plugins(),
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    minimize: isProduction,
    minimizer: [
      new TerserWebpackPlugin({
        sourceMap: false,
        extractComments: false,
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, ".modernizrrc"),
      "@": path.resolve(__dirname, "src/js")
    }
  },
  devtool: isDevelopment ? "#eval-source-map" : false
};
