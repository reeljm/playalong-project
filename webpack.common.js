const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [
              { from: 'src/index.html' },
              { from: 'src/style.css' },
              { from: 'src/favicon.ico' },
            ],
        }),
        new webpack.DefinePlugin({
            "process.env.HOW_TO_VIDEO_URL": JSON.stringify("https://www.youtube.com/embed/NDnc1qKgGvo"),
        })
    ],
    entry: './src/main.ts',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.(svg|mp3)$/,
            loader: 'file-loader',
            options: {
                name: 'assets/[folder]/[name].[ext]',
            },
        }
        ],
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};