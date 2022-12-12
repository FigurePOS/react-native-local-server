//
//  ServiceBrowserModule.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation


@available(iOS 12.0, *)
@objc(ServiceBrowserModule)
class ServiceBrowserModule: RCTEventEmitter {

    private var eventNames: [String]! = TCPServerEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()
    
    override init() {
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createBrowser:withDiscoveryGroup:withResolver:withRejecter:)
    func createBrowser(id: String, discoveryGroup: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(true)
//        do {
//            let onSuccess = {
//                resolve(true)
//            }
//            let onFailure = { (reason: String) in
//                reject("tcp.server.error", reason, nil)
//            }
//            try manager.createServer(id: id, port: port, discoveryGroup: discoveryGroup, discoveryName: discoveryName, onSuccess: onSuccess, onFailure: onFailure)
//        } catch LocalServerError.ServerDoesAlreadyExist {
//            reject("tcp.server.already-exists", "Server with this id already exists", nil)
//        } catch {
//            reject("tcp.server.error", "Failed to create server", error)
//        }
    }

    @objc(stopBrowser:withResolver:withRejecter:)
    func stopBrowser(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(true)
//        do {
//            try manager.stopServer(id: id, reason: reason)
//            resolve(true)
//        } catch LocalServerError.ServerDoesNotExist {
//            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
//        } catch {
//            reject("tcp.server.error", "Failed to stop server", error)
//        }
    }

    
    override func supportedEvents() -> [String]! {
        return []
//        return self.eventNames
    }
    
    override func invalidate() {
        // TODO
        super.invalidate()
    }
}
