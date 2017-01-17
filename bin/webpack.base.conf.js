var path = require('path'),
    config = require('../config'),
    utils = require('./utils'),
    getEntry = require('./getEntry'),
    projectRoot = path.resolve(__dirname,'../');

var glob = require('glob');

var entries = getEntry('./src/pages/**/*.js');

entries['lib/components'] = './lib/index.js';


var env = process.env.NODE_ENV;

var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap),
    cssSourceMapProd = (env === 'production' && config.build.productionSourceMap),
    useCssSourceMap = cssSourceMapDev || cssSourceMapProd;

module.exports = {
    entry:entries,
    output:{
        path:config.build.assetsRoot,
        publicPath:env === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath,
        filename:'[name].[hash].js'
    },
    resolve:{
        extensions:['','.js','.vue','.jsx'],
        fallback:[path.join(__dirname,'../node_modules')],
        alias:{
            'vue$': 'vue/dist/vue',
            'src': path.resolve(__dirname,'../src'),
            'lib': path.resolve(__dirname,'../lib'),
            'assets':path.resolve(__dirname,'../src/assets'),
            'components':path.resolve(__dirname,'../lib/components')
        }
    },
    resolveLoader:{
        fallback:[path.join(__dirname,'../node_modules')]
    },
    module:{
        loaders:[
            {
                test:/\.vue$/,
                loader:'vue'
            },
            {
                test:/\.js(x)*$/,
                loader:'babel',
                include:projectRoot,
                exclude:/node_modules/
            },
            {
                test:/\.json$/,
                loader:'json'
            },
            {
                test:/\.html$/,
                loader:'vue-html'
            },
            {
                test:/\.(png|jpe?g|gif)(\?.*)?$/,
                loader:'url',
                query:{
                    limit:1000,
                    name:path.join(config.build.assetsSubDirectory + '/assets','[name].[hash:7].[ext]')
                }
            },
            {
                test:/\.(svg|woff2?|eot|ttf|otf)(\?.*)?$/,
                loader:'url',
                query:{
                    limit:1000,
                    name:path.join(config.build.assetsSubDirectory + '/font','[name].[hash:7].[ext]')
                }
            }
        ]
    },
    vue:{
        loaders:utils.cssLoaders({sourceMap:useCssSourceMap})
    }
}