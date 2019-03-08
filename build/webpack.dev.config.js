'use strict'
const merge = require('webpack-merge');
const webpack = require('webpack');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var config = require('./webpack.base.config');
module.exports = merge(config, {
    // devtool: 'eval',
    devtool: "source-map",
    devServer: {
        // 公共路径 打包后资源可以访问的路径  public:'/mypath/'  ==>  http://localhost:8080/mypath/index.bundle.js
        // 如果devServer.publicPath未设置，则默认会读取output.publicPath(默认为"/")
        // publicPath: '/dist/',
        // webpack-dev-server会使用当前的路径作为请求的资源路径，但是你可以通过指定content base来修改这个默认行为:
        // 本地服务器在哪个目录搭建页面，一般我们在当前目录即可.这里需要注意一点，contentBase的路径是相对与webpack.config.js文件所在的目录的
        // contentBase: './mypage/'   那么就会打开 localhost:port 的时候 默认打开的是  ./mypage/index.html
        // contentBase: './dist/',
        // 当我们搭建spa应用时非常有用，它使用的是HTML5 History Api，任意的跳转或404响应可以指向 index.html 页面；
        historyApiFallback: true,
        // hot参数控制更新是刷新整个页面还是局部刷新
        // Note that webpack.HotModuleReplacementPlugin is required to fully enable HMR. If webpack or webpack-dev-server are launched with the --hot option, this plugin will be added automatically, so you may not need to add this to your webpack.config.js. See the HMR concepts page for more information.
        // webpack官方文档说如果webpack-dev-server命令带了--hot选项，则webpack会自动加载HotModuleReplacementPlugin插件，所以这里我们无需额外配置hot
        // hot: true,
        // inline是热更新的一种模式，另一种是iframe
        inline: true,
        // http://localhost:{port}/webpack-dev-server访问服务器资源
        port: 8087,
        // 指定使用一个 host。默认是 localhost。如果你希望服务器外部可访问，指定如下：host: "0.0.0.0"
        host:'localhost',
        // 自动开启浏览器
        open: true,
        // 只有错误的信息才会打印出来
        /*stats: "errors-only",*/
        // This option allows you to whitelist services that are allowed to access the dev server.
        // Mimicking django's ALLOWED_HOSTS, a value beginning with . can be used as a subdomain wildcard. .host.com will match host.com, www.host.com, and any other subdomain of host.com.
        allowedHosts: [
            'test.webpack4.cn'
        ]
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new miniCssExtractPlugin({
            // 开发环境下的css不需要考虑缓存问题
            filename: 'bundle.css',
            chunkFilename: "[name].css"
        }),
        // bundle分析
        new BundleAnalyzerPlugin()
    ]
});