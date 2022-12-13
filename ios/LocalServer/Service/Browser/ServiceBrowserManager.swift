//
//  ServiceBrowserManager.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
class ServiceBrowserManager: ServiceBrowserDelegateProtocol {

    private let eventEmitter: EventEmitterWrapper
    private var browsers: [String: ServiceBrowser] = [:]

    init(eventEmitter: EventEmitterWrapper) {
        self.eventEmitter = eventEmitter;
    }

    
    func createBrowser(id: String, discoveryGroup: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("ServiceBrowserManager - createBrowser - started")
        if let _: ServiceBrowser = browsers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        
        let browser: ServiceBrowser = ServiceBrowser.init(id: id, discoveryGroup: discoveryGroup)
        browsers[id] = browser
//        let onStartSucceeded = {
//            onSuccess()
//        }
//        let onStartFailed = { (_ reason: String) in
//            onFailure(reason)
//        }
        try browser.start(delegate: self)
    }

    func stopBrowser(id: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        print("ServiceBrowserManager - stopBrowser - started")
    }
    
    func invalidate() {
        print("ServiceBrowserManager - invalidate - \(browsers.count) browsers")
    }
    
    private func handleLifecycleEvent(serverId: String, eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "browserId", value: serverId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleConnectionLifecycleEvent(serverId: String, connectionId: String, eventName: String, reason: String? = nil) {
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "browserId", value: serverId)
        event.putString(key: "connectionId", value: connectionId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }
    
    // MARK: - ServiceBrowserDelegateProtocol
    func handleBrowserReady(browserId: String) {
    }
    
    func handleBrowserStopped(browserId: String) {
    
    }
    
    func handleServiceFound(browserId: String, service: ServiceBrowserResult) {
    
    }
    
    func handleServiceLost(browserId: String, service: ServiceBrowserResult) {
    
    }
}
