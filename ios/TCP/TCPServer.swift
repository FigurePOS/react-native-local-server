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
    
    let id: String
    let port: NWEndpoint.Port
    let listener: NWListener
    let queue: DispatchQueue
    
    private var connectionsByID: [String: TCPServerConnection] = [:]
    
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
        listener.newConnectionHandler = didAccept(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop() {
        print("TCPServer - stop \(id)")
        self.listener.newConnectionHandler = nil
        for connection in self.connectionsByID.values {
            connection.didStopCallback = nil
            connection.stop()
        }
        self.connectionsByID.removeAll()
        self.listener.cancel()
    }
    
    func send(connectionId: String, message: String) throws {
        print("TCPServer - send \(id)")
        print("\tconnection: \(connectionId)")
        print("\tmessage: \(message)")
        guard let connection = connectionsByID[connectionId] else {
            print("TCPServer - send - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        let preparedMessage = message + "\r\n"
        connection.send(data: (preparedMessage.data(using: .utf8))!)
    }
    
    func closeConnection(connectionId: String) throws {
        print("TCPServer - close connection: \(connectionId)")
        guard let connection = connectionsByID[connectionId] else {
            print("TCPServer - closeConnection - no connection")
            throw LocalServerError.UnknownConnectionId
        }
        connection.stop()
    }
    
    private func stateDidChange(to newState: NWListener.State) {
        print("TCPServer - stateDidChange \(id)")
        switch newState {
            case .setup:
                print("\tstate: setup")
                break
            case .waiting(let error):
                print("\tstate: waiting \(error)")
                break
            case .ready:
                print("\tstate: ready")
                self.handleLifecycleEvent(eventName: TCPServerEventName.Ready)
                break
            case .failed(let error):
                print("\tstate: failure, error: \(error.debugDescription)")
                break
            case .cancelled:
                print("\tstate: cancelled")
                self.handleLifecycleEvent(eventName: TCPServerEventName.Stopped)
                break
            default:
                print("\tstate: unknown state")
                break
        }
    }
    
    private func handleLifecycleEvent(eventName: String, error: Error? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: id)
        if (error != nil) {
            event.putString(key: "reason", value: error.debugDescription)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func handleConnectionLifecycleEvent(connectionId: String, eventName: String, error: Error? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: id)
        event.putString(key: "connectionId", value: connectionId)
        if (error != nil) {
            event.putString(key: "reason", value: error.debugDescription)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func didAccept(nwConnection: NWConnection) {
        let connection = TCPServerConnection(serverId: id, nwConnection: nwConnection, eventEmitter: eventEmitter)
        print("TCPServer - connection accepted - \(connection.id)")
        self.handleConnectionLifecycleEvent(connectionId: connection.id, eventName: TCPServerEventName.ConnectionAccepted)
        self.connectionsByID[connection.id] = connection
        connection.didStopCallback = { error in
            self.connectionDidStop(connection: connection, error: error)
        }
        connection.start()
    }

    private func connectionDidStop(connection: TCPServerConnection, error: Error?) {
        print("TCPServer - connection did stop - \(connection.id) \n\treason: \(error.debugDescription)")
        self.connectionsByID.removeValue(forKey: connection.id)
        self.handleConnectionLifecycleEvent(connectionId: connection.id, eventName: TCPServerEventName.ConnectionClosed, error: error)
    }
}
