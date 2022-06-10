//
//  Client.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class Client {
    let id: String
    let connection: ClientConnection
    let host: NWEndpoint.Host
    let port: NWEndpoint.Port

    init(id: String, host: String, port: UInt16) {
        self.id = id
        // TODO think about moving creating NWConnection to client
        self.host = NWEndpoint.Host(host)
        self.port = NWEndpoint.Port(rawValue: port)!
        let nwConnection = NWConnection(host: self.host, port: self.port, using: .tcp)
        connection = ClientConnection(clientId: id, nwConnection: nwConnection)
    }

    func start() {
        print("Client - start - \(host) \(port)")
        connection.didStopCallback = didStopCallback(error:)
        connection.didRecieveDataCallback = didRecieveDataCallback(clientId:data:)
        connection.start()
    }

    func stop() {
        print("Client - stop")
        connection.stop()
    }

    func send(message: String) {
        let preparedMessage = message + "\r\n"
        print("Client - send \(preparedMessage)")
        connection.send(data: preparedMessage.data(using: .utf8)!)
    }
    
    func didStopCallback(error: Error?) {
        print("Client - did stop")
        // TODO
    }
    
    func didRecieveDataCallback(clientId: String, data: Data) {
        let message: String = String(data: data, encoding: .utf8)!
        print("Client - received data")
        print("\tclientId: \(clientId)")
        print("\tdata: \(message)")
    }
}
