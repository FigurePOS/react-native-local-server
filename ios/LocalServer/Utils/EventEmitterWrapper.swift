//
//  EventEmitterWrapper.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class EventEmitterWrapper {
    private var eventEmitter: RCTEventEmitter?;
    
    func setEventEmitter(eventEmitter: RCTEventEmitter) {
        self.eventEmitter = eventEmitter
    }
    
    func emitEvent(event: JSEvent) -> Void {
        eventEmitter?.sendEvent(withName: event.getName(), body: event.getBody())
    }
}
