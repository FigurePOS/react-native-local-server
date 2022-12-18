//
//  TCPUtils.swift
//  LocalServer
//
//  Created by David Lang on 18.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

func formatTCPDiscoveryType(_ discoveryGroup: String) -> String {
    return String(format: "_%@._tcp", discoveryGroup)
}
