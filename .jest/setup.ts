jest.mock("react-native", () => {
    // use original implementation, which comes with mocks out of the box
    const RN = jest.requireActual("react-native")
    // mock modules/components created by assigning to NativeModules
    // eslint-disable-next-line functional/immutable-data
    RN.NativeModules.TCPClientModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    // eslint-disable-next-line functional/immutable-data
    RN.NativeModules.TCPServerModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    // eslint-disable-next-line functional/immutable-data
    RN.NativeModules.UDPServerModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    // eslint-disable-next-line functional/immutable-data
    RN.NativeModules.ServiceBrowserModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    return RN
})
