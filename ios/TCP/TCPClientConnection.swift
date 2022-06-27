//
//  TCPClientConnection.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

import Foundation
import Network

@available(iOS 12.0, *)
class TCPClientConnection {

    let clientId: String
    let nwConnection: NWConnection
    let queue: DispatchQueue
    
    var didStopCallback: ((Error?) -> Void)? = nil
    var didRecieveDataCallback: ((String, Data) -> Void)? = nil

    init(clientId: String, nwConnection: NWConnection) {
        self.clientId = clientId
        self.nwConnection = nwConnection
        self.queue = DispatchQueue(label: "com.react-native-messaging.client." + clientId)
    }

    func start() {
        print("TCPClientConnection - start")
        nwConnection.stateUpdateHandler = stateDidChange(to:)
        setupReceive()
        nwConnection.start(queue: self.queue)
    }
    
    func send(data: Data) {
        print("TCPClientConnection - send")
        nwConnection.send(content: data, completion: .contentProcessed( { error in
            if let error = error {
                print("TCPClientConnection - send - failure")
                self.connectionDidFail(error: error)
                return
            }
            print("TCPClientConnection - send - success")
        }))
    }

    func stop() {
        print("TCPClientConnection - stop")
        stop(error: nil)
    }


    private func stateDidChange(to state: NWConnection.State) {
        switch state {
        case .waiting(let error):
            print("TCPClientConnection - stateDidChange - waiting")
            connectionDidFail(error: error)
            break
        case .ready:
            print("TCPClientConnection - stateDidChange - ready")
            break
        case .failed(let error):
            print("TCPClientConnection - stateDidChange - failed")
            connectionDidFail(error: error)
            break
        default:
            break
        }
    }

    private func setupReceive() {
        nwConnection.receive(minimumIncompleteLength: 1, maximumLength: 65536) { (data, _, isComplete, error) in
            if let data = data, !data.isEmpty {
                print("TCPClientConnection - did receive data")
                if let didRecieveDataCallback = self.didRecieveDataCallback {
                    didRecieveDataCallback(self.clientId, data)
                } else {
                    print("TCPClientConnection - did receive data - no callback")
                }
            }
            if isComplete {
                self.connectionDidEnd()
            } else if let error = error {
                self.connectionDidFail(error: error)
            } else {
                self.setupReceive()
            }
        }
    }

    private func connectionDidFail(error: Error) {
        print("client connection did fail, error: \(error)")
        self.stop(error: error)
    }

    private func connectionDidEnd() {
        print("client connection did end")
        self.stop(error: nil)
    }

    private func stop(error: Error?) {
        self.nwConnection.stateUpdateHandler = nil
        self.nwConnection.cancel()
        if let didStopCallback = self.didStopCallback {
            self.didStopCallback = nil
            didStopCallback(error)
        }
    }
}
