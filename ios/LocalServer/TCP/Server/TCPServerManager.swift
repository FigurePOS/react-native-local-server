//
//  TCPServerManager.swift
//  LocalServer
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
class TCPServerManager: ServerDelegateProtocol, ServiceDelegateProtocol {

    private let eventEmitter: EventEmitterWrapper
    private var servers: [String: GeneralNetworkServer] = [:]

    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }

    func createServer(id: String, port: UInt16, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        try self.createServer(id: id, port: port, discoveryGroup: nil, discoveryName: nil, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func createServer(id: String, port: UInt16, discoveryGroup: String?, discoveryName: String?, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("TCPServerManager [\(id)] - createServer - started")
        if let _: GeneralNetworkServer = servers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        let server: GeneralNetworkServer = try GeneralNetworkServer(id: id, port: port, params: .tcp, delegate: self)
        if (discoveryName != nil && discoveryGroup != nil) {
            server.prepareBonjourService(type: formatTCPDiscoveryType(discoveryGroup!), name: discoveryName!, delegate: self)
        }
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
        RNLSLog("TCPServerManager [\(id)] - stopServer - started")
        guard let server: GeneralNetworkServer = servers[id] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.stop(reason: reason)
    }

    func send(serverId: String, connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        guard let server: GeneralNetworkServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.send(connectionId: connectionId, message: message, onSuccess: onSuccess, onFailure: onFailure)
    }


    func closeConnection(serverId: String, connectionId: String, reason: String) throws {
        RNLSLog("TCPServerManager [\(serverId)] - closeConnection - started")
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
        RNLSLog("TCPServerManager - invalidate - \(servers.count) servers")
        for (key, server) in servers {
            do {
                try server.stop(reason: StopReasonEnum.Invalidation)
            } catch {
                RNLSLog("TCPServerManager - invalidate - \(key) error: \(error)")
            }
        }
        servers.removeAll()
    }
    
    private func handleLifecycleEvent(serverId: String, eventName: String, port: UInt16, reason: String? = nil) {
        RNLSLog("TCPServerManager [\(serverId)] - event \(eventName)")
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: serverId)
        event.putInt(key: "port", value: port)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleConnectionLifecycleEvent(serverId: String, connectionId: String, eventName: String, reason: String? = nil) {
        RNLSLog("TCPServerManager [\(serverId)] - event \(eventName)")
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: connectionId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    //MARK: - ServerDelegateProtocol
    func handleServerReady(serverId: String, port: UInt16) {
        handleLifecycleEvent(serverId: serverId, eventName: TCPServerEventName.Ready, port: port)
    }
    
    func handleServerStopped(serverId: String, port: UInt16, reason: String?) {
        servers.removeValue(forKey: serverId)
        handleLifecycleEvent(serverId: serverId, eventName: TCPServerEventName.Stopped, port: port, reason: reason)
    }
    
    func handleConnectionAccepted(serverId: String, connectionId: String) {
        handleConnectionLifecycleEvent(serverId: serverId, connectionId: connectionId, eventName: TCPServerEventName.ConnectionAccepted)
    }
    
    func handleConnectionReady(serverId: String, connectionId: String) {
        handleConnectionLifecycleEvent(serverId: serverId, connectionId: connectionId, eventName: TCPServerEventName.ConnectionReady)
    }
    
    func handleConnectionStopped(serverId: String, connectionId: String, reason: String?) {
        handleConnectionLifecycleEvent(serverId: serverId, connectionId: connectionId, eventName: TCPServerEventName.ConnectionClosed, reason: reason)
    }
    
    func handleDataReceived(serverId: String, connectionId: String, data: String) {
        let event: JSEvent = JSEvent(name: TCPServerEventName.DataReceived)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: connectionId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
    
    //MARK: - ServiceDelegateProtocol
    func serviceAdded(serverId: String, endpoint: NWEndpoint) {
        handleLifecycleEvent(serverId: serverId, eventName: TCPServerEventName.DiscoveryRegistered, port: 0)
    }
    
    func serviceRemoved(serverId: String, endpoint: NWEndpoint) {
        handleLifecycleEvent(serverId: serverId, eventName: TCPServerEventName.DiscoveryUnregistered, port: 0)
    }
}
