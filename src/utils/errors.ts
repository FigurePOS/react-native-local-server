import { Maybe } from "../../example/src/types"

export class ErrorWithMetadata extends Error {
    metadata: Maybe<Record<string, unknown>> = null

    constructor(message: string, metadata?: Maybe<Record<string, unknown>>) {
        super(message)
        this.metadata = metadata
    }

    hasMetadata = (): boolean => {
        return this.metadata != null
    }

    getMetadata = (): Maybe<Record<string, unknown>> => {
        return this.metadata
    }
}
