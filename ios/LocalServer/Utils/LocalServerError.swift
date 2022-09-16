//
//  LocalServerError.swift
//  LocalServer
//
//  Created by David Lang on 27.07.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//
import Foundation

enum LocalServerError: Error {
    case ServerDoesNotExist
    case ServerDoesAlreadyExist
    case ClientDoesNotExist
    case ClientDoesAlreadyExist
    case UnknownConnectionId
}
