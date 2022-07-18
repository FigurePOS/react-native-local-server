//
//  TCPServerEventName.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//


class TCPServerEventName {
    
    static let Ready = "RN_Local_Communication__TCP_Server_Ready"
    static let Stopped = "RN_Local_Communication__TCP_Server_Stopped"
    
    static let ConnectionAccepted = "RN_Local_Communication__TCP_Server_ConnectionAccepted"
    static let ConnectionReady = "RN_Local_Communication__TCP_Server_ConnectionReady"
    static let ConnectionClosed = "RN_Local_Communication__TCP_Server_ConnectionClosed"
    static let DataReceived = "RN_Local_Communication__TCP_Server_DataReceived"
    
    static let allValues: [String] = [
        Ready,
        Stopped,
        ConnectionAccepted,
        ConnectionReady,
        ConnectionClosed,
        DataReceived
    ]
}
