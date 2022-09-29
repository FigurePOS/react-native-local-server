//
//  ClientDelegateProtocol.swift
//  LocalServer
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

protocol ClientDelegateProtocol {
    func handleClientReady(clientId: String)
    func handleClientStopped(clientId: String, reason: String?)
    func handleDataReceived(clientId: String, data: String)
}
