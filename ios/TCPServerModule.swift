//
//  LocalMessagingServer.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@objc(TCPServerModule)
class TCPServerModule: RCTEventEmitter {

    private var eventNames: [String]! = TCPServerEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()

    private var servers: [String: TCPServer] = [:]

    override init() {
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createServer:withPort:withResolver:withRejecter:)
    func createServer(id: String, port: UInt16, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - createServer - started")
        if let _: TCPServer = servers[id] {
            reject("server.already-exists", "Server with this id already exists", nil)
        }
        do {
            let server: TCPServer = try TCPServer(id: id, port: port, eventEmitter: eventEmitter)
            try server.start()
            servers[id] = server
            resolve(true)
        } catch {
            reject("server.error", "Failed to create server", error)
        }
    }

    @objc(stopServer:withResolver:withRejecter:)
    func stopServer(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - stopServer - started")
        guard let server: TCPServer = servers[id] else {
            reject("server.not-exists", "Server with this id does not exist", nil)
            return
        }
        do {
            try server.stop()
            servers.removeValue(forKey: id)
            resolve(true)
        } catch {
            reject("server.error", "Failed to stop server", error)
        }
    }

    @objc(send:withConnectionId:withMessage:withResolver:withRejecter:)
    func send(serverId: String, connectionId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - send - started")
        guard let server: TCPServer = servers[serverId] else {
            reject("server.not-exists", "Server with this id does not exist", nil)
            return
        }
        do {
            try server.send(connectionId: connectionId, message: message)
            resolve(true)
        } catch {
            reject("server.error", "Failed to send data", error)
        }
    }


    @objc(closeConnection:withConnectionId:withResolver:withRejecter:)
    func closeConnection(serverId: String, connectionId: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - closeConnection - started")
        guard let server: TCPServer = servers[serverId] else {
            reject("server.not-exists", "Server with this id does not exist", nil)
            return
        }
        do {
            try server.closeConnection(connectionId: connectionId)
            resolve(true)
        } catch {
            reject("server.error", "Failed to close connection", error)
        }
    }
    
    override func supportedEvents() -> [String]! {
        return self.eventNames
    }
    
    override func invalidate() {
        print("TCPServerModule - invalidate - \(servers.count) servers")
        for (_, server) in servers {
            server.stop()
        }
        servers.removeAll()
        super.invalidate()
    }
}
