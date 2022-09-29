import { UDPServer, UDPServerConfiguration } from "../"
import { UDPServerModule } from "../module"
import { StopReasonEnum } from "../../../utils/types"

jest.mock("../module", () => ({
    UDPServerModule: {
        send: jest.fn(),
        createServer: jest.fn(),
        stopServer: jest.fn(),
        closeConnection: jest.fn(),
        getLocalIpAddress: jest.fn(),
    },
}))

const serverId = "test-server"
const server = new UDPServer(serverId)

describe("UDPServer", () => {
    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks()
    })

    it("should return server id", () => {
        server.setLogger(null)
        return expect(server.getId()).toEqual(serverId)
    })

    it("should start server", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "createServer")
        const config: UDPServerConfiguration = {
            port: 12000,
        }
        await server.start(config)
        expect(spy).toBeCalledWith(serverId, config.port)
        expect(server.getConfiguration()).toEqual(config)
        done()
    })

    it("should start server - error", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "createServer")
        const e = new Error("failed")
        UDPServerModule.createServer.mockRejectedValue(e)
        const config: UDPServerConfiguration = {
            port: 12000,
        }
        await expect(server.start(config)).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, config.port)
        done()
    })

    it("should send data to native", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "send")
        await server.sendData("192.168.0.1", 500, "sample data")
        expect(spy).toBeCalledWith("192.168.0.1", 500, "sample data")
        done()
    })

    it("should send data to native - error", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "send")
        const e = new Error("failed")
        UDPServerModule.send.mockRejectedValue(e)
        await expect(server.sendData("192.168.0.1", 500, "sample data")).rejects.toEqual(e)
        expect(spy).toBeCalledWith("192.168.0.1", 500, "sample data")
        done()
    })

    it("should stop server", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        await server.stop()
        expect(spy).toBeCalledWith(serverId, StopReasonEnum.Manual)
        done()
    })

    it("should stop server with custom reason", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        await server.stop("custom-reason")
        expect(spy).toBeCalledWith(serverId, "custom-reason")
        done()
    })

    it("should stop server - error", async (done) => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        const e = new Error("failed")
        UDPServerModule.stopServer.mockRejectedValue(e)
        await expect(server.stop()).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, StopReasonEnum.Manual)
        done()
    })
})
