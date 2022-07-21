import { DataObject } from "../types"

export const serializeDataObject = (data: DataObject): string => JSON.stringify(data)
