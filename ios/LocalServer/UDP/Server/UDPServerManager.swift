//
//  UDPServerManager.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network


@available(iOS 13.0, *)
class UDPServerManager: ServerDelegateProtocol {
    private let clientManager: UDPOneTimeClientManager
    private let eventEmitter: EventEmitterWrapper
    private var servers: [String: GeneralNetworkServer] = [:]

    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
        self.clientManager = UDPOneTimeClientManager();
    }

    func createServer(id: String, port: UInt16, numberOfDroppedBytesFromMsgStart: UInt16, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("UDPServerManager [\(id)] - createServer - started")
        if let _: GeneralNetworkServer = servers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        let params: NWParameters = .udp
        let server: GeneralNetworkServer = try GeneralNetworkServer(id: id, port: port, numberOfDroppedBytesFromMsgStart: numberOfDroppedBytesFromMsgStart, params: params, delegate: self)
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
        RNLSLog("UDPServerManager [\(id)] - stopServer - started")
        guard let server: GeneralNetworkServer = servers[id] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.stop(reason: reason)
    }

    func send(host: String, port: UInt16, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String?) -> ()) throws {
        RNLSLog("UDPServerManager [\(host)] - send - started")
        try clientManager.send(host: host, port: port, message: message, onSuccess: onSuccess, onFailure: onFailure)
    }

    func closeConnection(serverId: String, connectionId: String, reason: String) throws {
        RNLSLog("UDPServerManager [\(serverId)] - closeConnection - started")
        guard let server: GeneralNetworkServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.closeConnection(connectionId: connectionId, reason: reason)
    
    }
    
    func getConnectionIds(serverId: String) throws -> [String] {
        guard let server: GeneralNetworkServer = servers[serverId] else {
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
        guard let server: GeneralNetworkServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        return server.getConnectionIds()
    }
    
    func invalidate() {
        RNLSLog("UDPServerManager - invalidate - \(servers.count) servers")
        for (key, server) in servers {
            do {
                try server.stop(reason: StopReasonEnum.Invalidation)
            } catch {
                RNLSLog("UDPServerManager - invalidate - \(key) error: \(error)")
            }
        }
        servers.removeAll()
    }
    
    private func handleLifecycleEvent(serverId: String, eventName: String, reason: String? = nil) {
        RNLSLog("UDPServerManager [\(serverId)] - event \(eventName)")
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
    func handleServerReady(serverId: String, port: UInt16) {
        handleLifecycleEvent(serverId: serverId, eventName: UDPServerEventName.Ready)
    }
    
    func handleServerStopped(serverId: String, port: UInt16, reason: String?) {
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
        RNLSLog("UDPServerManager [\(serverId)] - did receive data")
        let event: JSEvent = JSEvent(name: UDPServerEventName.DataReceived)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: connectionId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
