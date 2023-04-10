//
//  JSEvent.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class JSEvent {
    private let name: String
    private var body: Dictionary<String, Any> = [:]

    init(name: String) {
        self.name = name
        body["type"] = name
    }
    
    func putString(key: String!, value: String) -> Void {
        body[key] = value
    }
    
    func putInt(key: String!, value: UInt16) -> Void {
        body[key] = value
    }
    
    func getBody() -> Dictionary<String, Any> {
        return body
    }
    
    func getName() -> String {
        return name
    }
}
