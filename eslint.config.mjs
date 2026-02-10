import figurePlugin from "@figuredev/eslint-plugin-react-native"

/** @type {import('eslint').Linter.Config[]} */
export default [
    // This wild card enables to pickup the config in nested directories it is perfect for this kind of repo,
    // but would be a huge bottleneck in performance for our repos containing apps,
    // where there is only one tsconfig.json, so please don't use it there.
    ...figurePlugin("**/tsconfig.json"),
    {
        files: ["apps/example-expo/**"],
        rules: {
            // we want to use console in the example app, to easily debug
            "no-console": "off",
        },
    },
    {
        rules: {
            // Temporary disable to make the review easier
            "@smarttools/rxjs/no-implicit-any-catch": "off",
            "@typescript-eslint/no-explicit-any": "off",
        },
    },
    {
        ignores: ["**/__tests__/**", "**/__mocks__/**", "**/__rsc_tests__/**"],
    },
]
