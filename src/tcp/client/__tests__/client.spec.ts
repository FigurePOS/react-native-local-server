import { TCPClient, TCPClientConfiguration } from "../"
import { TCPClientModule } from "../module"
import { StopReasonEnum } from "../../.."

jest.mock("../module", () => ({
    TCPClientModule: {
        send: jest.fn(),
        createClient: jest.fn(),
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

    it("should start client", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "createClient")
        const config: TCPClientConfiguration = {
            host: "localhost",
            port: 12000,
        }
        await client.start(config)
        expect(spy).toBeCalledWith(clientId, config.host, config.port)
        expect(client.getConfiguration()).toEqual(config)
        done()
    })

    it("should start client - error", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "createClient")
        const e = new Error("failed")
        TCPClientModule.createClient.mockRejectedValue(e)
        const config: TCPClientConfiguration = {
            host: "localhost",
            port: 12000,
        }
        await expect(client.start(config)).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, config.host, config.port)
        done()
    })

    it("should send data to native", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "send")
        await client.sendData("sample data")
        expect(spy).toBeCalledWith(clientId, "sample data")
        done()
    })

    it("should send data to native - error", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "send")
        const e = new Error("failed")
        TCPClientModule.send.mockRejectedValue(e)
        await expect(client.sendData("sample data")).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, "sample data")
        done()
    })

    it("should stop client", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "stopClient")
        await client.stop()
        expect(spy).toBeCalledWith(clientId, StopReasonEnum.Manual)
        done()
    })

    it("should stop client - error", async (done) => {
        const spy = jest.spyOn(TCPClientModule, "stopClient")
        const e = new Error("failed")
        TCPClientModule.stopClient.mockRejectedValue(e)
        await expect(client.stop()).rejects.toEqual(e)
        expect(spy).toBeCalledWith(clientId, StopReasonEnum.Manual)
        done()
    })
})
