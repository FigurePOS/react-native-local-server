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
    private let reader: NewLineBufferedReader = NewLineBufferedReader()
    let queue: DispatchQueue

    //The TCP maximum package size is 64K 65536
    let MTU = 65536
    let connection: NWConnection
    let id: String
    let serverId: String
    var lastReasonToStop: String? = nil

    init(serverId: String, nwConnection: NWConnection, eventEmitter: EventEmitterWrapper) {
        self.serverId = serverId
        self.eventEmitter = eventEmitter
        connection = nwConnection
        id = UUID().uuidString.lowercased()
        self.queue = DispatchQueue(label: "com.react-native-messaging.server.connection" + id)
    }

    var didStopCallback: ((_ reason: String?) -> Void)? = nil

    func start() {
        print("TCPServerConnection - start \(id)")
        connection.stateUpdateHandler = self.stateDidChange(to:)
        setupReceive()
        connection.start(queue: self.queue)
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
                onClosed(reason: error.debugDescription)
                break
            case .cancelled:
                print("\(prefix)\tstate: cancelled")
                onClosed(reason: nil)
                break
            default:
                print("\(prefix)\tstate: unknown state - \(state)")
                break
        }
    }

    private func setupReceive() {
        connection.receive(minimumIncompleteLength: 1, maximumLength: MTU) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                self.reader.appendData(data: data)
                while let readyData: String = self.reader.readData() {
                    self.handleDataReceived(data: readyData)
                }
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

    func stop(reason: String) {
        print("connection \(id) will stop")
        closeConnection(reason: reason)
    }

    private func connectionDidFail(error: Error) {
        print("connection \(id) did fail, error: \(error)")
        closeConnection(reason: nil)
    }

    private func connectionDidEnd() {
        print("connection \(id) did end")
        closeConnection(reason: StopReasonEnum.ClosedByPeer)
    }

    private func closeConnection(reason: String?) {
        if (reason != nil) {
            lastReasonToStop = reason
        }
        connection.cancel()
    }
    
    private func onClosed(reason: String?) {
        let reasonToStop: String? = lastReasonToStop != nil ? lastReasonToStop : reason
        lastReasonToStop = nil
        handleLifecycleEvent(eventName: TCPServerEventName.ConnectionClosed, reason: reasonToStop)
        if let didStopCallback = didStopCallback {
            self.didStopCallback = nil
            didStopCallback(reasonToStop)
        }
    }
    
    private func handleLifecycleEvent(eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: id)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    private func handleDataReceived(data: String) {
        print("TCPServerConnection - did receive data")
        let event: JSEvent = JSEvent(name: TCPServerEventName.DataReceived)
        event.putString(key: "serverId", value: serverId)
        event.putString(key: "connectionId", value: id)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
