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
    private var shouldEmitEvents: Bool = true

    init(eventEmitter: EventEmitterWrapper) {
        self.shouldEmitEvents = true
        self.eventEmitter = eventEmitter;
    }


    func createBrowser(id: String, discoveryGroup: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("ServiceBrowserManager [\(id)] - createBrowser - started")
        if let _: ServiceBrowser = browsers[id] {
            throw LocalServerError.ServerDoesAlreadyExist
        }

        let browser: ServiceBrowser = ServiceBrowser.init(id: id, discoveryGroup: discoveryGroup)
        browsers[id] = browser
        let onStartFailed = { (_ reason: String) in
            self.browsers.removeValue(forKey: id)
            onFailure(reason)
        }
        browser.start(delegate: self, onSuccess: onSuccess, onFailure: onStartFailed)
    }

    func stopBrowser(id: String, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) throws {
        RNLSLog("ServiceBrowserManager [\(id)] - stopBrowser - started")
        guard let browser = browsers[id] else {
            throw LocalServerError.ServerDoesAlreadyExist
        }
        browser.stop(onSuccess: onSuccess, onFailure: onFailure)
    }

    func invalidate() {
        RNLSLog("ServiceBrowserManager - invalidate - \(browsers.count) browsers")
        self.shouldEmitEvents = false
        for browser in self.browsers.values {
            let onSuccess = {}
            let onFailure = { (_: String) in }
            browser.stop(onSuccess: onSuccess, onFailure: onFailure)
        }

    }

    private func handleLifecycleEvent(browserId: String, eventName: String, reason: String? = nil) {
        RNLSLog("ServiceBrowserManager [\(browserId)] - event \(eventName)")
        if (!shouldEmitEvents) {
            RNLSLog("\tNOT EMITTING")
            return
        }
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "browserId", value: browserId)
        if (reason != nil) {
            event.putString(key: "reason", value: reason!)
        }
        eventEmitter.emitEvent(event: event)
    }

    private func handleServiceLifecycleEvent(browserId: String, eventName: String, service: ServiceBrowserResult) {
        RNLSLog("ServiceBrowserManager [\(browserId)] - event \(eventName) - \(service.name)")
        if (!shouldEmitEvents) {
            RNLSLog("\tNOT EMITTING")
            return
        }
        let event: JSEvent = JSEvent(name: eventName)
        event.putString(key: "browserId", value: browserId)
        event.putString(key: "name", value: service.name)
        event.putString(key: "group", value: service.group)
        eventEmitter.emitEvent(event: event)
    }

    // MARK: - ServiceBrowserDelegateProtocol
    func handleBrowserReady(browserId: String) {
        handleLifecycleEvent(browserId: browserId, eventName: ServiceBrowserEventName.Started)
    }

    func handleBrowserStopped(browserId: String) {
        self.browsers.removeValue(forKey: browserId)
        handleLifecycleEvent(browserId: browserId, eventName: ServiceBrowserEventName.Stopped)
    }

    func handleServiceFound(browserId: String, service: ServiceBrowserResult) {
        handleServiceLifecycleEvent(browserId: browserId, eventName: ServiceBrowserEventName.ServiceFound, service: service)
    }

    func handleServiceLost(browserId: String, service: ServiceBrowserResult) {
        handleServiceLifecycleEvent(browserId: browserId, eventName: ServiceBrowserEventName.ServiceLost, service: service)
    }
}
