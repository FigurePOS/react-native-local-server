//
//  ServerConnectionDelegateProtocol.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

protocol ServerConnectionDelegateProtocol {
    func handleConnectionReady(connectionId: String)
    func handleConnectionStopped(connectionId: String, reason: String?)
    func handleDataReceived(connectionId: String, data: String)
}
