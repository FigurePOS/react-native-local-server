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
    private var manager: TCPServerManager
    
    override init() {
        manager = TCPServerManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createServer:withPort:withResolver:withRejecter:)
    func createServer(id: String, port: UInt16, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.createServer(id: id, port: port)
            resolve(true)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("server.already-exists", "Server with this id already exists", nil)
        } catch {
            reject("server.error", "Failed to create server", error)
        }
    }

    @objc(stopServer:withResolver:withRejecter:)
    func stopServer(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.stopServer(id: id)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("server.error", "Failed to stop server", error)
        }
    }

    @objc(send:withConnectionId:withMessage:withResolver:withRejecter:)
    func send(serverId: String, connectionId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.send(serverId: serverId, connectionId: connectionId, message: message)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("server.error", "Failed to send data", error)
        }
    }


    @objc(closeConnection:withConnectionId:withResolver:withRejecter:)
    func closeConnection(serverId: String, connectionId: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.closeConnection(serverId: serverId, connectionId: connectionId)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("server.error", "Failed to close connection", error)
        }
    }
    
    override func supportedEvents() -> [String]! {
        return self.eventNames
    }
    
    override func invalidate() {
        manager.invalidate()
        super.invalidate()
    }
}
