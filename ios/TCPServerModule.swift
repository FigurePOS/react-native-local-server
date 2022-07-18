//
//  LocalMessagingServer.swift
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

import Foundation

@objc(TCPServerModule)
class TCPServerModule: NSObject {

    private var servers: [String: TCPServer] = [:]

    @objc(createServer:withPort:withResolver:withRejecter:)
    func createServer(id: String, port: UInt16, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - createServer - started")
        if let _: TCPServer = servers[id] {
            reject("server.already-exists", "Server with this id already exists", nil)
        } else {
            let server: TCPServer = TCPServer(id: id, port: port)
            servers[id] = server
            try! server.start()
            resolve(true)
        }
    }

    @objc(stopServer:withResolver:withRejecter:)
    func stopServer(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - stopServer - started")
        if let server: TCPServer = servers[id] {
            server.stop()
            servers.removeValue(forKey: id)
            resolve(true)
        } else {
            reject("server.not-exists", "Server with this id does not exist", nil)
        }
    }

    @objc(send:withConnectionId:withMessage:withResolver:withRejecter:)
    func send(serverId: String, connectionId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - send - started")
        if let server: TCPServer = servers[serverId] {
            server.send(connectionId: connectionId, message: message)
            resolve(true)
        } else {
            reject("server.not-exists", "Server with this id does not exist", nil)
        }
    }


    @objc(broadcast:withMessage:withResolver:withRejecter:)
    func broadcast(serverId: String, message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("TCPServerModule - broadcast - started")
        if let server: TCPServer = servers[serverId] {
            server.broadcast(message: message)
            resolve(true)
        } else {
            reject("server.not-exists", "Server with this id does not exist", nil)
        }
    }

}
