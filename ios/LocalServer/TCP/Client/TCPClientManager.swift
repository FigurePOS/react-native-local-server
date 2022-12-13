//
//  TCPClientManager.swift
//  LocalServer
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
class TCPClientManager: ClientDelegateProtocol {
    
    private let eventEmitter: EventEmitterWrapper
    private var clients: [String: GeneralNetworkClient] = [:]
    
    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }
    
    func createClient(id: String, host: String, port: UInt16, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("TCPClientModule - createClient - started")
        if (clients[id] != nil) {
            throw LocalServerError.ClientDoesAlreadyExist
        }
        let client: GeneralNetworkClient = GeneralNetworkClient(id: id, host: host, port: port, params: .tcp, delegate: self)
        let onStartSucceeded = {
            self.clients[id] = client
            onSuccess()
        }
        let onStartFailed = { (_ reason: String) in
            onFailure(reason)
        }
        client.start(onSuccess: onStartSucceeded, onFailure: onStartFailed)
    }

    func stopClient(id: String, reason: String) throws {
        print("TCPClientModule - stopClient - started")
        guard let client: GeneralNetworkClient = clients[id] else  {
            throw LocalServerError.ClientDoesNotExist
        }
        client.stop(reason: reason)
        clients.removeValue(forKey: id)
    }

    func send(clientId: String, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("TCPClientModule - send - started")
        guard let client: GeneralNetworkClient = clients[clientId] else  {
            throw LocalServerError.ClientDoesNotExist
        }
        client.send(data: message, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func getClientIds() -> [String] {
        var keys: [String] = []
        for k in clients.keys {
            keys.append(k)
        }
        return keys
    }
    
    func onConnectionClosed(clientId: String) -> Void {
        clients.removeValue(forKey: clientId)
    }
    
    func invalidate() {
        print("TCPClientModule - invalidate - \(clients.count) clients")
        for (_, client) in clients {
            client.stop(reason: StopReasonEnum.Invalidation)
        }
        clients.removeAll()
    }
    
    private func handleLifecycleEvent(clientId: String, eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "clientId", value: clientId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    //MARK: - ClientDelegateProtocol
    func handleClientReady(clientId: String) {
        handleLifecycleEvent(clientId: clientId, eventName: TCPClientEventName.Ready)
    }
    
    func handleClientStopped(clientId: String, reason: String?) {
        clients.removeValue(forKey: clientId)
        handleLifecycleEvent(clientId: clientId, eventName: TCPClientEventName.Stopped, reason: reason)
    }
    
    func handleConnectionCompleted(clientId: String) {
        guard let client: GeneralNetworkClient = self.clients[clientId] else {
            return
        }
        client.stop(reason: StopReasonEnum.ClosedByPeer)
    }

    func handleDataReceived(clientId: String, data: String) {
        print("TCPClientModule - data received: \(data)")
        let event: JSEvent = JSEvent(name: TCPClientEventName.DataReceived)
        event.putString(key: "clientId", value: clientId)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
