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

    private let reader: NewLineBufferedReader = NewLineBufferedReader()
    private let eventEmitter: EventEmitterWrapper
    
    var onClosedCallback: ((String) -> ())? = nil
    var lastReasonToStop: String? = nil

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
                self.closeConnection(reason: error.debugDescription)
                return
            }
            print("TCPClientConnection - send - success")
        }))
    }

    func stop(reason: String) {
        print("TCPClientConnection - stop: \(clientId)")
        lastReasonToStop = reason
        closeConnection(reason: reason)
    }
    
    private func closeConnection(reason: String? = nil) {
        print("TCPClientConnection - close connection")
        lastReasonToStop = reason
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
                closeConnection(reason: error.debugDescription)
                break
            case .ready:
                print("TCPClientConnection - stateDidChange - ready")
                handleLifecycleEvent(eventName: TCPClientEventName.Ready)
                break
            case .failed(let error):
                print("TCPClientConnection - stateDidChange - failed - \(error)")
                onClosed(reason: error.debugDescription)
                break
            case .cancelled:
                print("TCPClientConnection - stateDidChange - cancelled")
                onClosed(reason: nil)
                break
            default:
                break
        }
    }
    
    private func onClosed(reason: String?) {
        let reasonToStop: String? = lastReasonToStop != nil ? lastReasonToStop : reason
        handleLifecycleEvent(eventName: TCPClientEventName.Stopped, reason: reasonToStop)
        onClosedCallback?(clientId)
    }

    private func setupReceive() {
        nwConnection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                self.reader.appendData(data: data)
                while let readyData: String = self.reader.readData() {
                    self.handleDataReceived(data: readyData)
                }
            }
            if isComplete {
                print("TCPClientConnection - is complete")
                self.onClosed(reason: StopReasonEnum.ClosedByPeer)
            } else if let error = error {
                print("TCPClientConnection - error when receiving data \n\treason: \(error)")
                self.onClosed(reason: error.debugDescription)
            } else {
                self.setupReceive()
            }
        }
    }

    private func handleLifecycleEvent(eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "clientId", value: clientId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleDataReceived(data: String) {
        let event: JSEvent = JSEvent(name: TCPClientEventName.DataReceived)
        event.putString(key: "clientId", value: clientId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
