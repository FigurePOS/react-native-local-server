//
//  ServiceBrowserResult.swift
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class ServiceBrowserResult {
    
    let name: String
    let group: String
    let host: String?
    let port: String?
    
    init(name: String, group: String) {
        self.name = name
        self.group = group
        self.host = nil
        self.port = nil
    }
    
    init(name: String, group: String, host: String, port: String) {
        self.name = name
        self.group = group
        self.host = host
        self.port = port
    }
    
    
    
}
