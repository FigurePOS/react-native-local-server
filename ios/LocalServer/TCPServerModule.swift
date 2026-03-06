//
//  TCPServerModuleImpl.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@available(iOS 13.0, *)
@objcMembers
class TCPServerModuleImpl: NSObject {

    private let eventEmitter: EventEmitterWrapper
    private var manager: TCPServerManager

    init(onEvent: @escaping (String, [String: Any]) -> Void) {
        eventEmitter = EventEmitterWrapper()
        manager = TCPServerManager(eventEmitter: eventEmitter)
        super.init()
        eventEmitter.setEventCallback { event in
            onEvent(event.getName(), event.getBody())
        }
    }

    func createServer(_ id: String, port: Double, discoveryGroup: String?, discoveryName: String?, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("tcp.server.error", reason, nil) }
            try manager.createServer(id: id, port: UInt16(port), discoveryGroup: discoveryGroup, discoveryName: discoveryName, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesAlreadyExist {
            reject("tcp.server.already-exists", "Server with this id already exists", nil)
        } catch {
            reject("tcp.server.error", "Failed to create server", error)
        }
    }

    func stopServer(_ id: String, reason: String, resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        do {
            try manager.stopServer(id: id, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to stop server", error)
        }
    }

    func send(_ serverId: String, connectionId: String, message: String, resolve: @escaping (Any?) -> Void, reject: @escaping (String?, String?, Error?) -> Void) {
        do {
            let onSuccess = { resolve(true) }
            let onFailure = { (reason: String) in reject("tcp.server.error", reason, nil) }
            try manager.send(serverId: serverId, connectionId: connectionId, message: message, onSuccess: onSuccess, onFailure: onFailure)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to send data", error)
        }
    }

    func closeConnection(_ serverId: String, connectionId: String, reason: String, resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        do {
            try manager.closeConnection(serverId: serverId, connectionId: connectionId, reason: reason)
            resolve(true)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to close connection", error)
        }
    }

    func getConnectionIds(_ serverId: String, resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        do {
            let connectionIds: [String] = try manager.getConnectionIds(serverId: serverId)
            resolve(connectionIds)
        } catch LocalServerError.ServerDoesNotExist {
            reject("tcp.server.not-exists", "Server with this id does not exist", nil)
        } catch {
            reject("tcp.server.error", "Failed to get connections", error)
        }
    }

    func getLocalIpAddress(_ resolve: (Any?) -> Void, reject: (String?, String?, Error?) -> Void) {
        var address: String?
        var ifaddr: UnsafeMutablePointer<ifaddrs>?
        if getifaddrs(&ifaddr) == 0 {
            var ptr = ifaddr
            while ptr != nil {
                defer { ptr = ptr?.pointee.ifa_next }
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
                    if name == "en0" {
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

    func invalidate() {
        manager.invalidate()
    }
}
