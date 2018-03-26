
const HtmlWebpackPlugin = require('html-webpack-plugin');
// This plugin creates an index.html file that links to the bundle
// in the output directory. It's kind of a Webpack staple since
// Webpack itself doesn't output anything but JS.

const CopyWebpackPlugin = require('copy-webpack-plugin');
// This plugin copies the index file over, since it's full of stuff
// that we can't really process using html-webpack-plugin

const path = require('path');


module.exports = {

  // Entry is where the dependency crawl starts
  entry: './src/app.js',

  // Output is where it ends, essentially.
  // Saves the output file here.
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },

  // So this part is because we're using Bower.
  // Basically we need to tell Webpack to search for dependencies
  // in both node_modules and bower_components.
  resolve: {
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'bower_components')
    ]
  },

  // Now we specify different module inputs. Usually a file extension
  // but we can test for pretty much anything.
  // Webpack will treat anything that passes a test as a module.
  module: {
    rules: [
      {
        test: /\.html$/,
        // So in this case we're handling all files that end in .html here.
        // The test is a regex.

        exclude: '/src/index.html',
        // I'm not totally sure this does anything at all, tbh

        use: [
          // Apparently chained loaders run last-to-first. So we
          // load files through our polymer-webpack-loader before
          // running them through babel-loader

          { loader: 'babel-loader' },
          { loader: 'polymer-webpack-loader' }
        ]
      },
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.ejs'),
      inject: false
      // This means we have to have an index.ejs template file
      // in our src directory. It will output a file we can use
      // in the dev server, I guess.

    }),
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'bower_components/webcomponentsjs/*.js'),
      to: 'bower_components/webcomponentsjs/[name].[ext]'
      // This is our polyfills. We have to copy them directly from bower_components
      // And leave them untouched, as we would if we were developing without Webpack.

    }])
  ],
  devServer: {
    contentBase: './dist',
    port: 4000
  }
}