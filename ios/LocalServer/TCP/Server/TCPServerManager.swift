//
//  TCPServerManager.swift
//  LocalServer
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation


class TCPServerManager {

    private let eventEmitter: EventEmitterWrapper
    private var servers: [String: TCPServer] = [:]

    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }

    func createServer(id: String, port: UInt16, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("TCPServerModule - createServer - started")
        if let _: TCPServer = servers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        let server: TCPServer = try TCPServer(id: id, port: port, eventEmitter: eventEmitter)
        server.onStartSucceeded = {
            self.servers[id] = server
            onSuccess()
        }
        server.onStartFailed = { (_ reason: String) in
            onFailure(reason)
        }
        server.onStopped = { (_ serverId: String) in
            self.servers.removeValue(forKey: serverId)
        }
        try server.start()
    }

    func stopServer(id: String, reason: String) throws {
        print("TCPServerModule - stopServer - started")
        guard let server: TCPServer = servers[id] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.stop(reason: reason)
    }

    func send(serverId: String, connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("TCPServerModule - send - started")
        guard let server: TCPServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.send(connectionId: connectionId, message: message, onSuccess: onSuccess, onFailure: onFailure)
    }


    func closeConnection(serverId: String, connectionId: String, reason: String) throws {
        print("TCPServerModule - closeConnection - started")
        guard let server: TCPServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        try server.closeConnection(connectionId: connectionId, reason: reason)
    
    }
    
    func getConnectionIds(serverId: String) throws -> [String] {
        guard let server: TCPServer = servers[serverId] else {
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
        guard let server: TCPServer = servers[serverId] else {
            throw LocalServerError.ServerDoesNotExist
        }
        return server.getConnectionIds()
    }
    
    func invalidate() {
        print("TCPServerModule - invalidate - \(servers.count) servers")
        for (key, server) in servers {
            do {
                try server.stop(reason: StopReasonEnum.Invalidation)
            } catch {
                print("TCPServerModule - invalidate - \(key) error: \(error)")
            }
        }
        servers.removeAll()
    }
}
