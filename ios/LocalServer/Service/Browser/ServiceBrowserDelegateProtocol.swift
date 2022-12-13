//
//  ServiceBrowserDelegate.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

protocol ServiceBrowserDelegateProtocol {
    func handleBrowserReady(browserId: String)
    func handleBrowserStopped(browserId: String)
    func handleServiceFound(browserId: String, service: ServiceBrowserResult)
    func handleServiceLost(browserId: String, service: ServiceBrowserResult)
}
