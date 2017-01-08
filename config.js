var path = require('path');

module.exports = {
    build:{
        env:{
          NODE_ENV:JSON.stringify('production')
        },
        assetsRoot:path.resolve(__dirname,'dist'),
        assetsSubDirectory:'static',
        assetsPublicPath:'/',
        productionSourceMap:true,
        productionGzip:false,
        productionGzipExtensions:['js','css']
    },
    dev:{
        env:{
            NODE_ENV:'development'
        },
        port:2888,
        assetsSubDirectory:'static',
        assetsPublicPath:'/',
        proxyTable:{
            '/Brush':{
                target:'http://116.62.30.219/Brush',
                changeOrigin:true,
                pathRewrite:function (path,req) {
                    return path.replace('/Brush', '');
                }
            }
        },
        cssSourceMap:false
    }
}