//
//  LocalMessagingServer.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@objc(TCPServerModule)
class TCPServerModule: RCTEventEmitter {

    private var eventNames: [String]! = TCPServerEventName.allValues
    private let eventEmitter: EventEmitterWrapper = EventEmitterWrapper()
    private var manager: TCPServerManager
    
    override init() {
        manager = TCPServerManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventEmitter(eventEmitter: self)
    }
    
    @objc override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
    @objc(createServer:withPort:withResolver:withRejecter:)
    func createServer(id: String, port: UInt16, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("tcp.server.error", reason, nil)
            }
            try manager.createServer(id: id, port: port, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("tcp.server.already-exists", "Server with this id already exists", nil)
        } catch {
            reject("tcp.server.error", "Failed to create server", error)
        }
    }

    @objc(stopServer:withReason:withResolver:withRejecter:)
    func stopServer(id: String, reason: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.stopServer(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to stop server", error)
        }
    }

    @objc(send:withConnectionId:withMessage:withResolver:withRejecter:)
    func send(serverId: String, connectionId: String, message: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) -> Void {
        do {
            let onSuccess = {
                resolve(true)
            }
            let onFailure = { (reason: String) in
                reject("tcp.server.error", reason, nil)
            }
            try manager.send(serverId: serverId, connectionId: connectionId, message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to send data", error)
        }
    }

    
    @objc(closeConnection:withConnectionId:withReason:withResolver:withRejecter:)
    func closeConnection(serverId: String, connectionId: String, reason: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            try manager.closeConnection(serverId: serverId, connectionId: connectionId, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to close connection", error)
        }
    }

    @objc(getConnectionIds:withResolver:withRejecter:)
    func getConnectionIds(serverId: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        do {
            let connectionIds: [String] = try manager.getConnectionIds(serverId: serverId)
            resolve(connectionIds)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to get connections", error)
        }
    }
    
    @objc(getLocalIpAddress:withRejecter:)
    func getLocalIpAddress(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        var address: String?
        var ifaddr: UnsafeMutablePointer<ifaddrs>?
        if getifaddrs(&ifaddr) == 0 {
            var ptr = ifaddr
            while ptr != nil {
                defer { ptr = ptr?.pointee.ifa_next } // memory has been renamed to pointee in swift 3 so changed memory to pointee
               
                guard let interface = ptr?.pointee else {
                    reject("tcp.server.error", "getIpAddress - no interfaces", nil)
                    return
                }
                let addrFamily = interface.ifa_addr.pointee.sa_family
                if addrFamily == UInt8(AF_INET) || addrFamily == UInt8(AF_INET6) {
                   
                    guard let ifa_name = interface.ifa_name else {
                        reject("tcp.server.error", "getIpAddress - no name", nil)
                        return
                    }
                    let name: String = String(cString: ifa_name)
                   
                    if name == "en0" {  // String.fromCString() is deprecated in Swift 3. So use the following code inorder to get the exact IP Address.
                        var hostname = [CChar](repeating: 0, count: Int(NI_MAXHOST))
                        getnameinfo(interface.ifa_addr, socklen_t((interface.ifa_addr.pointee.sa_len)), &hostname, socklen_t(hostname.count), nil, socklen_t(0), NI_NUMERICHOST)
                        address = String(cString: hostname)
                    }
                   
                }
            }
            freeifaddrs(ifaddr)
        }
        resolve(address)
    }
    
    override func supportedEvents() -> [String]! {
        return self.eventNames
    }
    
    override func invalidate() {
        manager.invalidate()
        super.invalidate()
    }
}
