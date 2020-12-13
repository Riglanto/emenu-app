const dotenv = require('dotenv')
const dotenvExpand = require('dotenv-expand')

const config = dotenv.config({path: './.env.local'})

module.exports = dotenvExpand(config)