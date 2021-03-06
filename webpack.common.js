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
        })
    ],
    entry: './src/components/main/main.tsx',
    module: {
        rules: [
        {
            test: /\.ts(x?)$/,
            use: 'babel-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.ts(x?)$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.(mp3)$/,
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