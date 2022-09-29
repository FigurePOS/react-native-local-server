//
//  UDPServerManager.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network


class UDPServerManager: ServerDelegateProtocol {
    private let eventEmitter: EventEmitterWrapper
    private var servers: [String: Server] = [:]

    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }

    func createServer(id: String, port: UInt16, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("UDPServerManager - createServer - started")
        if let _: Server = servers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        let params: NWParameters = .udp
        params.allowFastOpen = true
        let server: Server = try Server(id: id, port: port, params: params, delegate: self)
        let onStartSucceeded = {
            self.servers[id] = server
            onSuccess()
        }
        let onStartFailed = { (_ reason: String) in
            onFailure(reason)
        }

        try server.start(onSuccess: onStartSucceeded, onFailure: onStartFailed)
    }

    func stopServer(id: String, reason: String) throws {
        print("UDPServerManager - stopServer - started")
        guard let server: Server = servers[id] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.stop(reason: reason)
    }

    func send(serverId: String, connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("UDPServerManager - send - started")
        guard let server: Server = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.send(connectionId: connectionId, message: message, onSuccess: onSuccess, onFailure: onFailure)
    }


    func closeConnection(serverId: String, connectionId: String, reason: String) throws {
        print("UDPServerManager - closeConnection - started")
        guard let server: Server = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.closeConnection(connectionId: connectionId, reason: reason)
    
    }
    
    func getConnectionIds(serverId: String) throws -> [String] {
        guard let server: Server = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        return server.getConnectionIds()
    }
    
    func getServerIds() -> [String] {
        var keys: [String] = []
        for k in servers.keys {
            keys.append(k)
        }
        return keys
    }
    
    func getConnectionsFromServer(serverId: String) throws -> [String] {
        guard let server: Server = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        return server.getConnectionIds()
    }
    
    func invalidate() {
        print("UDPServerManager - invalidate - \(servers.count) servers")
        for (key, server) in servers {
            do {
                try server.stop(reason: StopReasonEnum.Invalidation)
            } catch {
                print("UDPServerManager - invalidate - \(key) error: \(error)")
            }
        }
        servers.removeAll()
    }
    
    private func handleLifecycleEvent(serverId: String, eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: serverId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
//    
//    private func handleConnectionLifecycleEvent(serverId: String, connectionId: String, eventName: String, reason: String? = nil) {
//        let event: JSEvent = JSEvent(name: eventName)
//        event.putString(key: "serverId", value: serverId)
//        event.putString(key: "connectionId", value: connectionId)
//        if (reason != nil) {
//            event.putString(key: "reason", value: reason!)
//        }
//        eventEmitter.emitEvent(event: event)
//    }
    
    //MARK: - ServerDelegateProtocol
    func handleServerReady(serverId: String) {
        handleLifecycleEvent(serverId: serverId, eventName: UDPServerEventName.Ready)
    }
    
    func handleServerStopped(serverId: String, reason: String?) {
        servers.removeValue(forKey: serverId)
        handleLifecycleEvent(serverId: serverId, eventName: UDPServerEventName.Stopped, reason: reason)
    }
    
    func handleConnectionAccepted(serverId: String, connectionId: String) {
        
    }
    
    func handleConnectionReady(serverId: String, connectionId: String) {
        
    }
    
    func handleConnectionStopped(serverId: String, connectionId: String, reason: String?) {
        
    }
    
    func handleDataReceived(serverId: String, connectionId: String, data: String) {
        print("UDPServerManager - did receive data")
        let event: JSEvent = JSEvent(name: UDPServerEventName.DataReceived)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: connectionId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
