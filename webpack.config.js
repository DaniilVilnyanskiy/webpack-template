const path = require('path')
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const SRC = path.resolve(__dirname, 'src');
console.log(SRC)
const PAGES_DIR = `${SRC}`;
const PAGES = fs.readdirSync(PAGES_DIR).filter((fileName) => fileName.endsWith('.pug') && !fileName.startsWith('_'));

let mode = 'development'
if (process.env.NODE_ENV === 'production') {
    mode = 'production'
}
console.log(mode)

module.exports = {
    mode: mode,
    output: {
        filename: "[name].[contenthash].js",
        assetModuleFilename: "assets/[hash][ext][query]",
        clean: true,
    },
    devtool: "source-map",
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css"
        }),
        ...PAGES.map((page) => new HtmlWebpackPlugin({
            template: `${PAGES_DIR}/${page}`,
            filename: `./${page.replace(/\.pug/, '.html')}`,
        }))
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: "html-loader",
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    (mode === 'development') ? "style-loader" : MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            // options
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.pug$/,
                loader: 'pug-loader',
                exclude: /(node_modules|bower_components)/,
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist')
        },
        watchFiles: {
            paths: ['./src/**/*.*', './assets/scss/**/*.*'],
            options: {
                usePolling: true
            }
        }
    },
    stats: 'errors-only'
}