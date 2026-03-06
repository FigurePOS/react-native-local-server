//
//  UDPServerModuleImpl.swift
//  LocalServer
//
//  Created by David Lang on 25.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
@objcMembers
class UDPServerModuleImpl: NSObject {

    private let eventEmitter: EventEmitterWrapper
    private var manager: UDPServerManager

    init(onEvent: @escaping (String, [String: Any]) -> Void) {
        eventEmitter = EventEmitterWrapper()
        manager = UDPServerManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventCallback { event in
            onEvent(event.getName(), event.getBody())
        }
    }

    func createServer(_ id: String, port: Double, numberOfDroppedBytesFromMsgStart: Double, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("udp.server.error", reason, nil) }
            try manager.createServer(id: id, port: UInt16(port), numberOfDroppedBytesFromMsgStart: UInt16(numberOfDroppedBytesFromMsgStart), onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("udp.server.already-exists", "Server with this id already exists", nil)
        } catch {
            reject("udp.server.error", "Failed to create server", error)
        }
    }

    func stopServer(_ id: String, reason: String, resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        do {
            try manager.stopServer(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("udp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("udp.server.error", "Failed to stop server", error)
        }
    }

    func send(_ host: String, port: Double, message: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String?) in reject("udp.server.error", reason ?? "UNKNOWN REASON", nil) }
            try manager.send(host: host, port: UInt16(port), message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch {
            reject("udp.server.error", "Failed to send", error)
        }
    }

    func invalidate() {
        manager.invalidate()
    }
}
