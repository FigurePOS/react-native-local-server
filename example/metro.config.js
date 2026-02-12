const path = require("path")

const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Add the parent directory to watch folders for local development
config.watchFolders = [path.resolve(__dirname, "../")]

module.exports = config
