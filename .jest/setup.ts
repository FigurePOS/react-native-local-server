jest.mock("react-native", () => {
    const EventEmitter = jest.fn().mockImplementation(() => ({
        addListener: jest.fn(),
        removeListener: jest.fn(),
        removeAllListeners: jest.fn(),
        emit: jest.fn(),
    }))

    return {
        // Only export what the tests need
        NativeEventEmitter: EventEmitter,
        NativeModules: {},
        Platform: { OS: "ios", select: jest.fn() },
    }
})
