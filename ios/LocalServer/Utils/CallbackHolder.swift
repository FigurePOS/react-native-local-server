//
//  CallbackHolder.swift
//  LocalServer
//
//  Created by David Lang on 29.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

class CallbackHolder {
    let onSuccess: () -> ()
    let onFailure: (_ reason: String?) -> ()
    
    init(onSuccess: @escaping () -> (), onFailure: @escaping (_ reason: String?) -> ()) {
        self.onSuccess = onSuccess;
        self.onFailure = onFailure;
    }
}
