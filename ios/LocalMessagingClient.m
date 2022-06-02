//
//  LocalMessagingClient.m
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Facebook. All rights reserved.
//

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(LocalMessagingClient, NSObject)

RCT_EXTERN_METHOD(createClient:(NSString *)id
                  withHost:(NSString *)host
                  withPort:(int)port
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopClient:(NSString *)id
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(send:(NSString *)id
                  withMessage:(NSString *)message
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
