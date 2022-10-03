//
//  TCP_E2E.swift
//  Tests
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import XCTest
@testable import LocalServerForTests

class TCP_E2E: XCTestCase {
    
    var clientEventEmitter: EventEmitterWrapper? = nil
    var clientManager: TCPClientManager? = nil
    let clientId: String = "test-client"

    var serverEventEmitter: EventEmitterWrapper? = nil
    var serverManager: TCPServerManager? = nil
    let serverId: String = "test-server"

    // SETUP
    override func setUp() {
        clientEventEmitter = EventEmitterWrapper(name: "clientEventEmitter")
        clientManager = TCPClientManager(eventEmitter: clientEventEmitter!)
        serverEventEmitter = EventEmitterWrapper(name: "serverEventEmitter")
        serverManager = TCPServerManager(eventEmitter: serverEventEmitter!)
    }

    override func tearDown() {
        clientManager?.invalidate()
        serverManager?.invalidate()
    }

    // TESTS
    func testShouldFailCreatingTwoServersWithSameId() throws {
        prepareServer(id: serverId)
        XCTAssertThrowsError(try serverManager?.createServer(id: serverId, port: 12001, onSuccess: {}, onFailure: {_ in})) { error in
            XCTAssertEqual(error as! LocalServerError, LocalServerError.ServerDoesAlreadyExist)
        }
        stopServer(id: serverId)
    }


