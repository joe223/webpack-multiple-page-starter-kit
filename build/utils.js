'use strict';
const path = require('path')
const dotenv = require('dotenv')
const rimraf = require('rimraf')
const webpack = require('webpack')
const merge = require('webpack-merge')
const dotenvExpand = require('dotenv-expand')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const config = require('../config')
const modules = require('../config/modules')
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
    const assetsSubDirectory = process.env.NODE_ENV === 'production'
        ? config.build.assetsSubDirectory
        : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        return [
            options.extract
                ? MiniCssExtractPlugin.loader
                : 'vue-style-loader',
        ].concat(loaders)
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass'),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}

exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!')
            .pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || ''
        })
    }
}

exports.genWebpackConfig = (buildType = 'dev') => {
    const buildConfig = require(`./webpack.${buildType}.conf.js`)

    return Object.keys(modules).map(moduleName => {
        const conf = {
            entry: {},
            plugins: []
        }

        if (typeof modules[moduleName].entry !== 'string'
            && modules[moduleName].entries === void (0)) {
            throw new Error(`modules ${moduleName} entry is invalid!`)
        }

        // Single entry file
        if (modules[moduleName].entry) {
            const defaultEntryName = 'index'

            conf.entry[defaultEntryName] = resolvePath(modules[moduleName].entry)
            conf.plugins.push(genHtmlWebpackPluginConfig(
                buildType,
                modules[moduleName],
                defaultEntryName,
                'index.html'))
        // Multiple entry file
        } else {
            Object.keys(modules[moduleName].entries).forEach(entryName => {
                const entry = modules[moduleName].entries[entryName]

                conf.entry[entryName] = resolvePath(entry.entry)
                conf.plugins.push(genHtmlWebpackPluginConfig(
                    buildType,
                    entry,
                    entryName,
                    entry.output || `${entryName}/index.html`))
            })
        }

        if (buildType === 'prod') {
            conf.plugins.push(new BundleAnalyzerPlugin({
                openAnalyzer: false,
                analyzerMode: 'static',
                reportFilename: path.join(__dirname, `../bundle_analyze/${moduleName}/index.html`)
            }))
        }

        // Set public static assets
        // copy custom static assets
        if (modules[moduleName].static) {
            conf.plugins.push(new CopyWebpackPlugin([
                {
                    from: resolvePath(modules[moduleName].static),
                    to: config.dev.assetsSubDirectory,
                    ignore: ['.*']
                }
            ]))
        }

        const webpackConfig = merge(buildConfig, {
            output: {
                path: path.join(config.build.assetsRoot, modules[moduleName].output),
                filename: '[name].[hash].js',
                publicPath: path.join('/', modules[moduleName].output, '/')
            }
        }, conf)

        // resolve client env
        const clientEnv = resolveClientEnv(webpackConfig)

        webpackConfig.plugins.unshift(new webpack.EnvironmentPlugin(clientEnv))
        return webpackConfig
    })
}

/**
 * Factory function for generating HTMLWebpackPlugin instance
 * @param {string} buildType 'dev' | 'prod'
 * @param {{
 *  title: string,
 *  entry: string,
 *  output: string,
 *  template?: string,
 *  templateParameters?: object}} entry
 * @param entryName
 * @param {string} htmlFilename
 * @returns {HtmlWebpackPlugin}
 */
function genHtmlWebpackPluginConfig (buildType, entry, entryName, filename = 'index.html') {
    const template = entry.template
        ? resolvePath(entry.template)
        : path.join(__dirname, '../template/index.pug')

    // console.log('filename:', filename, 'template:', template)
    if (buildType === 'dev') {
        return new HtmlWebpackPlugin({
            filename,
            template,
            inject: true,
            chunks: ['vendors', entryName],
            title: entry.title || entry.templateParameters.title,
            templateParameters: {
                title: entry.title || entry.templateParameters.title
            }
        })
    } else {
        return new HtmlWebpackPlugin({
            filename,
            template,
            inject: true,
            chunks: ['vendors', entryName],
            title: entry.title || entry.templateParameters.title,
            templateParameters: {
                title: entry.title || entry.templateParameters.title
            },
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        })
    }
}

exports.initNodeEnv = () => {
    const NODE_ENV = dotenv.config({
        debug: process.env.DEBUG,
        path: path.join(__dirname, `../env/.env.${process.env.MODE}`)
    })
    dotenvExpand(NODE_ENV)
}

exports.cleanWorkspace = () => {
    try {
        rimraf.sync(path.join(__dirname, '../dist'))
        console.log('Clean dist directory')
    } catch (e) {
        console.error(e)
    }
    try {
        rimraf.sync(path.join(__dirname, '../bundle_analyze'))
        console.log('Clean bundle_analyze directory')
    } catch (e) {
        console.error(e)
    }
}

const prefixRE = /^WEB_APP_/

function resolveClientEnv(webpackConfig) {
    const env = {}
    Object.keys(process.env).forEach(key => {
        if (prefixRE.test(key)
            || key === 'NODE_ENV'
            || key === 'MODE'
        ) {
            env[key] = process.env[key]
        }
    })

    return env
}

function resolvePath (filePath) {
    return path.isAbsolute(filePath)
        ? filePath
        : path.join(__dirname, '../modules', filePath)
}
