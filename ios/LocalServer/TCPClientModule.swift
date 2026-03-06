//
//  TCPClientModuleImpl.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
@objcMembers
class TCPClientModuleImpl: NSObject {

    private let eventEmitter: EventEmitterWrapper
    private var manager: TCPClientManager

    init(onEvent: @escaping (String, [String: Any]) -> Void) {
        eventEmitter = EventEmitterWrapper()
        manager = TCPClientManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventCallback { event in
            onEvent(event.getName(), event.getBody())
        }
    }

    func createClient(_ id: String, host: String, port: Double, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("tcp.client.error", reason, nil) }
            try manager.createClient(id: id, host: host, port: UInt16(port), onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ClientDoesAlreadyExist {
            reject("tcp.client.already-exists", "Client with this id already exists", nil)
        } catch {
            reject("tcp.client.error", "Failed to create client", error)
        }
    }

    func createClientFromDiscovery(_ id: String, discoveryGroup: String, discoveryName: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("tcp.client.error", reason, nil) }
            try manager.createClient(id: id, discoveryGroup: discoveryGroup, discoveryName: discoveryName, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ClientDoesAlreadyExist {
            reject("tcp.client.already-exists", "Client with this id already exists", nil)
        } catch {
            reject("tcp.client.error", "Failed to create client", error)
        }
    }

    func stopClient(_ id: String, reason: String, resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        do {
            try manager.stopClient(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ClientDoesNotExist {
            reject("tcp.client.not-exists", "Client with this id does not exist", nil)
        } catch {
            reject("tcp.client.error", "Failed to stop client", error)
        }
    }

    func send(_ clientId: String, message: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("tcp.client.error", reason, nil) }
            try manager.send(clientId: clientId, message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ClientDoesNotExist {
            reject("tcp.client.not-exists", "Client with this id does not exist", nil)
        } catch {
            reject("tcp.client.error", "Failed to send data to client", error)
        }
    }

    func invalidate() {
        manager.invalidate()
    }
}
