export default () => {
    return {
        expo: {
            name: "Local Server Example",
            slug: "local-server-example",
            version: "1.0.0",
            icon: "./assets/icon.png",
            scheme: "dev.figure.local-server-example",
            orientation: "landscape",
            userInterfaceStyle: "light",
            newArchEnabled: false,
            splash: {
                image: "./assets/icon.png",
                resizeMode: "contain",
                backgroundColor: "#ffffff",
            },
            assetBundlePatterns: ["**/*"],
            ios: {
                supportsTablet: true,
                bundleIdentifier: "dev.figure.example-expo",
                entitlements: {
                    "com.apple.external-accessory.wireless-configuration": true,
                },
                infoPlist: {
                    NSLocalNetworkUsageDescription:
                        "Use Local Network for communication with the printer or discovery the printers.",
                },
            },
            android: {
                adaptiveIcon: {
                    foregroundImage: "./assets/icon.png",
                    backgroundColor: "#ffffff",
                },
                package: "dev.figure.local_server_example",
                edgeToEdgeEnabled: true,
                predictiveBackGestureEnabled: false,
            },
            platforms: ["ios", "android"],
        },
    }
}
