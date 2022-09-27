//
//  UDPServerEventName.swift
//  LocalServer
//
//  Created by David Lang on 25.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class UDPServerEventName {
    
    static let Ready = "RN_Local_Communication__UDP_Server_Ready"
    static let Stopped = "RN_Local_Communication__UDP_Server_Stopped"
    static let DataReceived = "RN_Local_Communication__UDP_Server_DataReceived"
    
    static let allValues: [String] = [
        Ready,
        Stopped,
        DataReceived
    ]
}
