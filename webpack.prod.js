const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const PLAYALONG_URL = "https://www.playalong-project.com";
const BACKEND_API = `${PLAYALONG_URL}/api`;

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({
            "process.env.PLAYALONG_URL": JSON.stringify(PLAYALONG_URL),
            "process.env.BACKEND_API": JSON.stringify(BACKEND_API),
        })
    ]
});