    func testShouldFailCreatingTwoClientsWithSameId() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        XCTAssertThrowsError(try clientManager?.createClient(id: clientId, host: "localhost", port: 12001, onSuccess: {}, onFailure: {_ in})) { error in
            XCTAssertEqual(error as! LocalServerError, LocalServerError.ClientDoesAlreadyExist)
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testShouldFailCreatingClientWithUnknownHost() throws {
        let id = "client-1"
        let exp = expectation(description: "Client should not start")
        var succeeded: Bool = false
        var failed: Bool = false
        let onSuccess = {
            succeeded = true
        }
        let onFailure = { (r: String) in
            exp.fulfill()
            failed = true
        }
        do {
            try clientManager?.createClient(id: id, host: "unknown-host", port: 12000, onSuccess: onSuccess, onFailure: onFailure)
            wait(for: [exp], timeout: 5)
            XCTAssertTrue(failed)
            XCTAssertFalse(succeeded)
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
    }

    func testShouldFailCreatingClientWithUnknownPort() throws {
        let id = "client-1"
        let exp = expectation(description: "Client should not start")
        var succeeded: Bool = false
        var failed: Bool = false
        let onSuccess = {
            succeeded = true
        }
        let onFailure = { (r: String) in
            exp.fulfill()
            failed = true
        }
        do {
            try clientManager?.createClient(id: id, host: "localhost", port: 12000, onSuccess: onSuccess, onFailure: onFailure)
            wait(for: [exp], timeout: 5)
            XCTAssertTrue(failed)
            XCTAssertFalse(succeeded)
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
    }

    func testServerShouldReturnConnectionIds() throws {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connections: [String] = try serverManager?.getConnectionIds(serverId: serverId) as! [String]
            XCTAssertEqual(connections.count, 1)
        } catch {
            XCTFail("Failed to get connection ids: \(error)")
        }

        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testClientShouldSendData() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.DataReceived, serverId: serverId, {
                try clientManager?.send(clientId: clientId, message: "Hello world!", onSuccess: {}, onFailure: {_ in})
            })
            let events = serverEventEmitter?.getEvents()
            XCTAssertEqual(events?.count, 4)
            XCTAssertEqual(events?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(events?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(events?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(events?[3].getName(), TCPServerEventName.DataReceived)
            XCTAssertEqual(events?[3].getBody()["data"] as? String, "Hello world!")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testServerShouldRecieveDataTwiceInShortPeriod() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.DataReceived, serverId: serverId, extraPredicate: { (_ event: JSEvent) in
                return event.getBody()["data"] as! String == "This is message 2"
            }, {
                try clientManager?.send(clientId: clientId, message: "This is message 1", onSuccess: {}, onFailure: {_ in})
                try clientManager?.send(clientId: clientId, message: "This is message 2", onSuccess: {}, onFailure: {_ in})
            })
            let events = serverEventEmitter?.getEvents()
            if (events?.count != 5) {
                XCTFail("Server should receive exaclty 5 events. But was: \(events?.count)")
                return
            }
            XCTAssertEqual(events?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(events?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(events?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(events?[3].getName(), TCPServerEventName.DataReceived)
            XCTAssertEqual(events?[3].getBody()["data"] as? String, "This is message 1")
            XCTAssertEqual(events?[4].getName(), TCPServerEventName.DataReceived)
            XCTAssertEqual(events?[4].getBody()["data"] as? String, "This is message 2")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testServerShouldSendData() throws {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(!connections!.isEmpty)
            let connectionId: String? = connections![0]
            XCTAssertNotNil(connectionId, "ConnectionID cannot be null")

            try waitForClientEvent(eventName: TCPClientEventName.DataReceived, clientId: clientId, {
                try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "Hello world!", onSuccess: {}, onFailure: {_ in})
            })
            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.DataReceived)
            XCTAssertEqual(clientEvents?[1].getBody()["data"] as? String, "Hello world!")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testClientShouldReceiveDataTwiceInShortPeriod() throws {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(!connections!.isEmpty)
            let connectionId: String? = connections![0]
            XCTAssertNotNil(connectionId, "ConnectionID cannot be null")
            
            try waitForClientEvent(eventName: TCPClientEventName.DataReceived, clientId: clientId, extraPredicate: { (_ event: JSEvent) in
                return event.getBody()["data"] as! String == "This is message 2"
            }, {
                try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "This is message 1", onSuccess: {}, onFailure: {_ in})
                try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "This is message 2", onSuccess: {}, onFailure: {_ in})
            })
            let clientEvents = clientEventEmitter?.getEvents()

            if (clientEvents?.count != 3) {
                XCTFail("Client should receive exaclty 3 events. Actual: \(clientEvents?.count)")
                return
            }

            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.DataReceived)
            XCTAssertEqual(clientEvents?[1].getBody()["data"] as? String, "This is message 1")
            XCTAssertEqual(clientEvents?[2].getName(), TCPClientEventName.DataReceived)
            XCTAssertEqual(clientEvents?[2].getBody()["data"] as? String, "This is message 2")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }

    func testClientShouldDisconnect() throws {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })

            try waitForServerEvent(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId, {
                stopClient(id: clientId, reason: "custom-reason")
            })

            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
            XCTAssertEqual(serverEvents?[3].getBody()["reason"] as? String, StopReasonEnum.ClosedByPeer)

            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(connections!.isEmpty)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssertEqual(clientEvents?[1].getBody()["reason"] as? String, "custom-reason")
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }

    func testServerShouldAcceptMultipleConnections() throws {
        do {
            prepareServer(id: serverId)
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: "client-1")
            })
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: "client-2")
            })
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[4].getName(), TCPServerEventName.ConnectionReady)

            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssert(connections?.count == 2, "Server should have 2 connections")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }

        stopClient(id: "client-1")
        stopClient(id: "client-2")
        stopServer(id: serverId)
    }

    func testServerShouldNotStartOnUsedPort() throws {
        prepareServer(id: serverId)
        let id = "server-2"
        let exp = expectation(description: "Server should not start")
        var succeeded: Bool = false
        var failed: Bool = false
        let onSuccess = {
            succeeded = true
        }
        let onFailure = { (r: String) in
            exp.fulfill()
            failed = true
        }
        do {
            try serverManager?.createServer(id: id, port: 12000, onSuccess: onSuccess, onFailure: onFailure)
            wait(for: [exp], timeout: 5)
            XCTAssertTrue(failed)
            XCTAssertFalse(succeeded)
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
        stopServer(id: serverId)
    }

    func testServerShouldStop() throws {
        do {
            prepareServer(id: serverId)
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })

            try waitForClientEvent(eventName: TCPClientEventName.Stopped, clientId: clientId, {
                stopServer(id: serverId, reason: "custom-reason")
            })

            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
            XCTAssertEqual(serverEvents?[4].getName(), TCPServerEventName.Stopped)
            XCTAssertEqual(serverEvents?[4].getBody()["reason"] as? String, "custom-reason")
            XCTAssert(serverManager!.getServerIds().isEmpty, "There should be no servers in server manager")

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssertEqual(clientEvents?[1].getBody()["reason"] as? String, StopReasonEnum.ClosedByPeer)
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        
    }

    func testServerShouldNotSendDataToClosedConnection() throws {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            let serverExp = prepareServerExpectation(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId)
            let clientExp = prepareClientExpectation(eventName: TCPClientEventName.Stopped, clientId: clientId)
            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId, reason: StopReasonEnum.Manual)
            wait(for: [serverExp, clientExp], timeout: 1)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")

            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)

            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(connections!.isEmpty)

            XCTAssertThrowsError(try serverManager?.send(serverId: serverId, connectionId: connectionId, message: "this is the message", onSuccess: {}, onFailure: {_ in})) { error in
                XCTAssertEqual(error as! LocalServerError, LocalServerError.UnknownConnectionId)
            }
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }

    func testServerShouldCloseConnection() {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            let serverExp = prepareServerExpectation(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId)
            let clientExp = prepareClientExpectation(eventName: TCPClientEventName.Stopped, clientId: clientId)
            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId, reason: StopReasonEnum.Manual)
            wait(for: [serverExp, clientExp], timeout: 1)
            
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
            XCTAssertEqual(serverEvents?[3].getBody()["reason"] as? String, StopReasonEnum.Manual)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssertEqual(clientEvents?[1].getBody()["reason"] as? String, StopReasonEnum.ClosedByPeer)
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }

    func testServerShouldCloseConnectionWithCustomReason() {
        prepareServer(id: serverId)
        do {
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            let serverExp = prepareServerExpectation(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId)
            let clientExp = prepareClientExpectation(eventName: TCPClientEventName.Stopped, clientId: clientId)
            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId, reason: "custom-reason")
            wait(for: [serverExp, clientExp], timeout: 1)
            

            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
            XCTAssertEqual(serverEvents?[3].getBody()["reason"] as? String, "custom-reason")

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssertEqual(clientEvents?[1].getBody()["reason"] as? String, StopReasonEnum.ClosedByPeer)
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }

    func testClientShouldNotSendDataToClosedConnection() throws {
        do {
            prepareServer(id: serverId)
            try waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, {
                prepareClient(id: clientId)
            })
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            let serverExp = prepareServerExpectation(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId)
            let clientExp = prepareClientExpectation(eventName: TCPClientEventName.Stopped, clientId: clientId)
            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId, reason: StopReasonEnum.Manual)
            wait(for: [serverExp, clientExp], timeout: 1)
            
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            
            XCTAssertThrowsError(try clientManager?.send(clientId: clientId, message: "this is the message", onSuccess: {}, onFailure: {_ in})) { error in
                XCTAssertEqual(error as! LocalServerError, LocalServerError.ClientDoesNotExist)
            }
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }
    
    // HELPER FUNCTIONS
    func prepareServer(id: String) {
        do {
            try waitForServerEvent(eventName: TCPServerEventName.Ready, serverId: id, {
                let onFailure = { (_ reason: String) in
                    XCTFail("Server not started: \(reason)")
                }
                try serverManager?.createServer(id: id, port: 12000, onSuccess: {}, onFailure: onFailure)
            })
        } catch {
            XCTFail("Failed to prepare server \(id): \(error)")
        }
    }
    
    func stopServer(id: String) {
        stopServer(id: id, reason: StopReasonEnum.Manual)
    }
    
    func stopServer(id: String, reason: String) {
        do {
            try waitForServerEvent(eventName: TCPServerEventName.Stopped, serverId: id, {
                try serverManager?.stopServer(id: id, reason: reason)
            })
        } catch {
            XCTFail("Failed to stop server \(id): \(error)")
        }
    }
    
    func prepareClient(id: String) {
        do {
            try waitForClientEvent(eventName: TCPClientEventName.Ready, clientId: id, {
                let onFailure = { (_ reason: String) in
                    XCTFail("Client not started: \(reason)")
                }
                try clientManager?.createClient(id: id, host: "localhost", port: 12000, onSuccess: {}, onFailure: onFailure)
            })
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
    }
    
    func stopClient(id: String) {
        stopClient(id: id, reason: StopReasonEnum.Manual)
    }
    
    func stopClient(id: String, reason: String) {
        do {
            try waitForClientEvent(eventName: TCPClientEventName.Stopped, clientId: id, {
                try clientManager?.stopClient(id: id, reason: reason)
            })
        } catch {
            XCTFail("Failed to stop client \(id): \(error)")
        }
    }
    
    func getFirstConnectionId(serverId: String) throws -> String {
        let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
        XCTAssertTrue(!connections!.isEmpty)
        let connectionId: String? = connections![0]
        XCTAssertNotNil(connectionId, "ConnectionID cannot be null")
        return connectionId!
    }
    
    func prepareServerExpectation(eventName: String, serverId: String) -> XCTestExpectation {
        return prepareServerExpectation(eventName: eventName, serverId: serverId, extraPredicate: {_ in return true})
    }
    
    func prepareServerExpectation(eventName: String, serverId: String, extraPredicate: @escaping (_ event: JSEvent) -> Bool) -> XCTestExpectation {
        let exp = expectation(description: "Waiting for event \(eventName) on server emitter.")
        serverEventEmitter?.addOnEvent(callback: { (event: JSEvent) in
            if (eventName == event.getName() && serverId == event.getBody()["serverId"] as! String && extraPredicate(event)) {
                exp.fulfill()
                return false
            }
            return true
        })
        return exp
    }
    
    func prepareClientExpectation(eventName: String, clientId: String) -> XCTestExpectation {
        return prepareClientExpectation(eventName: eventName, clientId: clientId, extraPredicate: {_ in return true})
    }
    
    func prepareClientExpectation(eventName: String, clientId: String, extraPredicate: @escaping (_ event: JSEvent) -> Bool) -> XCTestExpectation {
        let exp = expectation(description: "Waiting for event \(eventName) on client emitter.")
        clientEventEmitter?.addOnEvent(callback: { (event: JSEvent) in
            if (eventName == event.getName() && clientId == event.getBody()["clientId"] as! String && extraPredicate(event)) {
                exp.fulfill()
                return false
            }
            return true
        })
        return exp
    }
    
    func waitForServerEvent(eventName: String, serverId: String, _ operation: () throws -> ()) throws {
        try waitForServerEvent(eventName: eventName, serverId: serverId, extraPredicate: {_ in return true} , operation)
    }
    
    func waitForServerEvent(eventName: String, serverId: String, extraPredicate: @escaping (_ event: JSEvent) -> Bool, _ operation: () throws -> ()) throws {
        let exp = prepareServerExpectation(eventName: eventName, serverId: serverId, extraPredicate: extraPredicate)
        try operation()
        wait(for: [exp], timeout: 1)
    }
    
    
    func waitForClientEvent(eventName: String, clientId: String, _ operation: () throws -> ()) throws {
        try waitForClientEvent(eventName: eventName, clientId: clientId, extraPredicate: {_ in return true}, operation)
    }
    
    func waitForClientEvent(eventName: String, clientId: String, extraPredicate: @escaping (_ event: JSEvent) -> Bool, _ operation: () throws -> ()) throws {
        let exp = prepareClientExpectation(eventName: eventName, clientId: clientId, extraPredicate: extraPredicate)
        try operation()
        wait(for: [exp], timeout: 1)
    }
}
