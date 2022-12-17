//
//  UDPServerModule.swift
//  LocalServer
//
//  Created by David Lang on 25.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
@objc(UDPServerModule)
class UDPServerModule: RCTEventEmitter {

    private var eventNames: [String]! = UDPServerEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()
    private var manager: UDPServerManager
    
    override init() {
        manager = UDPServerManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createServer:withPort:withNumberOfDroppedBytesFromMsgStart:withResolver:withRejecter:)
    func createServer(id: String, port: UInt16, numberOfDroppedBytesFromMsgStart: UInt16, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("udp.server.error", reason, nil)
            }
            try manager.createServer(id: id, port: port, numberOfDroppedBytesFromMsgStart: numberOfDroppedBytesFromMsgStart, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("udp.server.already-exists", "Server with this id already exists", nil)
        } catch {
            reject("udp.server.error", "Failed to create server", error)
        }
    }

    @objc(stopServer:withReason:withResolver:withRejecter:)
    func stopServer(id: String, reason: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.stopServer(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("udp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("udp.server.error", "Failed to stop server", error)
        }
    }

    @objc(send:withPort:withMessage:withResolver:withRejecter:)
    func send(host: String, port: UInt16, message: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String?) in
                reject("udp.server.error", reason ?? "UNKNOWN REASON", nil)
            }
            try manager.send(host: host, port: port, message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch {
            reject("udp.server.error", "Failed to send", error)
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
