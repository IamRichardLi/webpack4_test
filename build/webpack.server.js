const webpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('../webpack.config_backup.js');
const options = {
    contentBase: './dist',
    hot: true,
    host: 'localhost'
};
webpackDevServer.addDevServerEntrypoints(config, options);
const compiler = webpack(config);
const server = new webpackDevServer(compiler, options);

server.listen(8087, 'localhost', () => {
    console.log('webpack4 dev server listening on port 8087');
});