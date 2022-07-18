//
//  LocalMessagingClient.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//
import Foundation

@objc(TCPClientModule)
class TCPClientModule: RCTEventEmitter {

    private let eventNames: [String]! = TCPClientEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()
    
    private var clients: [String: TCPClient] = [:]
    
    override init() {
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc(createClient:withHost:withPort:withResolver:withRejecter:)
    func createClient(id: String, host: String, port: UInt16, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPClientModule - createClient - started")
        if (clients[id] != nil) {
            reject("client.already-exists", "Client with this id already exists", nil)
            return
        }
        let client: TCPClient = TCPClient(id: id, host: host, port: port, eventEmitter: eventEmitter)
        clients[id] = client
        client.start()
        resolve(true)
    }

    @objc(stopClient:withResolver:withRejecter:)
    func stopClient(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPClientModule - stopClient - started")
        if let client: TCPClient = clients[id] {
            client.stop()
            clients.removeValue(forKey: id)
            resolve(true)
        } else {
            reject("client.not-exists", "Client with this id does not exist", nil)
        }
    }

    @objc(send:withMessage:withResolver:withRejecter:)
    func send(clientId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPClientModule - send - started")
        if let client: TCPClient = clients[clientId] {
            client.send(message: message)
            resolve(true)
        } else {
            reject("client.not-exists", "Client with this id does not exist", nil)
        }
    }

    override func supportedEvents() -> [String]! {
        return self.eventNames
    }
}
