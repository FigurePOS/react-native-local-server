//
//  ServerDelegateProtocol.swift
//  LocalServer
//
//  Created by David Lang on 27.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

protocol ServerDelegateProtocol {
    func handleServerReady(serverId: String)
    func handleServerStopped(serverId: String, reason: String?)
    func handleConnectionAccepted(serverId: String, connectionId: String)
    func handleConnectionReady(serverId: String, connectionId: String)
    func handleConnectionStopped(serverId: String, connectionId: String, reason: String?)
    func handleDataReceived(serverId: String, connectionId: String, data: String)
}
