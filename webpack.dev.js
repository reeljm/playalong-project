const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PLAYALONG_URL": JSON.stringify("http://localhost:3000"),
            "process.env.BACKEND_API": JSON.stringify("http://localhost:3000"),
        })
    ]
});
