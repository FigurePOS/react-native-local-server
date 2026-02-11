export enum StopReasonEnum {
    Manual = "manual",
    ClosedByPeer = "closed-by-peer",
    Invalidation = "invalidation",
}

export type StopReason = StopReasonEnum | string

export type Maybe<T> = T | null | undefined
