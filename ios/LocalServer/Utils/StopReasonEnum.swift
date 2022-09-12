//
//  TCPClientEventName.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class StopReasonEnum {
    static let Manual = "manual"
    static let ClosedByPeer = "closed-by-peer"
    static let Invalidation = "invalidation"

    static let allValues: [String] = [
        Manual,
        ClosedByPeer,
        Invalidation
    ]
}
