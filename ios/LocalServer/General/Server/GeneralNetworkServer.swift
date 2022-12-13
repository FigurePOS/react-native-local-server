//
//  Server.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//


import Foundation
import Network

@available(iOS 13.0, *)
class GeneralNetworkServer: ServerConnectionDelegateProtocol {
    
    private let delegate: ServerDelegateProtocol
    private var serviceDelegate: ServiceDelegateProtocol? = nil
    private var connectionsByID: [String: GeneralNetworkServerConnection] = [:]

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
    }
    
    func prepareBonjourService(type: String, name: String, delegate: ServiceDelegateProtocol) {
        self.listener.service = NWListener.Service.init(name: name, type: type)
        self.serviceDelegate = delegate
        self.listener.serviceRegistrationUpdateHandler = serviceRegistrationHandler(update:)
    }
    
    func start(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("GeneralNetworkServer - start \(id)")
        onStartSucceeded = onSuccess
        onStartFailed = onFailure
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = handleConnectionAccepted(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop(reason: String) throws {
        print("GeneralNetworkServer - stop \(id)")
        self.lastReasonToStop = reason
        self.stopServer()
    }
    
    func send(connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("GeneralNetworkServer - send \(id)")
        print("\tconnection: \(connectionId)")
        print("\tmessage: \(message)")
        guard let connection = connectionsByID[connectionId] else {
            print("GeneralNetworkServer - send - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        let preparedMessage = message + "\r\n"
        connection.send(data: (preparedMessage.data(using: .utf8))!, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func closeConnection(connectionId: String, reason: String) throws {
        print("GeneralNetworkServer - close connection: \(connectionId)")
        guard let connection = connectionsByID[connectionId] else {
            print("GeneralNetworkServer - closeConnection - no connection")
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
        print("GeneralNetworkServer - stateDidChange \(id)")
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
        let connection = GeneralNetworkServerConnection(nwConnection: nwConnection, delegate: self)
        print("GeneralNetworkServer - connection accepted - \(connection.id)")
        delegate.handleConnectionAccepted(serverId: id, connectionId: connection.id)
        self.connectionsByID[connection.id] = connection
        connection.start()
    }
    
    private func handleServerFailed(error: NWError? = nil) {
        if (!wasReady) {
            self.onStartFailed?(lastReasonToStop ?? "cancelled")
            return
        }
        let reason = error == nil ? lastReasonToStop : error?.debugDescription
        delegate.handleServerStopped(serverId: id, reason: reason)
    }
    
    private func serviceRegistrationHandler(update: NWListener.ServiceRegistrationChange) {
        print("GeneralNetworkServer - service registration changed")
        guard let serviceDelegate = serviceDelegate else {
            print("\terror: NO DELEGATE")
            return
        }
        switch (update) {
        case .add(let data):
            print("\tevent: added")
            serviceDelegate.serviceAdded(serverId: id, endpoint: data)
            return
        case .remove(let data):
            print("\tevent: removed")
            serviceDelegate.serviceRemoved(serverId: id, endpoint: data)
            return
        default:
            return
        }
    }
    
    //MARK: - ServerConnectionDelegateProtocol
    internal func handleConnectionReady(connectionId: String) {
        delegate.handleConnectionReady(serverId: id, connectionId: connectionId)
    }
    
    internal func handleConnectionCompleted(connectionId: String) {
        guard let connection = self.connectionsByID[connectionId] else {
            return
        }
        connection.stop(reason: StopReasonEnum.ClosedByPeer)
    }
    
    internal func handleConnectionStopped(connectionId: String, reason: String?) {
        self.connectionsByID.removeValue(forKey: connectionId)
        delegate.handleConnectionStopped(serverId: id, connectionId: connectionId, reason: reason)
    }
    
    internal func handleDataReceived(connectionId: String, data: String) {
        delegate.handleDataReceived(serverId: id, connectionId: connectionId, data: data)
    }
}
