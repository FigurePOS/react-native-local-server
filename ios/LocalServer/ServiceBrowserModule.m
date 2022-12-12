//
//  ServiceBrowserModule.m
//  LocalServer
//
//  Created by David Lang on 12.12.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(ServiceBrowserModule, RCTEventEmitter)

RCT_EXTERN_METHOD(createBrowser:(NSString *)id
                  withDiscoveryGroup:(NSString *)discoveryGroup
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(stopBrowser:(NSString *)id
                  withResolver:(RCTPromiseResolveBlock)resolve
                  withRejecter:(RCTPromiseRejectBlock)reject)

@end
