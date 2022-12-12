//
//  LocalMessagingServer.m
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TCPServerModule, RCTEventEmitter)

RCT_EXTERN_METHOD(createServer:(NSString *)id
                  withPort:(int)port
                  withDiscoveryGroup:(NSString *)discoveryGroup
                  withDiscoveryName:(NSString *)discoveryName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopServer:(NSString *)id
                  withReason:(NSString *)reason
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(send:(NSString *)id
                  withConnectionId:(NSString *)connectionId
                  withMessage:(NSString *)message
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(closeConnection:(NSString *)id
                  withConnectionId:(NSString *)message
                  withReason:(NSString *)reason
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getConnectionIds:(NSString *)id
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getLocalIpAddress:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
