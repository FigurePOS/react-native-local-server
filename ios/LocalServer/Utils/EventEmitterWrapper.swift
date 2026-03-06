//
//  EventEmitterWrapper.swift
//  LocalServer
//
//  Created by David Lang on 18.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class EventEmitterWrapper {
    private var eventCallback: ((JSEvent) -> Void)?

    func setEventCallback(_ callback: @escaping (JSEvent) -> Void) {
        self.eventCallback = callback
    }

    func emitEvent(event: JSEvent) -> Void {
        eventCallback?(event)
    }
}
