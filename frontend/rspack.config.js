const rspack = require('@rspack/core');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('node:path'); // Use node: protocol

/** @type {import('@rspack/cli').Configuration} */
const config = {
  context: __dirname,
  entry: {
    main: './src/index.tsx',
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/', // Important for routing in production build served by Nginx
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true, // Use transpileOnly for faster builds, type checking handled separately
        },
      },
      // Add rules for CSS, images, etc. as needed
      // Example for CSS:
      // {
      //   test: /\.css$/,
      //   use: ['style-loader', 'css-loader'],
      //   type: 'javascript/auto' // Necessary for CSS handling in Rspack
      // },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    // Add other plugins like DefinePlugin for environment variables if needed
    // new rspack.DefinePlugin({
    //   'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    // })
  ],
  devServer: {
    // Rspack dev server options (used by `rspack serve`)
    port: 3000, // Default port for dev server
    historyApiFallback: true, // Enable SPA routing in dev server
    hot: true, // Enable Hot Module Replacement
  },
  // Set mode based on NODE_ENV or command line flag
  mode: process.env.NODE_ENV || 'development',
  // Enable source maps for debugging
  devtool: process.env.NODE_ENV === 'production' ? false : 'source-map',
};

module.exports = config;
