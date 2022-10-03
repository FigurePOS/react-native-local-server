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
    private var manager: TCPClientManager
        
    override init() {
        manager = TCPClientManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createClient:withHost:withPort:withResolver:withRejecter:)
    func createClient(id: String, host: String, port: UInt16, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("tcp.client.error", reason, nil)
            }
            try manager.createClient(id: id, host: host, port: port, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ClientDoesAlreadyExist {
            reject("tcp.client.already-exists", "Client with this id already exists", nil)
        } catch {
            reject("tcp.client.error", "Failed to create client", error)
        }
    }

    @objc(stopClient:withReason:withResolver:withRejecter:)
    func stopClient(id: String, reason: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.stopClient(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ClientDoesNotExist {
            reject("tcp.client.not-exists", "Client with this id does not exist", nil)
        } catch {
            reject("tcp.client.error", "Failed to stop client", error)
        }
    }

    @objc(send:withMessage:withResolver:withRejecter:)
    func send(clientId: String, message: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("tcp.client.error", reason, nil)
            }
            try manager.send(clientId: clientId, message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ClientDoesNotExist {
            reject("tcp.client.not-exists", "Client with this id does not exist", nil)
        } catch {
            reject("tcp.client.error", "Failed to send data to client", error)
        }
    }

    override func supportedEvents() -> [String]! {
        return self.eventNames
    }
    
    override func invalidate() {
        manager.invalidate()
        super.invalidate()
    }
}
