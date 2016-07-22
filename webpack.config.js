var webpack = require('webpack');

module.exports = {
    entry: ['whatwg-fetch', 'web/browser.js'],
    resolve: {
        modulesDirectories: ['node_modules', 'src'],
        extension: ['', '.js', '.jsx', '.json', '.scss']
    },
    output: {
        path: 'dist/web/resources',
        filename: 'render.js'
    },
    plugins: [
        new webpack.EnvironmentPlugin(['NODE_ENV']),
    ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // query: {
                //     presets: ['es2015', 'react']
                // }
            },
            {
                test: /.json$/,
                loader: 'json-loader',
                exclude: /node_modules/
            }
        ]
    }
};
