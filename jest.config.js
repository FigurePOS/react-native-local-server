module.exports = {
    preset: "react-native",
    setupFilesAfterEnv: ["<rootDir>/jest_setup"],
    modulePathIgnorePatterns: ["<rootDir>/example/node_modules", "<rootDir>/lib/"],
    moduleNameMapper: {
        uuid: require.resolve("uuid"),
    },
}
