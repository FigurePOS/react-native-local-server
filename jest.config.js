module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["<rootDir>/jest_setup"],
    modulePathIgnorePatterns: ["<rootDir>/example/node_modules", "<rootDir>/lib/"],
    transformIgnorePatterns: ["node_modules/(?!(react-native|@react-native(-community)?)|uuid)"],
}
