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
    let port: NWEndpoint.Port
    let listener: NWListener
    
    private var connectionsByID: [Int: ServerConnection] = [:]
    
    init(portArg: UInt16) {
        port = NWEndpoint.Port(rawValue: portArg)!
        listener = try! NWListener(using: .tcp, on: port)
    }
    
    func start() throws {
        print("Server - start")
        listener.stateUpdateHandler = stateDidChange(to:)
        listener.newConnectionHandler = didAccept(nwConnection:)
        listener.start(queue: .main)
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
        connection.send(data: "Welcome you are connection: \(connection.id)".data(using: .utf8)!)
        print("server did open connection \(connection.id)")
    }

    private func connectionDidStop(_ connection: ServerConnection) {
        self.connectionsByID.removeValue(forKey: connection.id)
        print("server did close connection \(connection.id)")
    }

}
