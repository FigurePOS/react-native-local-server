//
//  GeneralNetworkClient.swift
//  LocalServer
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
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
    
    convenience init(id: String, host: String, port: UInt16, params: NWParameters, delegate: ClientDelegateProtocol) {
        let host = NWEndpoint.Host(host)
        let port = NWEndpoint.Port(rawValue: port)!
        let endpoint = NWEndpoint.hostPort(host: host, port: port)
        self.init(id: id, endpoint: endpoint, params: params, delegate: delegate)
    }
    
    convenience init(id: String, discoveryType: String, discoveryName: String, params: NWParameters, delegate: ClientDelegateProtocol) {
        let endpoint = NWEndpoint.service(name: discoveryName, type: discoveryType, domain: "local.", interface: nil)
        self.init(id: id, endpoint: endpoint, params: params, delegate: delegate)
    }
    
    init(id: String, endpoint: NWEndpoint, params: NWParameters, delegate: ClientDelegateProtocol) {
        self.id = id
        self.delegate = delegate
        self.nwConnection = NWConnection(to: endpoint, using: params)
        self.queue = DispatchQueue(label: "com.react-native-local-server.client." + id)
    }
    
    func start(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        RNLSLog("GeneralNetworkClient - start: \(id)")
        onStartSucceeded = onSuccess
        onStartFailed = onFailure
        nwConnection.stateUpdateHandler = stateDidChange(to:)
        nwConnection.start(queue: self.queue)
    }
    
    func send(data: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        RNLSLog("GeneralNetworkClient - send: \(id)")
        let preparedMessage = data + "\r\n"
        let preparedData: Data = preparedMessage.data(using: .utf8)!
        nwConnection.send(content: preparedData, completion: .contentProcessed( { error in
            if let error = error {
                RNLSLog("GeneralNetworkClient - send - failure")
                onFailure(error.debugDescription)
                return
            }
            onSuccess()
            RNLSLog("GeneralNetworkClient - send - success")
        }))
    }

    func stop(reason: String?) {
        RNLSLog("GeneralNetworkClient - stop: \(id)")
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
                RNLSLog("GeneralNetworkClient - is complete")
                self.delegate.handleConnectionCompleted(clientId: self.id)
            } else if let error = error {
                RNLSLog("GeneralNetworkClient - error when receiving data \n\treason: \(error)")
                self.handleConnectionFailed(error: error)
            } else {
                self.setupReceive()
            }
        }
    }
    
    private func closeConnection(reason: String?) {
        RNLSLog("GeneralNetworkClient - close connection")
        if (nwConnection.state == NWConnection.State.cancelled) {
            RNLSLog("GeneralNetworkClient - close connection - already cancelled")
            return
        }
        self.nwConnection.cancel()
    }

    private func stateDidChange(to state: NWConnection.State) {
        switch state {
            case .setup:
                RNLSLog("GeneralNetworkClient - stateDidChange - setup")
                break
            case .preparing:
                RNLSLog("GeneralNetworkClient - stateDidChange - preparing")
                break
            case .waiting(let error):
                RNLSLog("GeneralNetworkClient - stateDidChange - waiting - \(error)")
                closeConnection(reason: error.debugDescription)
                break
            case .ready:
                RNLSLog("GeneralNetworkClient - stateDidChange - ready")
                wasReady = true
                setupReceive()
                self.onStartSucceeded?()
                self.delegate.handleClientReady(clientId: self.id)
                break
            case .failed(let error):
                RNLSLog("GeneralNetworkClient - stateDidChange - failed - \(error)")
                handleConnectionFailed(error: error)
                break
            case .cancelled:
                RNLSLog("GeneralNetworkClient - stateDidChange - cancelled")
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
