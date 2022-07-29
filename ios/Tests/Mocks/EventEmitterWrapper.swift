//
//  EventEmitterWrapper.swift
//  LocalServerForTests
//
//  Created by David Lang on 29.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

class EventEmitterWrapper {
    private var events: [JSEvent] = []
    let name: String
    
    init(name: String) {
        self.name = name
    }
    
    func emitEvent(event: JSEvent) -> Void {
        events.append(event)
    }
    
    func getEvents() -> [JSEvent] {
        return events
    }
}
