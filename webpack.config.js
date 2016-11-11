/**
 * Created by houdong on 16/8/25.
 */

var webpack = require('webpack');
var Path = require("path");
var CommonsPlugin = webpack.optimize.CommonsChunkPlugin;//提取公共js
var ExtractTextPlugin = require('extract-text-webpack-plugin');//自动化css独立加载插件


/******************************************************************************
 * Const
 ******************************************************************************/


/******************************************************************************
 * functions
 ******************************************************************************/

//构建css路径
function build_css_path(path) {
    return './css/' + path
}

/******************************************************************************
 * config webpack
 ******************************************************************************/

var entry = {
    index: __dirname + '/public/index.js'
};
var output = {
    path: __dirname + '/public/build/',
    filename: 'js/[name].js',
    chunkFilename: 'js/[name].chunk.js'
};


var plugins = [

    new CommonsPlugin({ //提取公用js插件
        name: 'common',
        fileName: 'common.js'
    }),

    // 将构建完成的css文件导出到指定文件夹.
    // 为什么这么写? 参考:https://github.com/webpack/webpack/issues/1022
    new ExtractTextPlugin(build_css_path("[name].css"))//会打包成index.css放入build/css/
];

var config = {
    entry: entry,
    output: output,
    plugins: plugins,
    resolve: {
        root: Path.resolve(__dirname) + '/public/',//resolve.root 表示添加默认搜索路径
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],//用于配置程序可以自行补全哪些后缀
        alias: {
            InitialProps: 'configs/InitialProps',//初始化参数
            Actions: 'actions/Common',//公用Action
            UserRoute: 'configs/Route',//user路由配置
            CommonFun: 'configs/CommonFun',//公用方法
            Api: 'configs/Api',//请求方法
            HeaderLayout: 'layouts/HeaderLayout',//Header布局
            SidebarLayout: 'layouts/SidebarLayout'//Sidebar布局
        }
    },
    module: {
        loaders: [
            {
                test: /\.js?$/,
                include: /(public)/,
                loaders: ['react-hot', 'babel-loader']//loaders代表用多个加载器,从右往左依次处理,数组形式
            },
            {
                test: /\.js$/,
                include: /(public)/,//public文件都先经过babel转换,转换规则定义在package.json的babel
                loader: 'babel-loader'//loader表示只用一个加载器,字符串形式
            },
            /**
             *  组件中需要使用css文件时(非内嵌), 需要使用该plugin加载
             */
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")}
        ]
    }
};

module.exports = config;