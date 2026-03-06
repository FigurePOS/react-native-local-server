#if __has_include(<LocalServerSpec/LocalServerSpec.h>)

#import "RCTTCPClientModule.h"
#import "TCPClientModuleImpl-Interface.h"

@implementation RCTTCPClientModule {
    TCPClientModuleImpl *_impl;
}

- (instancetype)init {
    if (self = [super init]) {
        __weak __typeof__(self) weakSelf = self;
        _impl = [[TCPClientModuleImpl alloc] initWithOnEvent:^(NSString *name, NSDictionary *body) {
            [weakSelf handleEvent:name body:body];
        }];
    }
    return self;
}

+ (NSString *)moduleName {
    return @"TCPClientModule";
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)handleEvent:(NSString *)name body:(NSDictionary *)body {
    if ([name isEqualToString:@"RN_Local_Communication__TCP_Client_Ready"]) {
        [self emitOnReady:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Client_Stopped"]) {
        [self emitOnStopped:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Client_DataReceived"]) {
        [self emitOnDataReceived:body];
    }
}

- (void)createClient:(NSString *)clientId
                host:(NSString *)host
                port:(double)port
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    [_impl createClient:clientId host:host port:port resolve:resolve reject:reject];
}

- (void)createClientFromDiscovery:(NSString *)clientId
                   discoveryGroup:(NSString *)discoveryGroup
                    discoveryName:(NSString *)discoveryName
                          resolve:(RCTPromiseResolveBlock)resolve
                           reject:(RCTPromiseRejectBlock)reject {
    [_impl createClientFromDiscovery:clientId discoveryGroup:discoveryGroup discoveryName:discoveryName resolve:resolve reject:reject];
}

- (void)stopClient:(NSString *)clientId
            reason:(NSString *)reason
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [_impl stopClient:clientId reason:reason resolve:resolve reject:reject];
}

- (void)send:(NSString *)clientId
     message:(NSString *)message
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    [_impl send:clientId message:message resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeTCPClientModuleSpecJSI>(params);
}

- (void)invalidate {
    [_impl invalidate];
}

@end

#endif
