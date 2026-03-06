#if __has_include(<LocalServerSpec/LocalServerSpec.h>)

#import "RCTServiceBrowserModule.h"
#import "ServiceBrowserModuleImpl-Interface.h"

@implementation RCTServiceBrowserModule {
    ServiceBrowserModuleImpl *_impl;
}

- (instancetype)init {
    if (self = [super init]) {
        __weak __typeof__(self) weakSelf = self;
        _impl = [[ServiceBrowserModuleImpl alloc] initWithOnEvent:^(NSString *name, NSDictionary *body) {
            [weakSelf handleEvent:name body:body];
        }];
    }
    return self;
}

+ (NSString *)moduleName {
    return @"ServiceBrowserModule";
}

+ (BOOL)requiresMainQueueSetup {
    return NO;
}

- (void)handleEvent:(NSString *)name body:(NSDictionary *)body {
    if ([name isEqualToString:@"RN_Local_Communication__Service_Browser_Started"]) {
        [self emitOnStarted:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__Service_Browser_Stopped"]) {
        [self emitOnStopped:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__Service_Browser_Service_Found"]) {
        [self emitOnServiceFound:body];
    } else if ([name isEqualToString:@"RN_Local_Communication__Service_Browser_Service_Lost"]) {
        [self emitOnServiceLost:body];
    }
}

- (void)createBrowser:(NSString *)browserId
       discoveryGroup:(NSString *)discoveryGroup
              resolve:(RCTPromiseResolveBlock)resolve
               reject:(RCTPromiseRejectBlock)reject {
    [_impl createBrowser:browserId discoveryGroup:discoveryGroup resolve:resolve reject:reject];
}

- (void)stopBrowser:(NSString *)browserId
            resolve:(RCTPromiseResolveBlock)resolve
             reject:(RCTPromiseRejectBlock)reject {
    [_impl stopBrowser:browserId resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeServiceBrowserModuleSpecJSI>(params);
}

- (void)invalidate {
    [_impl invalidate];
}

@end

#endif
