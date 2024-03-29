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
    var port: NWEndpoint.Port
    let numberOfDroppedBytesFromMsgStart: UInt16
    let listener: NWListener
    let queue: DispatchQueue
    var lastReasonToStop: String? = nil
    
    init(id: String, port: UInt16, params: NWParameters, delegate: ServerDelegateProtocol) throws {
        self.delegate = delegate
        queue = DispatchQueue(label: "com.react-native-local-messaging.server.\(id)")
        self.id = id
        self.port = port == 0 ? NWEndpoint.Port.any : NWEndpoint.Port(rawValue: port)!
        self.numberOfDroppedBytesFromMsgStart = 0
        self.listener = try NWListener(using: params, on: self.port)
    }
    
    init(id: String, port: UInt16, numberOfDroppedBytesFromMsgStart: UInt16, params: NWParameters, delegate: ServerDelegateProtocol) throws {
        self.delegate = delegate
        queue = DispatchQueue(label: "com.react-native-local-messaging.server.\(id)")
        self.id = id
        self.port = port == 0 ? NWEndpoint.Port.any : NWEndpoint.Port(rawValue: port)!
        self.numberOfDroppedBytesFromMsgStart = numberOfDroppedBytesFromMsgStart
        self.listener = try NWListener(using: params, on: self.port)
    }
    
    func prepareBonjourService(type: String, name: String, delegate: ServiceDelegateProtocol) {
        self.listener.service = NWListener.Service.init(name: name, type: type)
        self.serviceDelegate = delegate
        self.listener.serviceRegistrationUpdateHandler = serviceRegistrationHandler(update:)
    }
    
    func start(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("GeneralNetworkServer [\(self.id)] - start")
        onStartSucceeded = onSuccess
        onStartFailed = onFailure
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = handleConnectionAccepted(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop(reason: String) throws {
        RNLSLog("GeneralNetworkServer [\(self.id)] - stop")
        self.lastReasonToStop = reason
        self.stopServer()
    }
    
    func send(connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("GeneralNetworkServer [\(self.id)] - send")
        RNLSLog("\tconnection: \(connectionId)")
        RNLSLog("\tmessage: \(message)")
        guard let connection = connectionsByID[connectionId] else {
            RNLSLog("GeneralNetworkServer [\(self.id)] - send - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        let preparedMessage = message + "\r\n"
        connection.send(data: (preparedMessage.data(using: .utf8))!, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func closeConnection(connectionId: String, reason: String) throws {
        RNLSLog("GeneralNetworkServer [\(self.id)] - close connection: \(connectionId)")
        guard let connection = connectionsByID[connectionId] else {
            RNLSLog("GeneralNetworkServer [\(self.id)] - closeConnection - no connection")
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
        RNLSLog("GeneralNetworkServer [\(self.id)] - stateDidChange")
        switch newState {
            case .setup:
                RNLSLog("\tstate: setup")
                break
            case .waiting(let error):
                RNLSLog("\tstate: waiting \(error)")
                break
            case .ready:
                RNLSLog("\tstate: ready")
                wasReady = true
                self.port = listener.port!
                let tmpPort = listener.port?.rawValue ?? 0
                self.onStartSucceeded?()
                delegate.handleServerReady(serverId: id, port: tmpPort)
                break
            case .failed(let error):
                RNLSLog("\tstate: failure, error: \(error.debugDescription)")
                handleServerFailed(error: error)
                break
            case .cancelled:
                RNLSLog("\tstate: cancelled")
                self.handleServerFailed()
                break
            default:
                RNLSLog("\tstate: unknown state")
                break
        }
    }
    
    private func handleConnectionAccepted(nwConnection: NWConnection) {
        let connection = GeneralNetworkServerConnection(nwConnection: nwConnection, numberOfDroppedBytesFromMsgStart: self.numberOfDroppedBytesFromMsgStart, delegate: self)
        RNLSLog("GeneralNetworkServer [\(self.id)] - connection accepted - \(connection.id)")
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
        delegate.handleServerStopped(serverId: id, port: self.port.rawValue, reason: reason)
    }
    
    private func serviceRegistrationHandler(update: NWListener.ServiceRegistrationChange) {
        RNLSLog("GeneralNetworkServer [\(self.id)] - service registration changed")
        guard let serviceDelegate = serviceDelegate else {
            RNLSLog("\terror: NO DELEGATE")
            return
        }
        switch (update) {
        case .add(let data):
            RNLSLog("\tevent: added")
            serviceDelegate.serviceAdded(serverId: id, endpoint: data)
            return
        case .remove(let data):
            RNLSLog("\tevent: removed")
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
