'use strict'
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
const merge = require('webpack-merge');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const ManifestPlugin = require('webpack-manifest-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var config = require('./webpack.base.config');
module.exports = merge(config, {
    output: {
        // hash与chunkhash的区别
        // hash: 工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
        // chunkhash: 只有被修改了的文件的文件名，hash值修改
        // chunkhash只能在生产环境中使用,热更新(HMR)不能和[chunkhash]同时使用
        filename: '[name].[chunkhash:5].js',
        chunkFilename: '[name].[chunkhash:8].js'
    },
    optimization: {
        minimizer: [
            // 自定义js优化配置，将会覆盖默认配置
            new UglifyJsPlugin({
                // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
                exclude: /\.min\.js$/,
                cache: true,
                parallel: true, // 开启并行压缩，充分利用cpu
                sourceMap: false,
                extractComments: true, // 移除注释
                uglifyOptions: {
                    compress: {
                        unused: true,
                        warnings: false,
                        drop_debugger: true
                    },
                    output: {
                        comments: false
                    }
                }
            }),
            // 用于优化css文件
            new OptimizeCssAssetsPlugin({
                assetNameRegExp: /\.css$/g,
                cssProcessorOptions: {
                    safe: true,
                    // 禁用掉cssnano对于浏览器前缀的处理
                    autoprefixer: { disable: true },
                    mergeLonghand: false,
                    discardComments: {
                        // 移除注释
                        removeAll: true
                    }
                },
                canPrint: true
            })
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: resolve(''),
            dry: false // 启用删除文件
        }),
        new miniCssExtractPlugin({
            // 生产环境下的css文件名加入内容散列，保证内容更新后文件不会被缓存
            filename: '[name].[contenthash:8].css',
            chunkFilename: "[name].[contenthash:8].css"
        })
    ]
});