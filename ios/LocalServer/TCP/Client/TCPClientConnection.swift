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
    private var wasReady: Bool = false
    private var lastReasonToStop: String? = nil

    var onStartSucceeded: (() -> ())? = nil
    var onStartFailed: ((_ reason: String) -> ())? = nil
    
    var onDataReceived: ((_ data: String) -> ())? = nil
    var onDataSent: ((_ success: Bool) -> ())? = nil
    var onClosed: ((_ reason: String) -> ())? = nil
    
    let clientId: String
    let nwConnection: NWConnection
    let queue: DispatchQueue
    
    let host: NWEndpoint.Host
    let port: NWEndpoint.Port


    init(clientId: String, host: String, port: UInt16) {
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
        nwConnection.start(queue: self.queue)
    }
    
    func send(data: String) {
        print("TCPClientConnection - send: \(clientId)")
        let preparedData: Data = data.data(using: .utf8)!
        nwConnection.send(content: preparedData, completion: .contentProcessed( { error in
            // TODO
//            if let error = error {
//                print("TCPClientConnection - send - failure")
//                return
//            }
            print("TCPClientConnection - send - success")
        }))
    }

    func stop() {
        print("TCPClientConnection - stop: \(clientId)")
        closeConnection(reason: nil)
    }
    
    private func setupReceive() {
        nwConnection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                self.reader.appendData(data: data)
                while let readyData: String = self.reader.readData() {
                    self.onDataReceived?(readyData)
                }
            }
            if isComplete {
                print("TCPClientConnection - is complete")
                self.onClosed?(StopReasonEnum.ClosedByPeer)
            } else if let error = error {
                print("TCPClientConnection - error when receiving data \n\treason: \(error)")
                self.onClosed?(error.debugDescription)
            } else {
                self.setupReceive()
            }
        }
    }
    
    private func closeConnection(reason: String?) {
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
                wasReady = true
                setupReceive()
                self.onStartSucceeded?()
                break
            case .failed(let error):
                print("TCPClientConnection - stateDidChange - failed - \(error)")
                handleConnectionFailed(error: error)
                break
            case .cancelled:
                print("TCPClientConnection - stateDidChange - cancelled")
                handleConnectionCancelled()
                break
            default:
                break
        }
    }
    
    private func handleConnectionFailed(error: NWError) {
        self.onClosed?(error.debugDescription)
    }
    
    private func handleConnectionCancelled() {
        if (!wasReady) {
            self.onStartFailed?(lastReasonToStop ?? "cancelled")
            return
        }
        self.onClosed?(lastReasonToStop ?? "cancelled")
    }
}
