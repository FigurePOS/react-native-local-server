import { Maybe } from "../../example/src/types"

export class ErrorWithMetadata extends Error {
    metadata: Maybe<Record<string, any>> = null

    constructor(message: string, metadata?: Maybe<Record<string, any>>) {
        super(message)
        this.metadata = metadata
    }

    hasMetadata = (): boolean => {
        return this.metadata != null
    }

    getMetadata = (): Maybe<Record<string, any>> => {
        return this.metadata
    }
}
