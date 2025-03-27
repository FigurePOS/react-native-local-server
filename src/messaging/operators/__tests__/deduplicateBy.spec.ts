import { marbles } from "rxjs-marbles"
import { deduplicateBy } from "../deduplicateBy"

describe("deduplicateBy", () => {
    it(
        "should do nothing on empty observable",
        marbles((m) => {
            const __in = m.hot("--|", {})
            const _out = m.hot("--|", {})
            m.expect(__in.pipe(deduplicateBy(() => null))).toBeObservable(_out)
        }),
    )
    it(
        "should deduplicate objects with the same key",
        marbles((m) => {
            const __in = m.hot("-a-b-c-de-", {
                a: {
                    key: "key-1",
                    value: 1,
                },
                b: {
                    key: "key-2",
                    value: 1,
                },
                c: {
                    key: "key-1",
                    value: 2,
                },
                d: {
                    key: null,
                    value: 4,
                },
                e: {
                    key: null,
                    value: 5,
                },
            })
            const _out = m.hot("-a-b---cd-", {
                a: {
                    key: "key-1",
                    value: 1,
                },
                b: {
                    key: "key-2",
                    value: 1,
                },
                c: {
                    key: null,
                    value: 4,
                },
                d: {
                    key: null,
                    value: 5,
                },
            })
            m.expect(__in.pipe(deduplicateBy((t) => t.key))).toBeObservable(_out)
        }),
    )
    it(
        "should deduplicate objects with the same key and reset after duration",
        marbles((m) => {
            const __in = m.hot("-a-b-c---d-e---f-gh", {
                a: {
                    key: "key-1",
                    value: 1,
                },
                b: {
                    key: "key-1",
                    value: 2,
                },
                c: {
                    key: "key-1",
                    value: 3,
                },
                d: {
                    key: "key-1",
                    value: 4,
                },
                e: {
                    key: "key-1",
                    value: 5,
                },
                f: {
                    key: "key-1",
                    value: 6,
                },
                g: {
                    key: null,
                    value: 4,
                },
                h: {
                    key: null,
                    value: 5,
                },
            })
            const _out = m.hot("-a---b---c-----d-ef", {
                a: {
                    key: "key-1",
                    value: 1,
                },
                b: {
                    key: "key-1",
                    value: 3,
                },
                c: {
                    key: "key-1",
                    value: 4,
                },
                d: {
                    key: "key-1",
                    value: 6,
                },
                e: {
                    key: null,
                    value: 4,
                },
                f: {
                    key: null,
                    value: 5,
                },
            })
            m.expect(__in.pipe(deduplicateBy((t) => t.key, m.time("--|")))).toBeObservable(_out)
        }),
    )
})
