export type Maybe<T> = T | null | undefined

export type StateAction = {
    type: Maybe<string>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload?: any
}
