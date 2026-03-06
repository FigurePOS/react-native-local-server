#if __has_include(<LocalServerSpec/LocalServerSpec.h>)

#import "RCTUDPServerModule.h"
#import "UDPServerModuleImpl-Interface.h"

@implementation RCTUDPServerModule {
    UDPServerModuleImpl *_impl;
}

- (instancetype)init {
    if (self = [super init]) {
        __weak __typeof__(self) weakSelf = self;
        _impl = [[UDPServerModuleImpl alloc] initWithOnEvent:^(NSString *name, NSDictionary *body) {
            [weakSelf handleEvent:name body:body];
        }];
    }
    return self;
}

+ (NSString *)moduleName {
    return @"UDPServerModule";
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)handleEvent:(NSString *)name body:(NSDictionary *)body {
    if ([name isEqualToString:@"RN_Local_Communication__UDP_Server_Ready"]) {
        [self emitOnReady:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__UDP_Server_Stopped"]) {
        [self emitOnStopped:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__UDP_Server_DataReceived"]) {
        [self emitOnDataReceived:body];
    }
}

- (void)createServer:(NSString *)serverId
                port:(double)port
numberOfDroppedBytesFromMsgStart:(double)numberOfDroppedBytesFromMsgStart
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    [_impl createServer:serverId port:port numberOfDroppedBytesFromMsgStart:numberOfDroppedBytesFromMsgStart resolve:resolve reject:reject];
}

- (void)stopServer:(NSString *)serverId
            reason:(NSString *)reason
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [_impl stopServer:serverId reason:reason resolve:resolve reject:reject];
}

- (void)send:(NSString *)host
        port:(double)port
     message:(NSString *)message
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    [_impl send:host port:port message:message resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeUDPServerModuleSpecJSI>(params);
}

- (void)invalidate {
    [_impl invalidate];
}

@end

#endif
