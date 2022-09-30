//
//  EventEmitterWrapper.swift
//  LocalServerForTests
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class EventEmitterWrapper {
    private var events: [JSEvent] = []
    private var onEventCallbacks: [((_ event: JSEvent) -> Bool)] = []
    let name: String

    init(name: String) {
        self.name = name
    }
    
    func emitEvent(event: JSEvent) -> Void {
        events.append(event)
        onEventCallbacks = onEventCallbacks.filter({ (callback: ((_ event: JSEvent) -> Bool)) in
            return callback(event)
        })
    }
    
    func getEvents() -> [JSEvent] {
        return events
    }
    
    func addOnEvent(callback: @escaping (_ event: JSEvent) -> Bool) {
        onEventCallbacks.append(callback)
    }
}
