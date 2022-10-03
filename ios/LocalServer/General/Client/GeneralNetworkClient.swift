//
//  GeneralNetworkClient.swift
//  LocalServer
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class GeneralNetworkClient {

    private let delegate: ClientDelegateProtocol
    private let reader: NewLineBufferedReader = NewLineBufferedReader()
    private var wasReady: Bool = false
    private var onStartSucceeded: (() -> ())? = nil
    private var onStartFailed: ((_ reason: String) -> ())? = nil
    private var lastReasonToStop: String? = nil
    
    let id: String
    let nwConnection: NWConnection
    let queue: DispatchQueue
    
    let host: NWEndpoint.Host
    let port: NWEndpoint.Port
    
    init(id: String, host: String, port: UInt16, params: NWParameters, delegate: ClientDelegateProtocol) {
        self.delegate = delegate
        self.id = id
        self.host = NWEndpoint.Host(host)
        self.port = NWEndpoint.Port(rawValue: port)!
        let nwConnection = NWConnection(host: self.host, port: self.port, using: params)
        self.nwConnection = nwConnection
        self.queue = DispatchQueue(label: "com.react-native-local-server.client." + id)
    }

    func start(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        print("GeneralNetworkClient - start: \(id)")
        onStartSucceeded = onSuccess
        onStartFailed = onFailure
        nwConnection.stateUpdateHandler = stateDidChange(to:)
        nwConnection.start(queue: self.queue)
    }
    
    func send(data: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        print("GeneralNetworkClient - send: \(id)")
        let preparedMessage = data + "\r\n"
        let preparedData: Data = preparedMessage.data(using: .utf8)!
        nwConnection.send(content: preparedData, completion: .contentProcessed( { error in
            if let error = error {
                print("GeneralNetworkClient - send - failure")
                onFailure(error.debugDescription)
                return
            }
            onSuccess()
            print("GeneralNetworkClient - send - success")
        }))
    }

    func stop(reason: String?) {
        print("GeneralNetworkClient - stop: \(id)")
        lastReasonToStop = reason
        closeConnection(reason: reason)
    }
    
    private func setupReceive() {
        nwConnection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                self.reader.appendData(data: data)
                while let readyData: String = self.reader.readData() {
                    self.delegate.handleDataReceived(clientId: self.id, data: readyData)
                }
            }
            if isComplete {
                print("GeneralNetworkClient - is complete")
                self.delegate.handleConnectionCompleted(clientId: self.id)
            } else if let error = error {
                print("GeneralNetworkClient - error when receiving data \n\treason: \(error)")
                self.handleConnectionFailed(error: error)
            } else {
                self.setupReceive()
            }
        }
    }
    
    private func closeConnection(reason: String?) {
        print("GeneralNetworkClient - close connection")
        if (nwConnection.state == NWConnection.State.cancelled) {
            print("GeneralNetworkClient - close connection - already cancelled")
            return
        }
        self.nwConnection.cancel()
    }

    private func stateDidChange(to state: NWConnection.State) {
        switch state {
            case .setup:
                print("GeneralNetworkClient - stateDidChange - setup")
                break
            case .preparing:
                print("GeneralNetworkClient - stateDidChange - preparing")
                break
            case .waiting(let error):
                print("GeneralNetworkClient - stateDidChange - waiting - \(error)")
                closeConnection(reason: error.debugDescription)
                break
            case .ready:
                print("GeneralNetworkClient - stateDidChange - ready")
                wasReady = true
                setupReceive()
                self.onStartSucceeded?()
                self.delegate.handleClientReady(clientId: self.id)
                break
            case .failed(let error):
                print("GeneralNetworkClient - stateDidChange - failed - \(error)")
                handleConnectionFailed(error: error)
                break
            case .cancelled:
                print("GeneralNetworkClient - stateDidChange - cancelled")
                handleConnectionCancelled()
                break
            default:
                break
        }
    }
    
    private func handleConnectionFailed(error: NWError) {
        self.delegate.handleClientStopped(clientId: id, reason: lastReasonToStop ?? error.debugDescription)
    }
    
    private func handleConnectionCancelled() {
        if (!wasReady) {
            self.onStartFailed?(lastReasonToStop ?? "cancelled")
            return
        }
        self.delegate.handleClientStopped(clientId: id, reason: lastReasonToStop ?? "cancelled")
    }
}
