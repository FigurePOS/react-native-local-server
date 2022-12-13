//
//  ServiceDelegateProtocol.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation
import Network

protocol ServiceDelegateProtocol {
    func serviceAdded(serverId: String, endpoint: NWEndpoint)
    func serviceRemoved(serverId: String, endpoint: NWEndpoint)
}
