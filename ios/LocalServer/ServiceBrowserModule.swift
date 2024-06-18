//
//  ServiceBrowserModule.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation


@available(iOS 13.0, *)
@objc(ServiceBrowserModule)
class ServiceBrowserModule: RCTEventEmitter {

    private var eventNames: [String]! = ServiceBrowserEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()
    private var manager: ServiceBrowserManager

    override init() {
        self.manager = ServiceBrowserManager.init(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }

    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }

    @objc(createBrowser:withDiscoveryGroup:withResolver:withRejecter:)
    func createBrowser(id: String, discoveryGroup: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("service.browser.error", reason, nil)
            }
            try manager.createBrowser(id: id, discoveryGroup: discoveryGroup, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("service.browser.already-exists", "Browser with this id already exists", nil)
        } catch {
            reject("service.browser.error", "Failed to create browser", error)
        }
    }

    @objc(stopBrowser:withResolver:withRejecter:)
    func stopBrowser(id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("service.browser.error", reason, nil)
            }
            try manager.stopBrowser(id: id, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesNotExist {
            reject("service.browser.not-exists", "Browser with this id does not exist", nil)
        } catch {
            reject("service.browser.error", "Failed to stop browser", error)
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
