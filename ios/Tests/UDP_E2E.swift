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
        prepareServer(id: "server")
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
    
    
    func waitForServerEvent(eventName: String, serverId: String, _ operation: () throws -> ()) throws {
        try waitForServerEvent(eventName: eventName, serverId: serverId, extraPredicate: {_ in return true} , operation)
    }
    
    func waitForServerEvent(eventName: String, serverId: String, extraPredicate: @escaping (_ event: JSEvent) -> Bool, _ operation: () throws -> ()) throws {
        let exp = prepareServerExpectation(eventName: eventName, serverId: serverId, extraPredicate: extraPredicate)
        try operation()
        wait(for: [exp], timeout: 1)
    }
}
