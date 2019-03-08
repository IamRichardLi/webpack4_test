'use strict'
const path = require('path');
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
const HtmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
module.exports = {
    entry: {
        index: resolve('src/index.js'),
        index2: resolve('src/index2.js')
    },
    output: {
        // 对构建出的资源进行异步加载（图片，文件），该选项的值是以 runtime(运行时) 或 loader(载入时) 所创建的每个 URL 为前缀。因此，在多数情况下，此选项的值都会以/结束。
        // 主要场景是用于静态资源的cdn托管
        // publicPath: '/',
        // hash与chunkhash的区别
        // hash: 工程级别的，即每次修改任何一个文件，所有文件名的hash至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。
        // chunkhash: 只有被修改了的文件的文件名，hash值修改
        filename: '[name].js',
        // chunkFilename: 按需加载（异步）的文件的名称
        chunkFilename: "[name].js",
        // path是配置输出文件存放在本地的目录，字符串类型，是绝对路径
        path: resolve('dist')
    },
    module: {
        rules: [
            {
                // 使用 babel 编译 ES6 / ES7 / ES8 为 ES5 代码
                // 使用正则表达式匹配后缀名为 .js 的文件
                test: /\.js$/,
                include: [resolve('src'), resolve('resources/js')],
                // 排除 node_modules 目录下的文件，npm 安装的包不需要编译
                exclude: /node_modules/,

                // use 指定该文件的 loader, 值可以是字符串或者数组。
                // 这里先使用 eslint-loader 处理，返回的结果交给 babel-loader 处理。loader 的处理顺序是从最后一个到第一个。
                // use: ['babel-loader', 'eslint-loader']
                use: {
                    loader: 'babel-loader'
                }
            },

            {
                // 匹配 html 文件
                test: /\.html$/,
                exclude: /node_modules/,
                // 使用 html-loader, 将 html 内容存为 js 字符串，比如当遇到
                // import htmlString from './template.html';
                // template.html 的文件内容会被转成一个 js 字符串，合并到 js 文件里。
                use: 'html-loader'
            },
            {
                // 先使用 css-loader 处理，返回的结果交给 style-loader 处理。
                // css-loader 将 css 内容存为 js 字符串，并且会把 background, @font-face 等引用的图片，
                // 字体文件交给指定的 loader 打包，类似上面的 html-loader, 用什么 loader 同样在 loaders 对象中定义，等会下面就会看到。
                test: /\.css$/,
                include: resolve('resources/css'),
                exclude: /node_modules/,
                use: [
                    miniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                // 匹配各种格式的图片和字体文件
                // 上面 html-loader 会把 html 中 <img> 标签的图片解析出来，文件名匹配到这里的 test 的正则表达式，
                // css-loader 引用的图片和字体同样会匹配到这里的 test 条件
                test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,

                // 使用 url-loader, 它接受一个 limit 参数，单位为字节(byte)
                // 当文件体积小于 limit 时，url-loader 把文件转为 Data URI 的格式内联到引用的地方
                // 当文件大于 limit 时，url-loader 会调用 file-loader, 把文件储存到输出目录，并把引用的文件路径改写成输出后的路径
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: '[name].[hash:8].[ext]',
                            // 表示打包文件中引用文件的路径前缀，如果你的图片存放在CDN上，那么你上线时可以加上这个参数，值为CDN地址，这样就可以让项目上线后的资源引用路径指向CDN了
                            // publicPath: "./resources/images/",
                            // 表示输出文件路径前缀。图片经过url-loader打包都会打包到指定的输出文件夹下。但是我们可以指定图片在输出文件夹下的路径。
                            // 比如outputPath=img/，图片被打包时，就会在输出文件夹下新建（如果没有）一个名为img的文件夹，把图片放到里面。
                            // 图片打包后输出的路径其实是output.path加上这里loader的outputPath
                            outputPath: "./resources/images/"
                        }
                    }
                ]
            }
        ]
    },
    performance: {
        // 告诉 webpack 抛出一个错误或警告。此属性默认设置为 "warning".判断文件是否超出maxAssetSize设置的大小
        hints: "warning",
        // 资源(asset)是从 webpack 生成的任何文件。此选项根据单个资源体积，控制 webpack 何时生成性能提示。默认值是：250000 (bytes)。
        // maxAssetSize: 250000
        // 控制用于计算性能提示的文件
        assetFilter: function(assetFilename) {
            return assetFilename.endsWith('.js');
        }
    },
    optimization: {
        splitChunks: {
            //     chunks: "async", // 三选一，"initial"(静态加载的文件) | "all"(所有加载的文件) | "async" (异步加载的文件)，默认是async
            //     minSize: 30000, // 最小尺寸，30000(30kb)
            //     minChunks: 1, // 最小 chunk ，默认1
            //     maxAsyncRequests: 5, // 最大异步请求数， 默认5
            //     maxInitialRequests : 3, // 最大初始化请求书，默认3
            //     automaticNameDelimiter: '~',// 打包分隔符
            //     name: function(){}, // 打包后的名称，此选项可接收 function
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    minSize: 30000,
                    minChunks: 1,
                    chunks: 'initial',
                    // 缓存组优先级, 数值越大越优先处理
                    priority: 1
                },
                libs: {
                    test: /[\\/]resources[\\/]js[\\/]/,
                    name: 'libs',
                    minSize: 30000,
                    minChunks: 2,
                    chunks: 'initial',
                    priority: 0,
                    reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                },
                commons: {
                    test: /[\\/]src[\\/]controls[\\/]/,
                    minSize: 30000,
                    minChunks: 3,
                    chunks: 'all',
                    priority: -1,
                    reuseExistingChunk: true // 这个配置允许我们使用已经存在的代码块
                }
            }
        },
        runtimeChunk: 'single'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
            // 是否注入
            inject: true,
            // 将runtimeChunk插入html中
            chunks: ['runtime', 'index', 'index2'],
            chunksSortMode: 'none' //如果使用webpack4将该配置项设置为'none'
        }),
        // 这里有一个点要注意，InlineManifestWebpackPlugin插件的顺序一定要在HtmlWebpackPlugin之后，否则会导致编译失败。
        // This plugin need to work with webpack v4 (for webpack v3 and below, pls use version 3) and HtmlWebpackPlugin v3
        // 暂时不兼容最新的HtmlWebpackPlugin V4，所以我们还是用注入script的方式引入runtime.js
        /*new InlineManifestWebpackPlugin('manifest'),*/
        new ManifestPlugin({
            fileName: 'manifest.json'
        })
    ]
};