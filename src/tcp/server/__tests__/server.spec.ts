import { TCPServer, TCPServerConfiguration } from "../"
import { StopReasonEnum } from "../../.."
import { TCPServerModule } from "../module"

jest.mock("../module", () => ({
    TCPServerModule: {
        send: jest.fn(),
        createServer: jest.fn(),
        stopServer: jest.fn(),
        closeConnection: jest.fn(),
        getLocalIpAddress: jest.fn(),
    },
}))

const serverId = "test-server"
const connectionId = "connection-1"
const server = new TCPServer(serverId)

describe("TCPServer", () => {
    afterEach(() => {
        // restore the spy created with spyOn
        jest.restoreAllMocks()
    })

    it("should return server id", () => {
        server.setLogger(null)
        expect(server.getId()).toEqual(serverId)
    })

    it("should start server", async () => {
        const spy = jest.spyOn(TCPServerModule, "createServer")
        const config: TCPServerConfiguration = {
            port: 12000,
        }
        await server.start(config)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, null, null)
        expect(server.getConfiguration()).toEqual(config)
    })

    it("should start server - discovery", async () => {
        const spy = jest.spyOn(TCPServerModule, "createServer")
        const config: TCPServerConfiguration = {
            port: 12000,
            discovery: {
                group: "test-group",
                name: "test-name",
            },
        }
        await server.start(config)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, "test-group", "test-name")
        expect(server.getConfiguration()).toEqual(config)
    })

    it("should start server - error", async () => {
        const spy = jest.spyOn(TCPServerModule, "createServer")
        const e = new Error("failed")
        TCPServerModule.createServer.mockRejectedValue(e)
        const config: TCPServerConfiguration = {
            port: 12000,
        }
        await expect(server.start(config)).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, config.port, null, null)
    })

    it("should send data to native", async () => {
        const spy = jest.spyOn(TCPServerModule, "send")
        await server.sendData(connectionId, "sample data")
        expect(spy).toHaveBeenCalledWith(serverId, connectionId, "sample data")
    })

    it("should send data to native - error", async () => {
        const spy = jest.spyOn(TCPServerModule, "send")
        const e = new Error("failed")
        TCPServerModule.send.mockRejectedValue(e)
        await expect(server.sendData(connectionId, "sample data")).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, connectionId, "sample data")
    })

    it("should stop server", async () => {
        const spy = jest.spyOn(TCPServerModule, "stopServer")
        await server.stop()
        expect(spy).toHaveBeenCalledWith(serverId, StopReasonEnum.Manual)
    })

    it("should stop server - error", async () => {
        const spy = jest.spyOn(TCPServerModule, "stopServer")
        const e = new Error("failed")
        TCPServerModule.stopServer.mockRejectedValue(e)
        await expect(server.stop()).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, StopReasonEnum.Manual)
    })

    it("should close connection", async () => {
        const spy = jest.spyOn(TCPServerModule, "closeConnection")
        await server.closeConnection(connectionId)
        expect(spy).toHaveBeenCalledWith(serverId, connectionId, StopReasonEnum.Manual)
    })

    it("should close connection - error", async () => {
        const spy = jest.spyOn(TCPServerModule, "closeConnection")
        const e = new Error("failed")
        TCPServerModule.closeConnection.mockRejectedValue(e)
        await expect(server.closeConnection(connectionId)).rejects.toEqual(e)
        expect(spy).toHaveBeenCalledWith(serverId, connectionId, StopReasonEnum.Manual)
    })

    it("should get ip address", async () => {
        const spy = jest.spyOn(TCPServerModule, "getLocalIpAddress").mockResolvedValue("192.168.0.100")
        const result = await server.getLocalIpAddress()
        expect(spy).toHaveBeenCalled()
        expect(result).toEqual("192.168.0.100")
    })
})
