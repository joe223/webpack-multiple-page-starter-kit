const utils = require('./utils')

utils.initNodeEnv()

const config = utils.genWebpackConfig('prod')

utils.cleanWorkspace()

module.exports = config
