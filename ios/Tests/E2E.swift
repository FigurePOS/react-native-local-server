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

    var serverEventEmitter: EventEmitterWrapper? = nil
    var serverManager: TCPServerManager? = nil

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

    func testClientShouldSendData() throws {
        prepareServer(id: "test-server")
        prepareClient(id: "test-client")
        do {
            try clientManager?.send(clientId: "test-client", message: "Hello world!")
            waitForEvent(eventName: TCPServerEventName.DataReceived, emitter: serverEventEmitter!)
            let events = serverEventEmitter?.getEvents()
            XCTAssertEqual(events?[0].getName(), TCPServerEventName.Ready)
            XCTAssertEqual(events?[1].getName(), TCPServerEventName.ConnectionAccepted)
            XCTAssertEqual(events?[2].getName(), TCPServerEventName.ConnectionReady)
            XCTAssertEqual(events?[3].getName(), TCPServerEventName.DataReceived)
            XCTAssertEqual(events?[3].getBody()["data"] as? String, "Hello world!")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
    }
    
    func testServerShouldSendData() throws {
        prepareServer(id: "test-server")
        prepareClient(id: "test-client")
        do {
            waitForEvent(eventName: TCPServerEventName.ConnectionReady, emitter: serverEventEmitter!)
            let serverEvents = serverEventEmitter?.getEvents()
            XCTAssertEqual(serverEvents?[2].getName(), TCPServerEventName.ConnectionReady)
            let connectionId: String? = serverEvents?[2].getBody()["connectionId"] as? String
            XCTAssertNotNil(connectionId, "ConnectionID cannot be null")
            
            try serverManager?.send(serverId: "test-server", connectionId: connectionId!, message: "Hello world!")
            
            waitForEvent(eventName: TCPClientEventName.DataReceived, emitter: clientEventEmitter!)
            let clientEvents = clientEventEmitter?.getEvents()
            XCTAssertEqual(clientEvents?[0].getName(), TCPClientEventName.Ready)
            XCTAssertEqual(clientEvents?[1].getName(), TCPClientEventName.DataReceived)
            XCTAssertEqual(clientEvents?[1].getBody()["data"] as? String, "Hello world!")
        } catch {
            XCTFail("FAILED WITH ERRROR: \(error)")
        }
    }

    func prepareServer(id: String) {
        do {
            try serverManager?.createServer(id: id, port: 12000)
            waitForEvent(eventName: TCPServerEventName.Ready, emitter: serverEventEmitter!)
        } catch {
            XCTFail("Failed to prepare server \(id): \(error)")
        }
    }
    
    func prepareClient(id: String) {
        do {
            try clientManager?.createClient(id: id, host: "localhost", port: 12000)
            waitForEvent(eventName: TCPClientEventName.Ready, emitter: clientEventEmitter!)
        } catch {
            XCTFail("Failed to prepare client \(id): \(error)")
        }
    }
    
    func waitForEvent(eventName: String, emitter: EventEmitterWrapper) {
        let predicate = NSPredicate { (evaluatedObject, _) in
            return (evaluatedObject as! EventEmitterWrapper).getEvents().contains(where: {(event) in
                return eventName == event.getName()
            })
        }
        let exp = XCTNSPredicateExpectation(predicate: predicate, object: emitter)
        exp.expectationDescription = "Waiting  for event \(eventName) on emitter (\(emitter.name))."
        wait(for: [exp], timeout: 5)
    }
    
    
    func waitForEvent(eventName: String, body: Dictionary<String, Any>, emitter: EventEmitterWrapper) {
        let predicate = NSPredicate { (evaluatedObject, _) in
            return (evaluatedObject as! EventEmitterWrapper).getEvents().contains(where: {(event) in
                return eventName == event.getName() && (body as NSDictionary).isEqual(to: event.getBody())
            })
        }
        let exp = XCTNSPredicateExpectation(predicate: predicate, object: emitter)
        exp.expectationDescription = "Waiting  for event \(eventName) on emitter (\(emitter.name))."
        wait(for: [exp], timeout: 5)
    }

}
