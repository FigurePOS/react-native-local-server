//
//  TCPClientManager.swift
//  LocalServer
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation


class TCPClientManager {

    private let eventEmitter: EventEmitterWrapper
    private var clients: [String: TCPClient] = [:]
    
    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }
    
    func createClient(id: String, host: String, port: UInt16) throws {
        print("TCPClientModule - createClient - started")
        if (clients[id] != nil) {
            throw LocalServerError.ClientDoesAlreadyExist
        }
        let client: TCPClient = TCPClient(id: id, host: host, port: port, eventEmitter: eventEmitter)
        clients[id] = client
        client.setOnClosedCallback(callback: onConnectionClosed(clientId:))
        client.start()
    }

    func stopClient(id: String) throws {
        print("TCPClientModule - stopClient - started")
        guard let client: TCPClient = clients[id] else  {
            throw LocalServerError.ClientDoesNotExist
        }
        client.stop()
        clients.removeValue(forKey: id)
    }

    func send(clientId: String, message: String) throws {
        print("TCPClientModule - send - started")
        guard let client: TCPClient = clients[clientId] else  {
            throw LocalServerError.ClientDoesNotExist
        }
        client.send(message: message)
    }
    
    func onConnectionClosed(clientId: String) -> Void {
        clients.removeValue(forKey: clientId)
    }

    
    func invalidate() {
        print("TCPClientModule - invalidate - \(clients.count) clients")
        for (_, client) in clients {
            client.stop()
        }
        clients.removeAll()
    }
}
