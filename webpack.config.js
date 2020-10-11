const path = require('path');

module.exports = {
    mode: "none",
    watch: true,
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
        {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },
        {
            test: /\.(png|svg|jpg|gif|mp3)$/,
            use: [
            'file-loader',
            ],
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