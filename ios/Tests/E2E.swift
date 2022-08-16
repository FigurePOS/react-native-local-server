//
//  E2E.swift
//  Tests
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import XCTest
@testable import LocalServerForTests

class E2E: XCTestCase {
    
    var clientEventEmitter: EventEmitterWrapper? = nil
    var clientManager: TCPClientManager? = nil
    let clientId: String = "test-client"

    var serverEventEmitter: EventEmitterWrapper? = nil
    var serverManager: TCPServerManager? = nil
    let serverId: String = "test-server"

    // SETUP
    override func setUpWithError() throws {
        clientEventEmitter = EventEmitterWrapper(name: "clientEventEmitter")
        clientManager = TCPClientManager(eventEmitter: clientEventEmitter!)
        serverEventEmitter = EventEmitterWrapper(name: "serverEventEmitter")
        serverManager = TCPServerManager(eventEmitter: serverEventEmitter!)
    }

    override func tearDownWithError() throws {
        clientManager?.invalidate()
        serverManager?.invalidate()
        
    }

    // TESTS
    func testShouldFailCreatingTwoServersWithSameId() throws {
        prepareServer(id: serverId)
        XCTAssertThrowsError(try serverManager?.createServer(id: serverId, port: 12001)) { error in
            XCTAssertEqual(error as! LocalServerError, LocalServerError.ServerDoesAlreadyExist)
        }
        stopServer(id: serverId)
    }

    
    func testShouldFailCreatingTwoClientsWithSameId() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        XCTAssertThrowsError(try clientManager?.createClient(id: clientId, host: "localhost", port: 12001)) { error in
            XCTAssertEqual(error as! LocalServerError, LocalServerError.ClientDoesAlreadyExist)
        }
        stopClient(id: clientId)
        stopServer(id: serverId)
    }
    
    func testClientShouldSendData() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            try clientManager?.send(clientId: clientId, message: "Hello world!")
            waitForServerEvent(eventName: TCPServerEventName.DataReceived, serverId: serverId, emitter: serverEventEmitter!)
            let events = serverEventEmitter?.getEvents()
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
            try clientManager?.send(clientId: clientId, message: "This is message 1")
            try clientManager?.send(clientId: clientId, message: "This is message 2")
            waitForServerEvent(eventName: TCPServerEventName.DataReceived, serverId: serverId, emitter: serverEventEmitter!)
            let events = serverEventEmitter?.getEvents()
            if (events?.count != 5) {
                XCTFail("Server should receive exaclty 5 events.")
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
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(!connections!.isEmpty)
            let connectionId: String? = connections![0]
            XCTAssertNotNil(connectionId, "ConnectionID cannot be null")
            
            try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "Hello world!")
            
            waitForClientEvent(eventName: TCPClientEventName.DataReceived, clientId: clientId, emitter: clientEventEmitter!)
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
    
    func testClientShouldRecieveDataTwiceInShortPeriod() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(!connections!.isEmpty)
            let connectionId: String? = connections![0]
            XCTAssertNotNil(connectionId, "ConnectionID cannot be null")
            
            try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "This is message 1")
            try serverManager?.send(serverId: serverId, connectionId: connectionId!, message: "This is message 2")
            waitForClientEvent(eventName: TCPClientEventName.DataReceived, clientId: clientId, emitter: clientEventEmitter!)
            let clientEvents = clientEventEmitter?.getEvents()

            if (clientEvents?.count != 3) {
                XCTFail("Client should receive exaclty 3 events.")
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
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            
            stopClient(id: clientId)
            
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
            
            let connections = try serverManager?.getConnectionsFromServer(serverId: serverId)
            XCTAssertTrue(connections!.isEmpty)
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)

    }
    
    func testServerShouldAcceptMultipleConnections() throws {
        prepareServer(id: serverId)
        prepareClient(id: "client-1")
        prepareClient(id: "client-2")
        
        do {
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
    
    func testServerShouldStop() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        
        waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)

        stopServer(id: serverId)

        let serverEvents = serverEventEmitter?.getEvents()
        XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
        XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
        XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
        XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)
        XCTAssertEqual(serverEvents?[4].getName(), TCPServerEventName.Stopped)
        XCTAssert(serverManager!.getServerIds().isEmpty, "There should be no servers in server manager")
        
        let clientEvents = clientEventEmitter?.getEvents()
        XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
        XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
        XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
    }
    
    func testServerShouldNotSendDataToClosedConnection() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            let connectionId: String = try getFirstConnectionId(serverId: serverId)
            
            stopClient(id: clientId)
            
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
            
            XCTAssertThrowsError(try serverManager?.send(serverId: serverId, connectionId: connectionId, message: "this is the message")) { error in
                XCTAssertEqual(error as! LocalServerError, LocalServerError.UnknownConnectionId)
            }
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }
    
    func testServerShouldCloseConnection() {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId)
            waitForServerEvent(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId, emitter: serverEventEmitter!)
            
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            XCTAssert(clientManager!.getClientIds().isEmpty, "There should be no clients in client manager")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
        stopServer(id: serverId)
    }
    
    func testClientShouldNotSendDataToClosedConnection() throws {
        prepareServer(id: serverId)
        prepareClient(id: clientId)
        do {
            waitForServerEvent(eventName: TCPServerEventName.ConnectionReady, serverId: serverId, emitter: serverEventEmitter!)
            let connectionId: String = try getFirstConnectionId(serverId: serverId)

            try serverManager?.closeConnection(serverId: serverId, connectionId: connectionId)
            waitForServerEvent(eventName: TCPServerEventName.ConnectionClosed, serverId: serverId, emitter: serverEventEmitter!)
            
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(serverEvents?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(serverEvents?[3].getName(), TCPServerEventName.ConnectionClosed)

            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.Stopped)
            
            XCTAssertThrowsError(try clientManager?.send(clientId: clientId, message: "this is the message")) { error in
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
            try serverManager?.createServer(id: id, port: 12000)
            waitForServerEvent(eventName: TCPServerEventName.Ready, serverId: id, emitter: serverEventEmitter!)
        } catch {
            XCTFail("Failed to prepare server \(id): \(error)")
        }
    }
    
    func stopServer(id: String) {
        do {
            try serverManager?.stopServer(id: id)
            waitForServerEvent(eventName: TCPServerEventName.Stopped, serverId: id, emitter: serverEventEmitter!)
        } catch {
            XCTFail("Failed to stop server \(id): \(error)")
        }
    }
    
    func prepareClient(id: String) {
        do {
            try clientManager?.createClient(id: id, host: "localhost", port: 12000)
            waitForClientEvent(eventName: TCPClientEventName.Ready, clientId: id, emitter: clientEventEmitter!)
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
    }
    
    func stopClient(id: String) {
        do {
            try clientManager?.stopClient(id: id)
            waitForClientEvent(eventName: TCPClientEventName.Stopped, clientId: id, emitter: clientEventEmitter!)
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
    
    func waitForServerEvent(eventName: String, serverId: String, emitter: EventEmitterWrapper) {
        let predicate = NSPredicate { (evaluatedObject, _) in
            return (evaluatedObject as! EventEmitterWrapper).getEvents().contains(where: {(event) in
                return eventName == event.getName() && serverId == event.getBody()["serverId"] as! String
            })
        }
        let exp = XCTNSPredicateExpectation(predicate: predicate, object: emitter)
        exp.expectationDescription = "Waiting for event \(eventName) on emitter (\(emitter.name))."
        wait(for: [exp], timeout: 5)
    }
    
    
    func waitForClientEvent(eventName: String, clientId: String, emitter: EventEmitterWrapper) {
        let predicate = NSPredicate { (evaluatedObject, _) in
            return (evaluatedObject as! EventEmitterWrapper).getEvents().contains(where: {(event) in
                return eventName == event.getName() && clientId == event.getBody()["clientId"] as! String
            })
        }
        let exp = XCTNSPredicateExpectation(predicate: predicate, object: emitter)
        exp.expectationDescription = "Waiting for event \(eventName) on emitter (\(emitter.name))."
        wait(for: [exp], timeout: 5)
    }
    
    
    func waitForEvent(eventName: String, body: Dictionary<String, Any>, emitter: EventEmitterWrapper) {
        let predicate = NSPredicate { (evaluatedObject, _) in
            return (evaluatedObject as! EventEmitterWrapper).getEvents().contains(where: {(event) in
                return eventName == event.getName() && (body as NSDictionary).isEqual(to: event.getBody())
            })
        }
        let exp = XCTNSPredicateExpectation(predicate: predicate, object: emitter)
        exp.expectationDescription = "Waiting for event \(eventName) on emitter (\(emitter.name))."
        wait(for: [exp], timeout: 5)
    }

}
