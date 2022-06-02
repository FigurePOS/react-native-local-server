//
//  Server.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class Server {
    let id: String
    let port: NWEndpoint.Port
    let listener: NWListener
    let queue: DispatchQueue
    
    private var connectionsByID: [String: ServerConnection] = [:]
    
    init(id: String, port: UInt16) {
        queue = DispatchQueue(label: "com.react-native-local-messaging.server.\(id)")
        self.id = id
        self.port = NWEndpoint.Port(rawValue: port)!
        listener = try! NWListener(using: .tcp, on: self.port)
    }
    
    func start() throws {
        print("Server - start")
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = didAccept(nwConnection:)
        listener.start(queue: self.queue)
    }
    
    func stop() {
        self.listener.stateUpdateHandler = nil
        self.listener.newConnectionHandler = nil
        self.listener.cancel()
        for connection in self.connectionsByID.values {
            connection.didStopCallback = nil
            connection.stop()
        }
        self.connectionsByID.removeAll()
    }
    
    func send(connectionId: String, message: String) {
        print("Server - send")
        print("\tconnection: \(connectionId)")
        print("\tmessage: \(message)")
        if let connection = connectionsByID[connectionId] {
            connection.send(data: (message.data(using: .utf8))!)
        } else {
            // TODO handle somehow
            print("Server - send - no connection")
        }
    }
    
    func broadcast(message: String) {
        print("Server - broadcas message: \(message)")
        for connection in connectionsByID.values {
            self.send(connectionId: connection.id, message: message)
        }
    }
    
    private func stateDidChange(to newState: NWListener.State) {
       switch newState {
       case .ready:
           print("Server ready.")
           break
       case .failed(let error):
           print("Server failure, error: \(error.localizedDescription)")
           break
       default:
           print("Server stateDidChange - unknown state")
           break
       }
    }
    
    private func didAccept(nwConnection: NWConnection) {
        let connection = ServerConnection(nwConnection: nwConnection)
        self.connectionsByID[connection.id] = connection
        connection.didStopCallback = { _ in
            self.connectionDidStop(connection)
        }
        connection.start()
        print("server did open connection \(connection.id)")
    }

    private func connectionDidStop(_ connection: ServerConnection) {
        self.connectionsByID.removeValue(forKey: connection.id)
        print("server did close connection \(connection.id)")
    }

}
