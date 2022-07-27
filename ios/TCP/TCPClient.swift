//
//  Client.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class TCPClient {
    let id: String
    let connection: TCPClientConnection

    init(id: String, host: String, port: UInt16, eventEmitter: EventEmitterWrapper) {
        self.id = id
        connection = TCPClientConnection(clientId: id, host: host, port: port, eventEmitter: eventEmitter)
    }

    func start() {
        print("TCPClient - start: \(id) on \(connection.host):\(connection.port)")
        connection.start()
    }

    func stop() {
        print("TCPClient - stop: \(id)")
        connection.stop()
    }

    func send(message: String) {
        let preparedMessage = message + "\r\n"
        print("TCPClient - send \(preparedMessage)")
        connection.send(data: preparedMessage)
    }
    
    func setOnClosedCallback(callback: @escaping (String) -> ()) {
        connection.onClosedCallback = callback
    }
}
