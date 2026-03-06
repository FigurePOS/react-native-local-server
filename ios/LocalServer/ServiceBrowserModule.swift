//
//  ServiceBrowserModuleImpl.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
@objcMembers
class ServiceBrowserModuleImpl: NSObject {

    private let eventEmitter: EventEmitterWrapper
    private var manager: ServiceBrowserManager

    init(onEvent: @escaping (String, [String: Any]) -> Void) {
        eventEmitter = EventEmitterWrapper()
        manager = ServiceBrowserManager.init(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventCallback { event in
            onEvent(event.getName(), event.getBody())
        }
    }

    func createBrowser(_ id: String, discoveryGroup: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("service.browser.error", reason, nil) }
            try manager.createBrowser(id: id, discoveryGroup: discoveryGroup, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("service.browser.already-exists", "Browser with this id already exists", nil)
        } catch {
            reject("service.browser.error", "Failed to create browser", error)
        }
    }

    func stopBrowser(_ id: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("service.browser.error", reason, nil) }
            try manager.stopBrowser(id: id, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesNotExist {
            resolve(true)
        } catch {
            reject("service.browser.error", "Failed to stop browser", error)
        }
    }

    func invalidate() {
        manager.invalidate()
    }
}
