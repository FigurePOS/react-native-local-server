module.exports = {
    cacheDirectory: ".jest/cache",
    setupFilesAfterEnv: ["<rootDir>/.jest/setup.ts"],
    modulePathIgnorePatterns: ["<rootDir>/example/node_modules", "<rootDir>/lib/"],
    transformIgnorePatterns: ["node_modules/(?!(react-native|@react-native(-community)?)|uuid)"],
}
