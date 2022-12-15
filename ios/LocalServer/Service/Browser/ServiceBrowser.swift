//
//  ServiceBrowser.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

@available(iOS 13.0, *)
class ServiceBrowser {
    private let id: String;
    private let browser: NWBrowser
    private let queue: DispatchQueue
    
    private var lastResult: Set<NWBrowser.Result> = []
    private var delegate: ServiceBrowserDelegateProtocol? = nil
    
    private var onStartSuccess: (() -> ())? = nil
    private var onStartFailure: ((_ reason: String) -> ())? = nil
    private var onStopSuccess: (() -> ())? = nil
    private var onStopFailure: ((_ reason: String) -> ())? = nil

    init(id: String, discoveryGroup: String) {
        self.id = id;
        self.queue = DispatchQueue.init(label: "com.react-native-local-messaging.browser.\(id)")
        let bonjourParms = NWParameters.init()
            bonjourParms.allowLocalEndpointReuse = true
            bonjourParms.acceptLocalOnly = true
            bonjourParms.allowFastOpen = true
        self.browser = NWBrowser.init(for: NWBrowser.Descriptor.bonjour(type: discoveryGroup, domain: nil), using: bonjourParms)
        browser.stateUpdateHandler = stateHandler(state:)
        browser.browseResultsChangedHandler = changeHandler(results:changes:)
        
    }
    
    func start(delegate: ServiceBrowserDelegateProtocol, onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        self.delegate = delegate
        self.onStartSuccess = onSuccess
        self.onStartFailure = onFailure
        browser.start(queue: queue)
    }
    
    func stop(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String) -> ()) {
        self.onStopSuccess = onSuccess
        self.onStopFailure = onFailure
        browser.cancel()
    }
    
    func handleBrowserStarted() {
        print("ServiceBrowser \(id) - handleBrowserStarted")
        if let onStartSuccess = onStartSuccess {
            print("ServiceBrowser \(id) - handleBrowserStarted - on success")
            onStartSuccess()
            self.onStartSuccess = nil
            self.onStartFailure = nil
        }
        if let delegate = delegate {
            print("ServiceBrowser \(id) - handleBrowserStarted - event")
            delegate.handleBrowserReady(browserId: id)
        }
    }
    
    func handleBrowserStopped() {
        print("ServiceBrowser \(id) - handleBrowserStopped")
        if let onStopSuccess = onStopSuccess {
            print("ServiceBrowser \(id) - handleBrowserStopped - on success")
            onStopSuccess()
            self.onStopSuccess = nil
            self.onStopFailure = nil
        }
        if let delegate = delegate {
            print("ServiceBrowser \(id) - handleBrowserStopped - event")
            delegate.handleBrowserStopped(browserId: id)
            self.delegate = nil
        }
    }
    
    func handleBrowserFailed(error: String) {
        print("ServiceBrowser \(id) - handleBrowserFailed")
        if let onStartFailure = onStartFailure {
            print("ServiceBrowser \(id) - start")
            onStartFailure(error)
            self.onStartSuccess = nil
            self.onStartFailure = nil
        }
        else if let onStopFailure = onStopFailure {
            print("ServiceBrowser \(id) - stop")
            onStopFailure(error)
            self.onStopSuccess = nil
            self.onStopFailure = nil
        }
        else if let delegate = delegate {
            print("ServiceBrowser \(id) - unknown reason")
            delegate.handleBrowserStopped(browserId: id)
        }
    }
    
    func stateHandler(state: NWBrowser.State) {
        print("ServiceBrowser \(id) - stateHandler")
        switch state {
        case .setup:
            print("\tstate: setup")
            return
        case .waiting(let error):
            print("\tstate: waiting: \(error.debugDescription)")
            return
        case .ready:
            print("\tstate: ready")
            self.handleBrowserStarted()
            return
        case .cancelled:
            print("\tstate: cancelled")
            self.handleBrowserStopped()
            return
        case .failed(let error):
            print("\tstate: failed: \(error.debugDescription)")
            self.handleBrowserFailed(error: error.debugDescription)
            return
        default:
            return
        }
    }
    
    func changeHandler(results: Set<NWBrowser.Result>, changes: Set<NWBrowser.Result.Change>) {
        print("ServiceBrowser \(id) - changeHandler")
        guard let delegate = delegate else {
            print("\terror: NO DELEGATE")
            return
        }
        self.lastResult = results
        for change in changes {
            switch change {
            case .added(let data):
                if let service = mapResult(result: data) {
                    delegate.handleServiceFound(browserId: id, service: service)
                }
                else {
                    print("\terror: UNKNOWN DATA")
                }
                break
            case .removed(let data):
                if let service = mapResult(result: data) {
                    delegate.handleServiceLost(browserId: id, service: service)
                }
                else {
                    print("\terror: UNKNOWN DATA")
                }
                break
            default:
                break
            }
        }
    }
    
    internal func mapResult(result: NWBrowser.Result) -> ServiceBrowserResult? {
        if case .service(let name, let type, _, _) = result.endpoint {
            return ServiceBrowserResult.init(name: name, group: type)
        }
        return nil
    }
}
