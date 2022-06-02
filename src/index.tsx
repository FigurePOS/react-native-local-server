import { NativeModules, Platform } from "react-native"

const LINKING_ERROR =
    "The package 'react-native-local-server' doesn't seem to be linked. Make sure: \n\n" +
    Platform.select({ ios: "- You have run 'pod install'\n", default: "" }) +
    "- You rebuilt the app after installing the package\n" +
    "- You are not using Expo managed workflow\n"

const LocalServer = NativeModules.LocalServer
    ? NativeModules.LocalServer
    : new Proxy(
          {},
          {
              get: function () {
                  throw new Error(LINKING_ERROR)
              },
          }
      )

export function multiply(a: number, b: number): Promise<number> {
    return LocalServer.multiply(a, b)
}

export const startServer = (): Promise<void> => {
    return LocalServer.startServer()
}
