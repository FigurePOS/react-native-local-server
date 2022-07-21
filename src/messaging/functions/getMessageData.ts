export const getMessageData =
    <T, M>(extractor: (message: M) => T) =>
    ([message, _]: [M, any]): T =>
        extractor(message)
