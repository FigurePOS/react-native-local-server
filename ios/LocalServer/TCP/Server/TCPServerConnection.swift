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
    private let reader: NewLineBufferedReader = NewLineBufferedReader()
    private let queue: DispatchQueue

    //The TCP maximum package size is 64K 65536
    private let MTU = 65536
    private let connection: NWConnection
    let id: String
    private let serverId: String
    
    private var lastReasonToStop: String? = nil

    var onReady: ((_ connectionId: String) -> ())? = nil
    var onDataReceived: ((_ connectionId: String, _ data: String) -> ())? = nil
    var onClosed: ((_ connectionId: String, _ reason: String) -> ())? = nil

    init(serverId: String, nwConnection: NWConnection) {
        self.serverId = serverId
        connection = nwConnection
        id = UUID().uuidString.lowercased()
        self.queue = DispatchQueue(label: "com.react-native-messaging.server.connection" + id)
    }

    func start() {
        print("TCPServerConnection - start \(id)")
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
            print("connection \(self.id) did send, data: \(data as NSData)")
        }))
    }

    func stop(reason: String) {
        print("connection \(id) will stop")
        lastReasonToStop = reason
        closeConnection()
    }
    
    private func closeConnection() {
        connection.cancel()
    }
    
    private func stateDidChange(to state: NWConnection.State) {
        let prefix = "TCPServerConnection - stateDidChange \(id)\n"
        switch state {
            case .setup:
                print("\(prefix)\tstate: setup")
                break
            case .waiting(let error):
                print("\(prefix)\tstate: waiting \(error.debugDescription)")
                closeConnection()
                break
            case .preparing:
                print("\(prefix)\tstate: preparing")
                break
            case .ready:
                print("\(prefix)\tstate: ready")
                setupReceive()
                self.onReady?(self.id)
                break
            case .failed(let error):
                print("\(prefix)\tstate: failure, error: \(error.debugDescription)")
                self.handleConnectionFailed(error: error)
                break
            case .cancelled:
                print("\(prefix)\tstate: cancelled")
                self.handleConnectionCancelled()
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
                while let readData: String = self.reader.readData() {
                    self.onDataReceived?(self.id, readData)
                }
            }
            if isComplete {
                print("TCPServerConnection - is complete")
                self.onClosed?(self.id, StopReasonEnum.ClosedByPeer)
            } else if let error = error {
                print("TCPServerConnection - error when receiving data \n\treason: \(error)")
            } else {
                self.setupReceive()
            }
        }
    }
    
    private func handleConnectionFailed(error: NWError) {
        self.onClosed?(id, error.debugDescription)
    }
    
    private func handleConnectionCancelled() {
        self.onClosed?(id, lastReasonToStop ?? "cancelled")
    }
}
