//
//  UDPOneTimeClientManager.swift
//  LocalServer
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
class UDPOneTimeClientManager: ClientDelegateProtocol {
    
    private var clients: [String: GeneralNetworkClient] = [:]
    private var scheduledMessages: [String: String] = [:]
    private var callbacks: [String: CallbackHolder] = [:]
    
    func send(host: String, port: UInt16, message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String?) -> ()) throws {
        let clientId = UUID().uuidString.lowercased()
        let params: NWParameters = .udp
        params.allowFastOpen = true
        let client = GeneralNetworkClient(id: clientId, host: host, port: port, params: params, delegate: self)
        clients[clientId] = client
        scheduledMessages[clientId] = message
        callbacks[clientId] = CallbackHolder(onSuccess: onSuccess, onFailure: onFailure)
        let onFailure = { (_ reason: String?) in
            self.handleFailure(clientId: clientId, reason: reason)
        }
        client.start(onSuccess: {}, onFailure: onFailure)
    }
    
    func handleFailure(clientId: String, reason: String?) {
        RNLSLog("UDPOneTimeClientManager - failure handler \(clientId)")
        if let callback = self.callbacks[clientId] {
            callback.onFailure(reason)
        }
        cleanUpClientData(clientId: clientId)
    }
    
    func cleanUpClientData(clientId: String) {
        RNLSLog("UDPOneTimeClientManager - client clean up \(clientId)")
        clients.removeValue(forKey: clientId)
        scheduledMessages.removeValue(forKey: clientId)
        callbacks.removeValue(forKey: clientId)
    }
    
    //MARK: - ClientDelegateProtocol
    func handleClientReady(clientId: String) {
        RNLSLog("UDPOneTimeClientManager - client ready \(clientId)")
        guard let client = clients[clientId] else {
            return;
        }
        guard let message = scheduledMessages[clientId] else {
            client.stop(reason: "No message scheduled")
            return;
        }
        let onSuccess = {
            if let callback = self.callbacks[clientId] {
                callback.onSuccess()
                self.callbacks.removeValue(forKey: clientId)
            }
            client.stop(reason: "Data sent succesfully")
        }
        let onFailure = { (_ reason: String?) in
            self.handleFailure(clientId: clientId, reason: reason)
        }
        client.send(data: message, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    func handleConnectionCompleted(clientId: String) {
        guard let client = clients[clientId] else {
            return;
        }
        client.stop(reason: StopReasonEnum.ClosedByPeer)
    }
    
    func handleClientStopped(clientId: String, reason: String?) {
        RNLSLog("UDPOneTimeClientManager - client stopped \(clientId)")
        if let callback = callbacks[clientId] {
            callback.onFailure(reason);
        }
        cleanUpClientData(clientId: clientId)
    }
    
    func handleDataReceived(clientId: String, data: String) {
        RNLSLog("UDPOneTimeClientManager - data recieved \(clientId)")
        // this should never happen because UDP is not bidirectional
    }
}
