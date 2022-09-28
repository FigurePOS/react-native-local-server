//
//  Server.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//


import Foundation
import Network

@available(iOS 12.0, *)
class Server: ServerConnectionDelegateProtocol {
    
    private let delegate: ServerDelegateProtocol
    private var connectionsByID: [String: ServerConnection] = [:]

    private var wasReady: Bool = false
    private var onStartSucceeded: (() -> ())? = nil
    private var onStartFailed: ((_ reason: String) -> ())? = nil
    
    let id: String
    let port: NWEndpoint.Port
    let listener: NWListener
    let queue: DispatchQueue
    var lastReasonToStop: String? = nil
    
    init(id: String, port: UInt16, params: NWParameters, delegate: ServerDelegateProtocol) throws {
        self.delegate = delegate
        queue = DispatchQueue(label: "com.react-native-local-messaging.server.\(id)")
        self.id = id
        self.port = NWEndpoint.Port(rawValue: port)!
        self.listener = try NWListener(using: params, on: self.port)
        self.listener.service = 
    }
    
    func start(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("Server - start \(id)")
        onStartSucceeded = onSuccess
        onStartFailed = onFailure
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = handleConnectionAccepted(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop(reason: String) throws {
        print("Server - stop \(id)")
        self.lastReasonToStop = reason
        self.stopServer()
    }
    
    func send(connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("Server - send \(id)")
        print("\tconnection: \(connectionId)")
        print("\tmessage: \(message)")
        guard let connection = connectionsByID[connectionId] else {
            print("Server - send - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        let preparedMessage = message + "\r\n"
        connection.send(data: (preparedMessage.data(using: .utf8))!, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func closeConnection(connectionId: String, reason: String) throws {
        print("Server - close connection: \(connectionId)")
        guard let connection = connectionsByID[connectionId] else {
            print("Server - closeConnection - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        connection.stop(reason: reason)
    }
    
    func getConnectionIds() -> [String] {
        var keys: [String] = []
        for k in connectionsByID.keys {
            keys.append(k)
        }
        return keys
    }
    
    private func stopServer() {
        self.listener.newConnectionHandler = nil
        for connection in self.connectionsByID.values {
            connection.stop(reason: StopReasonEnum.Invalidation)
        }
        self.listener.cancel()
    }
    
    private func stateDidChange(to newState: NWListener.State) {
        print("Server - stateDidChange \(id)")
        switch newState {
            case .setup:
                print("\tstate: setup")
                break
            case .waiting(let error):
                print("\tstate: waiting \(error)")
                break
            case .ready:
                print("\tstate: ready")
                wasReady = true
                self.onStartSucceeded?()
                delegate.handleServerReady(serverId: id)
                break
            case .failed(let error):
                print("\tstate: failure, error: \(error.debugDescription)")
                handleServerFailed(error: error)
                break
            case .cancelled:
                print("\tstate: cancelled")
                self.handleServerFailed()
                break
            default:
                print("\tstate: unknown state")
                break
        }
    }
    
    private func handleConnectionAccepted(nwConnection: NWConnection) {
        let connection = ServerConnection(nwConnection: nwConnection, delegate: self)
        print("Server - connection accepted - \(connection.id)")
        delegate.handleConnectionAccepted(serverId: id, connectionId: connection.id)
        self.connectionsByID[connection.id] = connection
        connection.start()
    }
    
    private func handleServerFailed(error: NWError? = nil) {
        if (!wasReady) {
            self.onStartFailed?(lastReasonToStop ?? "cancelled")
            return
        }
        let reason = error == nil ? "unknown" : error?.debugDescription
        delegate.handleServerStopped(serverId: id, reason: reason)
    }
    
    //MARK: - ServerConnectionDelegateProtocol
    internal func handleConnectionReady(connectionId: String) {
        delegate.handleConnectionReady(serverId: id, connectionId: connectionId)
    }
    
    internal func handleConnectionStopped(connectionId: String, reason: String?) {
        self.connectionsByID.removeValue(forKey: connectionId)
        delegate.handleConnectionStopped(serverId: id, connectionId: connectionId, reason: reason)
    }
    
    internal func handleDataReceived(connectionId: String, data: String) {
        delegate.handleDataReceived(serverId: id, connectionId: connectionId, data: data)
    }
}
