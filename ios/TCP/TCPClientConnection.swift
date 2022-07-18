//
//  TCPClientConnection.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class TCPClientConnection {

    private let eventEmitter: EventEmitterWrapper

    let clientId: String
    let nwConnection: NWConnection
    let queue: DispatchQueue
    
    let host: NWEndpoint.Host
    let port: NWEndpoint.Port


    init(clientId: String, host: String, port: UInt16, eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter
        self.clientId = clientId
        self.host = NWEndpoint.Host(host)
        self.port = NWEndpoint.Port(rawValue: port)!
        let nwConnection = NWConnection(host: self.host, port: self.port, using: .tcp)
        self.nwConnection = nwConnection
        self.queue = DispatchQueue(label: "com.react-native-messaging.client." + clientId)
    }

    func start() {
        print("TCPClientConnection - start: \(clientId)")
        nwConnection.stateUpdateHandler = stateDidChange(to:)
        setupReceive()
        nwConnection.start(queue: self.queue)
    }
    
    func send(data: String) {
        print("TCPClientConnection - send: \(clientId)")
        let preparedData: Data = data.data(using: .utf8)!
        nwConnection.send(content: preparedData, completion: .contentProcessed( { error in
            if let error = error {
                print("TCPClientConnection - send - failure")
                self.closeConnection(reason: error)
                return
            }
            print("TCPClientConnection - send - success")
        }))
    }

    func stop() {
        print("TCPClientConnection - stop: \(clientId)")
        closeConnection(reason: nil)
    }
    
    private func closeConnection(reason: Error?) {
        print("TCPClientConnection - close connection")
        if (nwConnection.state == NWConnection.State.cancelled) {
            print("TCPClientConnection - close connection - already cancelled")
            return
        }
        self.nwConnection.cancel()
    }

    private func stateDidChange(to state: NWConnection.State) {
        switch state {
            case .setup:
                print("TCPClientConnection - stateDidChange - setup")
                break
            case .preparing:
                print("TCPClientConnection - stateDidChange - preparing")
                break
            case .waiting(let error):
                print("TCPClientConnection - stateDidChange - waiting - \(error)")
                break
            case .ready:
                print("TCPClientConnection - stateDidChange - ready")
                handleLifecycleEvent(eventName: TCPClientEventName.Ready)
                break
            case .failed(let error):
                print("TCPClientConnection - stateDidChange - failed - \(error)")
//                closeConnection(reason: error)
                break
            case .cancelled:
                print("TCPClientConnection - stateDidChange - cancelled")
                handleLifecycleEvent(eventName: TCPClientEventName.Stopped)
                break
            default:
                break
        }
    }

    private func setupReceive() {
        nwConnection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                print("TCPClientConnection - did receive data")
                self.handleDataReceived(data: data)
            }
            if isComplete {
                print("TCPClientConnection - is complete")
                self.closeConnection(reason: nil)
            } else if let error = error {
                print("TCPClientConnection - error when receiving data \n\treason: \(error)")
                self.closeConnection(reason: error)
            } else {
                self.setupReceive()
            }
        }
    }

    private func handleLifecycleEvent(eventName: String, error: Error? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "clientId", value: clientId)
        if (error != nil) {
            event.putString(key: "error", value: error.debugDescription)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleDataReceived(data: Data) {
        let parsedData: String = String(decoding: data, as: UTF8.self)
        let event: JSEvent = JSEvent(name: TCPClientEventName.DataReceived)
        event.putString(key: "clientId", value: clientId)
        event.putString(key: "data", value: parsedData)
        eventEmitter.emitEvent(event: event)
    }
}
