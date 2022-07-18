//
//  TCPClientEventName.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class TCPClientEventName {
    
    static let Ready = "RN_Local_Communication__TCP_Client_Ready"
    static let Stopped = "RN_Local_Communication__TCP_Client_Stopped"
    static let DataReceived = "RN_Local_Communication__TCP_Client_DataReceived"
    
    static let allValues: [String] = [
        Ready,
        Stopped,
        DataReceived
    ]
}
