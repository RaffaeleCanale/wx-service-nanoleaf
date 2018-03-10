const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const IS_DEV = (process.env.NODE_ENV === 'dev');

const modulesDir = 'node_modules';
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

function onlyIf(cond, value) {
    return cond ? [value] : [];
}

module.exports = {
    target: 'node',
    entry: path.join(srcDir, 'index.js'),
    output: {
        path: distDir,
        filename: IS_DEV ? 'bundle.dev.js' : 'bundle.js',
        // library: 'rightPad',
        // libraryTarget: 'umd',
    },
    resolve: {
        modules: [
            modulesDir,
            srcDir,
        ],
    },
    plugins: [
        new webpack.DefinePlugin({ IS_DEV }),
        new webpack.ProvidePlugin({ _: 'lodash' }),
        ...onlyIf(!IS_DEV, new UglifyJsPlugin()),
    ],
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /(node_modules)/,
            options: {
                compact: true,
            },
        }],
    },
    devtool: IS_DEV ? 'eval-source-map' : undefined,
};
