const path = require('path');
var webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: {
        'app01': './src/01_ObserverFromSequenceOfNumbers',
        'app02': './src/02_ObserverFromEvent_MouseMove',
        'app03': './src/03_ObserverFromXHR',
        'app04': './src/04_ObservableFromFetch',
        'vendor': './vendor'
    },
    devServer: {
        contentBase: './'
    },
    output: {
        path: path.resolve(__dirname, 'js'),
        publicPath: 'http://localhost:8080/js/',
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                loader: "ts-loader"
            },
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                },
                {
                    loader: 'expose-loader',
                    options: 'jQuery'
                }]
            },
            {
                test: /\.less$/,
                use: [{
                    loader: "style-loader" // creates style nodes from JS strings
                }, {
                    loader: "css-loader" // translates CSS into CommonJS
                }, {
                    loader: "less-loader" // compiles Less to CSS
                }]
            },
            {
                test: /\.(ttf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash].[ext]',
                    publicPath: '/js/'
                }
            },
            {
                test: /\.(png|svg|jpe?g|gif|ico)$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[hash].[ext]',
                    publicPath: '/js/'
                }
            }
        ]
    },
    resolve: {
        extensions: ['*', '.ts', '.js'],
        // alias: {
        //     jquery: path.resolve(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.min.js')
        // }
    },
    plugins: [
        new webpack.ProvidePlugin({
            'window.jQuery': 'jquery',
            jQuery: 'jquery',
            $: 'jquery'            
        }),
        new CopyWebpackPlugin([
            // Copy directory contents to {output}/to/directory/
            { from: 'data', to: 'js' }
        ]),
    ]
}