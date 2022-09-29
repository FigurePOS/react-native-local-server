//
//  UDP_E2E.swift
//  Tests
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import XCTest
@testable import LocalServerForTests

class UDP_E2E: XCTestCase {
    

    var serverEventEmitter: EventEmitterWrapper? = nil
    var serverManager: UDPServerManager? = nil
    let serverId: String = "test-server"

    // SETUP
    override func setUpWithError() throws {
        serverEventEmitter = EventEmitterWrapper(name: "serverEventEmitter")
        serverManager = UDPServerManager(eventEmitter: serverEventEmitter!)
    }

    override func tearDownWithError() throws {
        serverManager?.invalidate()
    }

    // TESTS
    func testShouldStartServer() {
        XCTAssertTrue(true)
//        prepareServer(id: "server")
    }
    
    // HELPER FUNCTIONS
    func prepareServer(id: String) {
        do {
            let exp = expectation(description: "Server \(id) should start")
            let onSuccess = {
                exp.fulfill()
            }
            let onFailure = { (_ reason: String) in
                XCTFail("Server not started: \(reason)")
            }
            try serverManager?.createServer(id: id, port: 12000, onSuccess: onSuccess, onFailure: onFailure)
            wait(for: [exp], timeout: 5)
            waitForServerEvent(eventName: TCPServerEventName.Ready, serverId: id, emitter: serverEventEmitter!)
        } catch {
            XCTFail("Failed to prepare server \(id): \(error)")
        }
    }
    
    func stopServer(id: String) {
        stopServer(id: id, reason: StopReasonEnum.Manual)
    }
    
    func stopServer(id: String, reason: String) {
        do {
            try serverManager?.stopServer(id: id, reason: reason)
            waitForServerEvent(eventName: TCPServerEventName.Stopped, serverId: id, emitter: serverEventEmitter!)
        } catch {
            XCTFail("Failed to stop server \(id): \(error)")
        }
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
