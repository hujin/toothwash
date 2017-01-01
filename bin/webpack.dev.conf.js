var path = require('path'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    utils = require('./utils'),
    config = require('../config'),
    baseWebpackConfig = require('./webpack.base.conf'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    getEntry = require('./getEntry');

var glob = require('glob');

var pages = getEntry('./src/pages/**/*.html');

Object.keys(baseWebpackConfig.entry).forEach(function (name) {
   baseWebpackConfig.entry[name] = ['./bin/dev-client'].concat(baseWebpackConfig.entry[name]);
});

module.exports = merge(baseWebpackConfig,{
   module:{
       loaders:utils.styleLoaders({sourceMap:config.dev.cssSourceMap})
   },
   devtool:'#eval-source-map',
   plugins:(function () {
       var plugin = [
           new webpack.optimize.OccurenceOrderPlugin(),
           new webpack.HotModuleReplacementPlugin(),
           new webpack.NoErrorsPlugin()
       ];

        for(var pathname in pages){
            plugin.push(new HtmlWebpackPlugin({
                filename:'pages/' + pathname + '.html',
                template:pages[pathname],
                inject:true,
                chunks: [pathname,'lib/components'],
                chunksSortMode:'dependency'
            }))
        }
        return plugin
   })()
});