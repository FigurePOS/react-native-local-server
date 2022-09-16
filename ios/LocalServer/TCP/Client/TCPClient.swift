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
    
    private let eventEmitter: EventEmitterWrapper
    private let id: String
    private let connection: TCPClientConnection
    
    private var lastReasonToStop: String? = nil

    var onStartSucceeded: (() -> ())? = nil
    var onStartFailed: ((_ reason: String) -> ())? = nil
    var onFinished: ((_ clientId: String) -> ())? = nil

    init(id: String, host: String, port: UInt16, eventEmitter: EventEmitterWrapper) {
        self.id = id
        self.eventEmitter = eventEmitter
        connection = TCPClientConnection(clientId: id, host: host, port: port)
        connection.onDataReceived = handleDataReceived(data:)
    }

    func start() {
        print("TCPClient - start: \(id) on \(connection.host):\(connection.port)")
        connection.start()
        connection.onStartSucceeded = handleConnectionStarted
        connection.onStartFailed = handleConnectionFailedToStart(reason:)
        connection.onClosed = handleConnectionClosed(reason:)
    }

    func stop(reason: String) {
        print("TCPClient - stop: \(id)")
        lastReasonToStop = reason
        connection.stop()
    }

    func send(message: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        let preparedMessage = message + "\r\n"
        print("TCPClient - send \(preparedMessage)")
        connection.send(data: preparedMessage, onSuccess: onSuccess, onFailure: onFailure)
    }
    
    private func handleConnectionStarted() {
        connection.onStartSucceeded = nil
        connection.onStartFailed = nil
        self.onStartSucceeded?()
        handleLifecycleEvent(eventName: TCPClientEventName.Ready, reason: nil)
    }
    
    private func handleConnectionFailedToStart(reason: String) {
        connection.onStartSucceeded = nil
        connection.onStartFailed = nil
        self.onStartFailed?(reason)
    }
    
    private func handleConnectionClosed(reason: String) {
        // TODO should we clean some callbacks?
        self.onFinished?(id)
        let reasonToStop: String? = lastReasonToStop != nil ? lastReasonToStop : reason
        handleLifecycleEvent(eventName: TCPClientEventName.Stopped, reason: reasonToStop)
    }
    
    private func handleLifecycleEvent(eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "clientId", value: id)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleDataReceived(data: String) {
        let event: JSEvent = JSEvent(name: TCPClientEventName.DataReceived)
        event.putString(key: "clientId", value: id)
        event.putString(key: "data", value: data)
        eventEmitter.emitEvent(event: event)
    }
}
