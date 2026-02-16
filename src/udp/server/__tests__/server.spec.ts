import { UDPServer, UDPServerConfiguration } from "../"
import { StopReasonEnum } from "../../../utils/types"
import { UDPServerModule } from "../module"

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

    it("should start server", async () => {
        const spy = jest.spyOn(UDPServerModule, "createServer")
        const config: UDPServerConfiguration = {
            port: 12000,
        }
        await server.start(config)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, 0)
        expect(server.getConfiguration()).toEqual(config)
    })

    it("should start server with set number of bytes to drop", async () => {
        const spy = jest.spyOn(UDPServerModule, "createServer")
        const config: UDPServerConfiguration = {
            port: 12000,
            numberOfDroppedBytesFromMsgStart: 20,
        }
        await server.start(config)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, config.numberOfDroppedBytesFromMsgStart)
        expect(server.getConfiguration()).toEqual(config)
    })

    it("should start server - error", async () => {
        const spy = jest.spyOn(UDPServerModule, "createServer")
        const e = new Error("failed")
        UDPServerModule.createServer.mockRejectedValue(e)
        const config: UDPServerConfiguration = {
            port: 12000,
        }
        await expect(server.start(config)).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, 0)
    })

    it("should send data to native", async () => {
        const spy = jest.spyOn(UDPServerModule, "send")
        await server.sendData("192.168.0.1", 500, "sample data")
        expect(spy).toHaveBeenCalledWith("192.168.0.1", 500, "sample data")
    })

    it("should send data to native - error", async () => {
        const spy = jest.spyOn(UDPServerModule, "send")
        const e = new Error("failed")
        UDPServerModule.send.mockRejectedValue(e)
        await expect(server.sendData("192.168.0.1", 500, "sample data")).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith("192.168.0.1", 500, "sample data")
    })

    it("should stop server", async () => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        await server.stop()
        expect(spy).toHaveBeenCalledWith(serverId, StopReasonEnum.Manual)
    })

    it("should stop server with custom reason", async () => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        await server.stop("custom-reason")
        expect(spy).toHaveBeenCalledWith(serverId, "custom-reason")
    })

    it("should stop server - error", async () => {
        const spy = jest.spyOn(UDPServerModule, "stopServer")
        const e = new Error("failed")
        UDPServerModule.stopServer.mockRejectedValue(e)
        await expect(server.stop()).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, StopReasonEnum.Manual)
    })
})
