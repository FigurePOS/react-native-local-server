//
//  LocalMessagingClient.m
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(TCPClientModule, RCTEventEmitter)

RCT_EXTERN_METHOD(createClient:(NSString *)id
                  withHost:(NSString *)host
                  withPort:(int)port
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createClientFromDiscovery:(NSString *)id
                  withDiscoveryGroup:(NSString *)discoveryGroup
                  withDiscoveryName:(NSString *)discoveryName
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopClient:(NSString *)id
                  withReason:(NSString *)reason
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(send:(NSString *)id
                  withMessage:(NSString *)message
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
