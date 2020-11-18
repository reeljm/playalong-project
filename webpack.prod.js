const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PLAYALONG_URL": JSON.stringify("34.72.104.7")
        })
    ]
});
