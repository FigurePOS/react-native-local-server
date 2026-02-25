const path = require("path")

const { getDefaultConfig } = require("expo/metro-config")

const root = path.resolve(__dirname, "..")
const config = getDefaultConfig(__dirname)

config.watchFolders = [root]

// Disable the default walk-up-the-tree node_modules resolution so that
// dependencies required from library source files (root/src/**) don't
// accidentally resolve to root/node_modules/** instead of example/node_modules/**.
// All module resolution goes through nodeModulesPaths, which lists only the
// example's node_modules, giving the bundle a single copy of every package.
config.resolver.disableHierarchicalLookup = true
config.resolver.nodeModulesPaths = [path.resolve(__dirname, "node_modules")]

module.exports = config
