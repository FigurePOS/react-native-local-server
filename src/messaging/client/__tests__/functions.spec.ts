import {
    MessagingClientServiceSearchEvent,
    MessagingClientServiceSearchEventUpdate,
    MessagingClientServiceSearchUpdate,
    ServiceBrowserEventName,
    ServiceBrowserNativeEvent,
} from "../../../"
import {
    mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate,
    parseMessagingServiceInformation,
    reduceMessagingClientServiceSearchEventUpdate,
} from "../functions"

describe("mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate", () => {
    it("should return reset on search started", () => {
        const event: ServiceBrowserNativeEvent = {
            type: ServiceBrowserEventName.Started,
            browserId: "browserId",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.Reset,
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
    it("should return reset on search stopped", () => {
        const event: ServiceBrowserNativeEvent = {
            type: ServiceBrowserEventName.Stopped,
            browserId: "browserId",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.Reset,
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
    it("should return unknown on unknown event", () => {
        const event: ServiceBrowserNativeEvent = {
            type: "UNKNOWN" as ServiceBrowserEventName.Stopped,
            browserId: "browserId",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.Unknown,
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
    it("should return service found", () => {
        const event: ServiceBrowserNativeEvent = {
            type: ServiceBrowserEventName.ServiceFound,
            browserId: "browserId",
            name: "Service Name",
            group: "_messaging._tcp",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceFound,
            service: {
                name: "Service Name",
                shortId: "",
            },
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
    it("should return service lost", () => {
        const event: ServiceBrowserNativeEvent = {
            type: ServiceBrowserEventName.ServiceLost,
            browserId: "browserId",
            name: "Service Name",
            group: "_messaging._tcp",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceLost,
            service: {
                name: "Service Name",
                shortId: "",
            },
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
    it("should parse short id from name", () => {
        const event: ServiceBrowserNativeEvent = {
            type: ServiceBrowserEventName.ServiceLost,
            browserId: "browserId",
            name: "Service Name (ab34da24)",
            group: "_messaging._tcp",
        }
        const expected: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceLost,
            service: {
                name: "Service Name",
                shortId: "ab34da24",
            },
        }
        expect(mapServiceBrowserEventToMessagingClientServiceSearchEventUpdate(event)).toEqual(expected)
    })
})

describe("mapServiceBrowserEventToMessagingService", () => {
    it("should parse shortId from brackets", () => {
        expect(parseMessagingServiceInformation("Service Name (shortId)  ")).toEqual({
            name: "Service Name",
            shortId: "shortId",
        })
    })
    it("should parse shortId from last brackets", () => {
        expect(parseMessagingServiceInformation("Service Name (NOT_ID) (shortId)")).toEqual({
            name: "Service Name (NOT_ID)",
            shortId: "shortId",
        })
    })
    it("should return empty shortId if there are no brackets", () => {
        expect(parseMessagingServiceInformation("Service Name")).toEqual({
            name: "Service Name",
            shortId: "",
        })
    })
})

describe("reduceMessagingClientServiceSearchEventUpdate", () => {
    it("should return empty list on reset", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.Reset,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: [],
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate({} as MessagingClientServiceSearchEvent, update)).toEqual(
            expected,
        )
    })
    it("should return do not modify state on unknown", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.Unknown,
        }
        const initial: MessagingClientServiceSearchEvent = {
            services: [{ name: "Service Name", shortId: "shortId" }],
            update: {} as MessagingClientServiceSearchEventUpdate,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: initial.services,
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate(initial, update)).toEqual(expected)
    })
    it("should add service on service found", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceFound,
            service: { name: "Service Name", shortId: "shortId" },
        }
        const initial: MessagingClientServiceSearchEvent = {
            services: [],
            update: {} as MessagingClientServiceSearchEventUpdate,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: [update.service],
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate(initial, update)).toEqual(expected)
    })
    it("should remove service on service lost", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceLost,
            service: { name: "Service Name", shortId: "shortId" },
        }
        const initial: MessagingClientServiceSearchEvent = {
            services: [update.service],
            update: {} as MessagingClientServiceSearchEventUpdate,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: [],
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate(initial, update)).toEqual(expected)
    })
    it("should keep other services on service lost", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceLost,
            service: { name: "Service Name", shortId: "shortId" },
        }
        const initial: MessagingClientServiceSearchEvent = {
            services: [{ name: "Other Service Name", shortId: "otherShortId" }, update.service],
            update: {} as MessagingClientServiceSearchEventUpdate,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: [{ name: "Other Service Name", shortId: "otherShortId" }],
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate(initial, update)).toEqual(expected)
    })
    it("should not add the same service twice", () => {
        const update: MessagingClientServiceSearchEventUpdate = {
            type: MessagingClientServiceSearchUpdate.ServiceFound,
            service: { name: "Service Name", shortId: "shortId" },
        }
        const initial: MessagingClientServiceSearchEvent = {
            services: [update.service],
            update: {} as MessagingClientServiceSearchEventUpdate,
        }
        const expected: MessagingClientServiceSearchEvent = {
            services: [update.service],
            update: update,
        }
        expect(reduceMessagingClientServiceSearchEventUpdate(initial, update)).toEqual(expected)
    })
})
