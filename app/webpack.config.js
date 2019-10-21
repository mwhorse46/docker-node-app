/*
    Webpack Config

    This file tells webpack how to bundle our assets
*/
const path = require('path');
// const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*
    NOTE: we may want to include a plugin to make the css build to a file separate from the JS
*/

module.exports = env => { const DEV = env == 'dev'; return {
    
    plugins: [
        // to reduce JS size, leave out moment locales...we're not international...yet
        // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

        // generate a report of the size of JS modules
        new BundleAnalyzerPlugin({
            analyzerMode: DEV ? 'static' : 'disabled',
            reportFilename: 'bundle-report.html'
        })
    ],
    
    // not sure if this matters yet, but webpack requires mode to be set
    mode: env=='prod' ? 'production' : 'development',

    // rebuild the files when they change
    watch: DEV,

    // create a source map on build
    devtool: 'source-map',

    // two entry points will be built, one for the main app and one for login
    entry: {
        index: './client/js/index.js',
        login: './client/js/login.js',
    },
    
    // put the built files in /dist
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    
    // adjust how imports are resolved
    resolve: {
        
        // limit where modules should be loaded from
        modules: [
            // prefer our node modules (and not nested node modules in /catalog)
            // needed to keep from duplicate lit-elements imported
            path.resolve(__dirname, 'node_modules'),
            "node_modules",
        ],
        
        // make aliases for modules so we can type less
        alias: {
            'bui': 'blackstone-ui',
            'form': 'bui/presenters/form-control',
            'panel': 'bui/presenters/panel',
            'tabs': 'bui/presenters/tabs',
            'popover': 'bui/presenters/popover',
            'dialog': 'bui/presenters/dialog',
            'menu': 'bui/presenters/menu',

            // backbone requires jquery...use our own version
            'jquery': path.resolve(__dirname, 'client/js/lib/jquery')
        }
    },
    
    // inform webpack how to handle certain types of modules
    module: {
        
        rules: [
        // load HTML/txt/svgs modules as raw text    
        {
            test: /\.html$|\.txt$|\.svg$|\.md$|\.css$/,
            use: 'raw-loader'
        },

        // load less files, compile to css, and append to DOM
        {
            test: /\.(less)$/,
            use: [
                {
                    loader: 'style-loader', // creates style nodes from JS strings
                },
                {
                    loader: 'css-loader', // translates CSS into CommonJS
                    options: {
                        sourceMap: true,
                    },
                },
                {
                    loader: 'less-loader', // compiles Less to CSS
                    options: {
                        sourceMap: true,
                    },
                },
            ]
        }]	
    }

}}