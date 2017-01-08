var path = require('path'),
    config = require('../config'),
    webpack = require('webpack'),
    merge = require('webpack-merge'),
    baseWebpackConfig = require('./webpack.base.conf'),
    getEntry = require('./getEntry'),
    utils = require('./utils'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

var env = config.build.env;

var glob = require('glob');

var pages = getEntry('./src/pages/**/*.html');

module.exports = merge(baseWebpackConfig,{
    module:{
      loaders:utils.styleLoaders({sourceMap:config.build.productionSourceMap,extract:true})
    },
    devtool: config.build.productionSourceMap ? '#source-map' :false,
    output:{
        path:config.build.assetsRoot,
        publicPath:'/',
        filename:utils.assetsPath('js/[name].[chunkhash].js'),
        chunkFilename:utils.assetsPath('js/[id].[chunkhash].js')
    },
    vue:{
        loaders:utils.cssLoaders({
            sourceMap:config.build.productionSourceMap,
            extract:true
        })
    },
    plugins:(function () {
        var plugin = [
            new webpack.DefinePlugin({
                'process.env':env
            }),
            new webpack.optimize.UglifyJsPlugin({
                compress:{
                    warnings:false
                }
            }),
            new webpack.optimize.OccurenceOrderPlugin(),
            new ExtractTextPlugin(utils.assetsPath('css/[name].[contenthash].css'))
        ];

        for(var pathname in pages){
            plugin.push(new HtmlWebpackPlugin({
                filename:'pages/' + pathname + '.html',
                template:pages[pathname],
                inject:true,
                chunks: [pathname,'lib/vendor','lib/manifest','lib/components'],
                minify:{
                    removeComments:true,
                    collapseWhitespace:true,
                    removeAttributeQuotes:true
                },
                chunksSortMode:'dependency'
            }))
        }

        plugin.push(new webpack.optimize.CommonsChunkPlugin({
            name:'lib/vendor',
            minChunks:function (module,count) {
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        path.join(__dirname,'../node_modules')
                    ) === 0
                )
            }
        }));

        plugin.push(new webpack.optimize.CommonsChunkPlugin({
            name:'lib/manifest',
            chunks:['vendor']
        }));

        return plugin;
    })()
});

if(config.build.productionGzip){
    var CompressionWebpackPlugin = require('compression-webpack-plugin');

    module.exports.plugins.push(
        new CompressionWebpackPlugin({
            asset:'[path].gz[query]',
            algorithm:'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold:10240,
            minRatio:0.8
        })
    )
}


