const path = require('path');
const webpack = require('webpack');
const plugin = require('./plugin');

module.exports = {
    context: path.resolve(__dirname),
    entry: {
        app:['./index.js']
    },
    output: {
        filename: '[name].bundle.js',
        chunkFilename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, 'dist'),
        //publicPath: path.resolve(__dirname, 'dist'),
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader', 
                        query: {
                            babelrc: false,
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                ['@babel/plugin-transform-runtime',
                                {
                                    "corejs": false,
                                    "helpers": true,
                                    "regenerator": true,
                                    "useESModules": false
                                }],
                                //'@babel/plugin-proposal-optional-chaining',
                                plugin
                            ],
                            comments: false
                        },
                    }
                ]
            }
        ]
    },
    mode:"development"
};