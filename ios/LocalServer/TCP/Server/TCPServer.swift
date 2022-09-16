//
//  TCPServer.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class TCPServer {
    private let eventEmitter: EventEmitterWrapper
    private var connectionsByID: [String: TCPServerConnection] = [:]

    private var wasReady: Bool = false
    let id: String
    let port: NWEndpoint.Port
    let listener: NWListener
    let queue: DispatchQueue
    var lastReasonToStop: String? = nil
    
    var onStartSucceeded: (() -> ())? = nil
    var onStartFailed: ((_ reason: String) -> ())? = nil
    var onStopped: ((_ serverId: String) -> ())? = nil

    
    init(id: String, port: UInt16, eventEmitter: EventEmitterWrapper) throws {
        self.eventEmitter = eventEmitter
        queue = DispatchQueue(label: "com.react-native-local-messaging.server.\(id)")
        self.id = id
        self.port = NWEndpoint.Port(rawValue: port)!
        self.listener = try NWListener(using: .tcp, on: self.port)
    }
    
    func start() throws {
        print("TCPServer - start \(id)")
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = handleConnectionAccepted(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop(reason: String) throws {
        print("TCPServer - stop \(id)")
        self.lastReasonToStop = reason
        self.stopServer()
    }
    
    func send(connectionId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("TCPServer - send \(id)")
        print("\tconnection: \(connectionId)")
        print("\tmessage: \(message)")
        guard let connection = connectionsByID[connectionId] else {
            print("TCPServer - send - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        let preparedMessage = message + "\r\n"
        connection.send(data: (preparedMessage.data(using: .utf8))!, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func closeConnection(connectionId: String, reason: String) throws {
        print("TCPServer - close connection: \(connectionId)")
        guard let connection = connectionsByID[connectionId] else {
            print("TCPServer - closeConnection - no connection")
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
        print("TCPServer - stateDidChange \(id)")
        switch newState {
            case .setup:
                print("\tstate: setup")
                break
            case .waiting(let error):
                print("\tstate: waiting \(error)")
                self.stopServer()
                break
            case .ready:
                print("\tstate: ready")
                wasReady = true
                self.onStartSucceeded?()
                self.handleLifecycleEvent(eventName: TCPServerEventName.Ready)
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
        let connection = TCPServerConnection(serverId: id, nwConnection: nwConnection)
        print("TCPServer - connection accepted - \(connection.id)")
        self.handleConnectionLifecycleEvent(connectionId: connection.id, eventName: TCPServerEventName.ConnectionAccepted)
        self.connectionsByID[connection.id] = connection
        connection.onReady = handleConnectionReady(connectionId:)
        connection.onDataReceived = handleDataReceived(connectionId:data:)
        connection.onClosed = handleConnectionClosed(connectionId:reason:)
        connection.start()
    }
    
    private func handleConnectionReady(connectionId: String) {
        self.handleConnectionLifecycleEvent(connectionId: connectionId, eventName: TCPServerEventName.ConnectionReady)
    }
    
    private func handleConnectionClosed(connectionId: String, reason: String?) {
        self.handleConnectionLifecycleEvent(connectionId: connectionId, eventName: TCPServerEventName.ConnectionClosed, reason: reason)
        self.connectionsByID.removeValue(forKey: connectionId)
    }
    
    private func handleLifecycleEvent(eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: id)
        let reasonToStop: String? = lastReasonToStop != nil ? lastReasonToStop : reason
        if (reasonToStop != nil) {
            event.putString(key: "reason", value: reasonToStop!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func handleConnectionLifecycleEvent(connectionId: String, eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: id)
        event.putString(key: "connectionId", value: connectionId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func handleDataReceived(connectionId: String, data: String) {
        print("TCPServerConnection - did receive data")
        let event: JSEvent = JSEvent(name: TCPServerEventName.DataReceived)
        event.putString(key: "serverId", value: id)
        event.putString(key: "connectionId", value: connectionId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
    
    
    private func handleServerFailed(error: NWError? = nil) {
        if (!wasReady) {
            self.onStartFailed?(lastReasonToStop ?? "cancelled")
            return
        }
        self.onStopped?(self.id)
        let reason = error == nil ? "unknown" : error?.debugDescription
        self.handleLifecycleEvent(eventName: TCPServerEventName.Stopped, reason: reason)
    }
}
