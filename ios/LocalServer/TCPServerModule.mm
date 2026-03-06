#if __has_include(<LocalServerSpec/LocalServerSpec.h>)

#import "RCTTCPServerModule.h"
#import "TCPServerModuleImpl-Interface.h"

@implementation RCTTCPServerModule {
    TCPServerModuleImpl *_impl;
}

- (instancetype)init {
    if (self = [super init]) {
        __weak __typeof__(self) weakSelf = self;
        _impl = [[TCPServerModuleImpl alloc] initWithOnEvent:^(NSString *name, NSDictionary *body) {
            [weakSelf handleEvent:name body:body];
        }];
    }
    return self;
}

+ (NSString *)moduleName {
    return @"TCPServerModule";
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)handleEvent:(NSString *)name body:(NSDictionary *)body {
    if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_Ready"]) {
        [self emitOnReady:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_Stopped"]) {
        [self emitOnStopped:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_ConnectionAccepted"]) {
        [self emitOnConnectionAccepted:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_ConnectionReady"]) {
        [self emitOnConnectionReady:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_ConnectionClosed"]) {
        [self emitOnConnectionClosed:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__TCP_Server_DataReceived"]) {
        [self emitOnDataReceived:body];
    }
}

- (void)createServer:(NSString *)serverId
                port:(double)port
      discoveryGroup:(NSString *)discoveryGroup
       discoveryName:(NSString *)discoveryName
             resolve:(RCTPromiseResolveBlock)resolve
              reject:(RCTPromiseRejectBlock)reject {
    [_impl createServer:serverId port:port discoveryGroup:discoveryGroup discoveryName:discoveryName resolve:resolve reject:reject];
}

- (void)stopServer:(NSString *)serverId
            reason:(NSString *)reason
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
    [_impl stopServer:serverId reason:reason resolve:resolve reject:reject];
}

- (void)send:(NSString *)serverId
connectionId:(NSString *)connectionId
     message:(NSString *)message
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
    [_impl send:serverId connectionId:connectionId message:message resolve:resolve reject:reject];
}

- (void)closeConnection:(NSString *)serverId
           connectionId:(NSString *)connectionId
                 reason:(NSString *)reason
                resolve:(RCTPromiseResolveBlock)resolve
                 reject:(RCTPromiseRejectBlock)reject {
    [_impl closeConnection:serverId connectionId:connectionId reason:reason resolve:resolve reject:reject];
}

- (void)getConnectionIds:(NSString *)serverId
                 resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject {
    [_impl getConnectionIds:serverId resolve:resolve reject:reject];
}

- (void)getLocalIpAddress:(RCTPromiseResolveBlock)resolve
                   reject:(RCTPromiseRejectBlock)reject {
    [_impl getLocalIpAddress:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeTCPServerModuleSpecJSI>(params);
}

- (void)invalidate {
    [_impl invalidate];
}

@end

#endif
