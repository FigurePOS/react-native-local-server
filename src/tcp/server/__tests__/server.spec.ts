import { TCPServer, TCPServerConfiguration } from "../"
import { TCPServerModule } from "../module"
import { StopReasonEnum } from "../../.."

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
        return expect(server.getId()).toEqual(serverId)
    })

    it("should start server", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "createServer")
        const config: TCPServerConfiguration = {
            port: 12000,
        }
        await server.start(config)
        expect(spy).toBeCalledWith(serverId, config.port)
        expect(server.getConfiguration()).toEqual(config)
        done()
    })

    it("should start server - error", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "createServer")
        const e = new Error("failed")
        TCPServerModule.createServer.mockRejectedValue(e)
        const config: TCPServerConfiguration = {
            port: 12000,
        }
        await expect(server.start(config)).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, config.port)
        done()
    })

    it("should send data to native", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "send")
        await server.sendData(connectionId, "sample data")
        expect(spy).toBeCalledWith(serverId, connectionId, "sample data")
        done()
    })

    it("should send data to native - error", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "send")
        const e = new Error("failed")
        TCPServerModule.send.mockRejectedValue(e)
        await expect(server.sendData(connectionId, "sample data")).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, connectionId, "sample data")
        done()
    })

    it("should stop server", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "stopServer")
        await server.stop()
        expect(spy).toBeCalledWith(serverId, StopReasonEnum.Manual)
        done()
    })

    it("should stop server - error", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "stopServer")
        const e = new Error("failed")
        TCPServerModule.stopServer.mockRejectedValue(e)
        await expect(server.stop()).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, StopReasonEnum.Manual)
        done()
    })

    it("should close connection", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "closeConnection")
        await server.closeConnection(connectionId)
        expect(spy).toBeCalledWith(serverId, connectionId, StopReasonEnum.Manual)
        done()
    })

    it("should close connection - error", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "closeConnection")
        const e = new Error("failed")
        TCPServerModule.closeConnection.mockRejectedValue(e)
        await expect(server.closeConnection(connectionId)).rejects.toEqual(e)
        expect(spy).toBeCalledWith(serverId, connectionId, StopReasonEnum.Manual)
        done()
    })

    it("should get ip address", async (done) => {
        const spy = jest.spyOn(TCPServerModule, "getLocalIpAddress").mockResolvedValue("192.168.0.100")
        const result = await server.getLocalIpAddress()
        expect(spy).toBeCalled()
        expect(result).toEqual("192.168.0.100")
        done()
    })
})
