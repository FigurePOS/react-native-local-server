jest.mock("react-native", () => {
    // use original implementation, which comes with mocks out of the box
    const RN = jest.requireActual("react-native")
    // mock modules/components created by assigning to NativeModules
    RN.NativeModules.TCPClientModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    RN.NativeModules.TCPServerModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    RN.NativeModules.UDPServerModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    RN.NativeModules.ServiceBrowserModule = {
        addListener: () => {},
        removeListeners: () => {},
    }
    return RN
})
