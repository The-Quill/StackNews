var path = require("path");
var webpack = require('webpack');
var nodeExternals = require('webpack-node-externals');

var commonLoaders = [
    { test: /\.js$/, loader: "jsx-loader" },
    { test: /\.png$/, loader: "url-loader" },
    { test: /\.jpg$/, loader: "file-loader" },
    { test: /\.json$/, loader: "json-loader" },
];
var assetsPath = path.join(__dirname, "public", "assets");
var publicPath = "assets/";

module.exports = {
    entry: [
        './src/web_server/render.es6' // Your appʼs entry point
    ],
    output: {
        path: __dirname,
        filename: "dist/bundle.js"
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [
            ...commonLoaders,
            {
                test: /\.jsx?$/,
                loaders: [
                    'react-hot',
                    'jsx?harmony',
                    'babel-loader',
                    'jsx-loader'
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.es6?$/,
                loaders: [
                    'react-hot',
                    'jsx?harmony',
                    'babel-loader'
                ],
                include: path.join(__dirname, 'src')
            },
            {
                test: /\.scss$/,
                loaders: [
                    'isomorphic-style-loader',
                    'css-loader?modules&localIdentName=[name]_[local]_[hash:base64:3]',
                    'postcss-loader'
                ],
                include: path.join(__dirname, 'src/css_modules')
            },
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
