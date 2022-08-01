//
//  TCPServerConnection.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class TCPServerConnection {
    private let eventEmitter: EventEmitterWrapper

    //The TCP maximum package size is 64K 65536
    let MTU = 65536
    let connection: NWConnection
    let id: String
    let serverId: String

    init(serverId: String, nwConnection: NWConnection, eventEmitter: EventEmitterWrapper) {
        self.serverId = serverId
        self.eventEmitter = eventEmitter
        connection = nwConnection
        id = UUID().uuidString.lowercased()
    }

    var didStopCallback: ((Error?) -> Void)? = nil

    func start() {
        print("TCPServerConnection - start \(id)")
        connection.stateUpdateHandler = self.stateDidChange(to:)
        setupReceive()
        // TODO change queue
        connection.start(queue: .main)
    }

    private func stateDidChange(to state: NWConnection.State) {
        let prefix = "TCPServerConnection - stateDidChange \(id)\n"
        switch state {
            case .setup:
                print("\(prefix)\tstate: setup")
                break
            case .waiting(let error):
                print("\(prefix)\tstate: waiting \(error.debugDescription)")
                break
            case .preparing:
                print("\(prefix)\tstate: preparing")
                break
            case .ready:
                print("\(prefix)\tstate: ready")
                self.handleLifecycleEvent(eventName: TCPServerEventName.ConnectionReady)
                break
            case .failed(let error):
                print("\(prefix)\tstate: failure, error: \(error.debugDescription)")
                self.handleLifecycleEvent(eventName: TCPServerEventName.ConnectionClosed, error: error)
                break
            case .cancelled:
                print("\(prefix)\tstate: cancelled")
                self.handleLifecycleEvent(eventName: TCPServerEventName.ConnectionClosed, error: nil)
                break
            default:
                print("\(prefix)\tstate: unknown state - \(state)")
                break
        }
    }

    private func setupReceive() {
        connection.receive(minimumIncompleteLength: 1, maximumLength: MTU) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                print("TCPServerConnection - did receive data")
                self.handleDataReceived(data: data)
            }
            if isComplete {
                print("TCPServerConnection - is complete")
                self.connectionDidEnd()
            } else if let error = error {
                print("TCPServerConnection - error when receiving data \n\treason: \(error)")
                self.connectionDidFail(error: error)
            } else {
                self.setupReceive()
            }
        }
    }


    func send(data: Data) {
        self.connection.send(content: data, completion: .contentProcessed( { error in
            if let error = error {
                self.connectionDidFail(error: error)
                return
            }
            print("connection \(self.id) did send, data: \(data as NSData)")
        }))
    }

    func stop() {
        print("connection \(id) will stop")
        closeConnection(reason: nil)
    }

    private func connectionDidFail(error: Error) {
        print("connection \(id) did fail, error: \(error)")
        closeConnection(reason: error)
    }

    private func connectionDidEnd() {
        print("connection \(id) did end")
        closeConnection(reason: nil)
    }

    private func closeConnection(reason: Error?) {
        connection.cancel()
        if let didStopCallback = didStopCallback {
            self.didStopCallback = nil
            didStopCallback(reason)
        }
    }
    
    private func handleLifecycleEvent(eventName: String, error: Error? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: id)
        if (error != nil) {
            event.putString(key: "error", value: error.debugDescription)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func handleDataReceived(data: Data) {
        let parsedData: String = String(decoding: data, as: UTF8.self).trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        let event: JSEvent = JSEvent(name: TCPServerEventName.DataReceived)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: id)
        event.putString(key: "data", value: parsedData)
        eventEmitter.emitEvent(event: event)
    }
}
