//
//  LocalMessagingClient.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//
import Foundation

@objc(LocalMessagingClient)
class LocalMessagingClient: NSObject {
    
    private var clients: [String: Client] = [:]
    
    @objc(createClient:withHost:withPort:withResolver:withRejecter:)
    func createClient(id: String, host: String, port: UInt16, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("LocalMessagingClient - createClient - started")
        if (clients[id] != nil) {
            reject("client.already-exists", "Client with this id already exists", nil)
        }
        let client: Client = Client(id: id, host: host, port: port)
        clients[id] = client
        client.start()
        resolve(true)
    }
    
    @objc(stopClient:withResolver:withRejecter:)
    func stopClient(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("LocalMessagingClient - stopClient - started")
        if let client: Client = clients[id] {
            client.stop()
            clients.removeValue(forKey: id)
            resolve(true)
        } else {
            reject("client.not-exists", "Client with this id does not exist", nil)
        }
    }
    
    @objc(send:withMessage:withResolver:withRejecter:)
    func send(clientId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("LocalMessagingClient - stopClient - started")
        if let client: Client = clients[clientId] {
            client.send(message: message)
            resolve(true)
        } else {
            reject("client.not-exists", "Client with this id does not exist", nil)
        }
    }
    
}
