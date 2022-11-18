import { getShortServiceId } from "../composeDataServiceInfoObject"

describe("getShortServiceId", () => {
    it("should return first 6 characters of uuid", () => {
        return expect(getShortServiceId("7d4f61ab-5053-4ca2-9a58-1f36641a04af")).toEqual("7d4f61")
    })
    it("should not crash on empty string", () => {
        return expect(getShortServiceId("")).toEqual("")
    })
})
