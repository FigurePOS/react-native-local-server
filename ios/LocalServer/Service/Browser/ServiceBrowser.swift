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
    
    func start(delegate: ServiceBrowserDelegateProtocol) {
        self.delegate = delegate
        browser.start(queue: queue)
    }
    
    func stop() {
        browser.cancel()
    }
    
    func stateHandler(state: NWBrowser.State) {
        print("ServiceBrowser \(id) - stateHandler")
        guard let delegate = delegate else {
            print("\terror: NO DELEGATE")
            return
        }
        switch state {
        case .setup:
            print("\tstate: setup")
            return
        case .waiting(let error):
            print("\tstate: waiting: \(error.debugDescription)")
            return
        case .ready:
            print("\tstate: ready")
            return
        case .cancelled:
            print("\tstate: cancelled")
            return
        case .failed(let error):
            print("\tstate: failed: \(error.debugDescription)")
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
        for result in results {
            self.lastResult = results
            print(result.endpoint.debugDescription)
        }
        for change in changes {
            switch change {
            case .added(let data):
                delegate.handleServiceFound(browserId: id, service: mapResult(result: data))
                return
            case .removed(let data):
                delegate.handleServiceLost(browserId: id, service: mapResult(result: data))
                return
            default:
                return
            }
        }
    }
    
    internal func mapResult(result: NWBrowser.Result) -> ServiceBrowserResult {
        return ServiceBrowserResult.init(name: "", group: "")
    }
}
