var path = require("path");
var webpack = require('webpack');

var commonLoaders = [
    { test: /\.js$/, loader: "jsx-loader" },
    { test: /\.png$/, loader: "url-loader" },
    { test: /\.jpg$/, loader: "file-loader" },
];
var assetsPath = path.join(__dirname, "public", "assets");
var publicPath = "assets/";

module.exports = [
    entry: [
        'webpack-dev-server/client?http://0.0.0.0:3000', // WebpackDevServer host and port
        'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
        './scripts/index' // Your appʼs entry point
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: [
                    'react-hot',
                    'jsx?harmony',
                    'babel-loader',
                    'jsx-loader'
                ],
                include: path.join(__dirname, 'src/components')
            },
            {
                test: /\.es6?$/,
                loaders: [
                    'react-hot',
                    'jsx?harmony',
                    'babel-loader'
                ],
                include: path.join(__dirname, 'src')
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
];
