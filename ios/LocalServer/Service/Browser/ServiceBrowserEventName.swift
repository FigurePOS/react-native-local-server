//
//  ServiceBrowserEventName.swift
//  LocalServer
//
//  Created by David Lang on 13.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class ServiceBrowserEventName {

    static let Started = "RN_Local_Communication__Service_Browser_Started"
    static let Stopped = "RN_Local_Communication__Service_Browser_Stopped"
    static let ServiceFound = "RN_Local_Communication__Service_Browser_Service_Found"
    static let ServiceLost = "RN_Local_Communication__Service_Browser_Service_Lost"

    static let allValues: [String] = [
        Started,
        Stopped,
        ServiceFound,
        ServiceLost
    ]
}
