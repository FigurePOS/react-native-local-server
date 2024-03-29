//
//  GeneralNetworkServerConnection.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
class GeneralNetworkServerConnection {
    private let reader: NewLineBufferedReader = NewLineBufferedReader()
    private let delegate: ServerConnectionDelegateProtocol
    private let queue: DispatchQueue

    //The maximum package size is 64K 65536
    private let MTU = 65536
    private let connection: NWConnection
    private let numberOfDroppedBytesFromMsgStart: UInt16
    let id: String
    
    private var lastReasonToStop: String? = nil

    init(nwConnection: NWConnection, numberOfDroppedBytesFromMsgStart: UInt16, delegate: ServerConnectionDelegateProtocol) {
        self.delegate = delegate
        connection = nwConnection
        id = UUID().uuidString.lowercased()
        self.numberOfDroppedBytesFromMsgStart = numberOfDroppedBytesFromMsgStart
        self.queue = DispatchQueue(label: "com.react-native-messaging.server.connection" + id)
    }
    
    func start() {
        RNLSLog("GeneralNetworkServerConnection - start \(id)")
        connection.stateUpdateHandler = self.stateDidChange(to:)
        connection.start(queue: self.queue)
    }

    func send(data: Data, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        self.connection.send(content: data, completion: .contentProcessed( { error in
            if let error = error {
                onFailure(error.debugDescription)
                return
            }
            onSuccess()
            RNLSLog("GeneralNetworkServerConnection \(self.id) did send, data: \(data as NSData)")
        }))
    }

    func stop(reason: String) {
        RNLSLog("GeneralNetworkServerConnection \(id) will stop: \(reason)")
        lastReasonToStop = reason
        closeConnection()
    }
    
    private func closeConnection() {
        connection.cancel()
    }
    
    private func stateDidChange(to state: NWConnection.State) {
        let prefix = "GeneralNetworkServerConnection - stateDidChange \(id)\n"
        switch state {
            case .setup:
                RNLSLog("\(prefix)\tstate: setup")
                break
            case .waiting(let error):
                RNLSLog("\(prefix)\tstate: waiting \(error.debugDescription)")
                closeConnection()
                break
            case .preparing:
                RNLSLog("\(prefix)\tstate: preparing")
                break
            case .ready:
                RNLSLog("\(prefix)\tstate: ready")
                setupReceive()
                delegate.handleConnectionReady(connectionId: id)
                break
            case .failed(let error):
                RNLSLog("\(prefix)\tstate: failure, error: \(error.debugDescription)")
                self.handleConnectionFailed(error: error)
                break
            case .cancelled:
                RNLSLog("\(prefix)\tstate: cancelled")
                self.handleConnectionCancelled()
                break
            default:
                RNLSLog("\(prefix)\tstate: unknown state - \(state)")
                break
        }
    }

    private func setupReceive() {
        connection.receive(minimumIncompleteLength: 1, maximumLength: MTU) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                RNLSLog("GeneralNetworkServerConnection - received data")
                self.reader.appendData(data: data, numberOfDroppedBytesFromMsgStart: self.numberOfDroppedBytesFromMsgStart)
                while let readData: String = self.reader.readData() {
                    self.delegate.handleDataReceived(connectionId: self.id, data: readData)
                }
            }
            if isComplete {
                RNLSLog("GeneralNetworkServerConnection - is complete")
                if let lastData = self.reader.readLastData() {
                    self.delegate.handleDataReceived(connectionId: self.id, data: lastData)
                }
                self.delegate.handleConnectionCompleted(connectionId: self.id)
            } else if let error = error {
                RNLSLog("GeneralNetworkServerConnection - error when receiving data \n\treason: \(error)")
            } else {
                self.setupReceive()
            }
        }
    }
    
    private func handleConnectionFailed(error: NWError) {
        self.delegate.handleConnectionStopped(connectionId: id, reason: lastReasonToStop ?? error.debugDescription)
    }
    
    private func handleConnectionCancelled() {
        RNLSLog("GeneralNetworkServerConnection - cancelled: \(lastReasonToStop ?? "cancelled")")
        self.delegate.handleConnectionStopped(connectionId: id, reason: lastReasonToStop ?? "cancelled")
    }
}
