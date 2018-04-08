const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: './src/index',

    output: {
        path: __dirname + '/dist',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                use:  [
                    {
                        loader: 'babel-loader'
                    },
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },
    plugins: [
       new HtmlWebpackPlugin({
            template: `./src/index.html`,
            inject: 'body',
            hash: true
        })
    ],
    devServer: {
        contentBase: './dist',
        port: 8080,
        host: 'localhost',
        disableHostCheck: true,
    }
};