import { TCPClient, TCPClientConfiguration, TCPClientConnectionMethod } from "../"
import { TCPClientModule } from "../module"
import { StopReasonEnum } from "../../.."

jest.mock("../module", () => ({
    TCPClientModule: {
        send: jest.fn(),
        createClient: jest.fn(),
        createClientFromDiscovery: jest.fn(),
        stopClient: jest.fn(),
    },
}))

const clientId = "test-client"
const client = new TCPClient(clientId)

describe("TCPClient", () => {
    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks()
    })

    it("should return client id", () => {
        client.setLogger(null)
        return expect(client.getId()).toEqual(clientId)
    })

    it("should start client - raw method", async () => {
        const spy = jest.spyOn(TCPClientModule, "createClient")
        const config: TCPClientConfiguration = {
            connection: {
                method: TCPClientConnectionMethod.Raw,
                host: "localhost",
                port: 12000,
            },
        }
        await client.start(config)
        expect(spy).toBeCalledWith(clientId, "localhost", 12000)
        expect(client.getConfiguration()).toEqual(config)
    })

    it("should start client - discovery method", async () => {
        const spy = jest.spyOn(TCPClientModule, "createClientFromDiscovery")
        const config: TCPClientConfiguration = {
            connection: {
                method: TCPClientConnectionMethod.Discovery,
                group: "fgr-counter",
                name: "My Counter (123456)",
            },
        }
        await client.start(config)
        expect(spy).toBeCalledWith(clientId, "fgr-counter", "My Counter (123456)")
        expect(client.getConfiguration()).toEqual(config)
    })

    it("should start client - error", async () => {
        const spy = jest.spyOn(TCPClientModule, "createClient")
        const e = new Error("failed")
        TCPClientModule.createClient.mockRejectedValue(e)
        const config: TCPClientConfiguration = {
            connection: {
                method: TCPClientConnectionMethod.Raw,
                host: "localhost",
                port: 12000,
            },
        }
        await expect(client.start(config)).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, "localhost", 12000)
    })

    it("should send data to native", async () => {
        const spy = jest.spyOn(TCPClientModule, "send")
        await client.sendData("sample data")
        expect(spy).toBeCalledWith(clientId, "sample data")
    })

    it("should send data to native - error", async () => {
        const spy = jest.spyOn(TCPClientModule, "send")
        const e = new Error("failed")
        TCPClientModule.send.mockRejectedValue(e)
        await expect(client.sendData("sample data")).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, "sample data")
    })

    it("should stop client", async () => {
        const spy = jest.spyOn(TCPClientModule, "stopClient")
        await client.stop()
        expect(spy).toBeCalledWith(clientId, StopReasonEnum.Manual)
    })

    it("should stop client - error", async () => {
        const spy = jest.spyOn(TCPClientModule, "stopClient")
        const e = new Error("failed")
        TCPClientModule.stopClient.mockRejectedValue(e)
        await expect(client.stop()).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, StopReasonEnum.Manual)
    })
})
