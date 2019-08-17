const portfinder = require('portfinder')
const utils = require('./utils')
const config = require('../config')

utils.initNodeEnv()

const multipleCompilerConfig = utils.genWebpackConfig('dev')

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port
            // add port to devServer config
            multipleCompilerConfig.forEach(webpackDevConfig => {
                webpackDevConfig.devServer.port = port
            })

            console.log(`Website is running at: http://${config.dev.host}:${port}`)

            resolve(multipleCompilerConfig)
        }
    })
})
