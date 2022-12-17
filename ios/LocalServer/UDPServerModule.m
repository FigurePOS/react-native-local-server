//
//  UDPServerModule.m
//  LocalServer
//
//  Created by David Lang on 25.09.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(UDPServerModule, RCTEventEmitter)

RCT_EXTERN_METHOD(createServer:(NSString *)id
                  withPort:(int)port
                  withNumberOfDroppedBytesFromMsgStart:(int)numberOfDroppedBytesFromMsgStart
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopServer:(NSString *)id
                  withReason:(NSString *)reason
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(send:(NSString *)host
                  withPort:(int)port
                  withMessage:(NSString *)message
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
