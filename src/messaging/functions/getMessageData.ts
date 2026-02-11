export const getMessageData =
    <T, M>(extractor: (message: M) => T) =>
    ([message, _]: [M, unknown]): T =>
        extractor(message)
