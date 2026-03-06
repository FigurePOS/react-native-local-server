#pragma once

#import <Foundation/Foundation.h>

@interface ServiceBrowserModuleImpl : NSObject

- (instancetype)initWithOnEvent:(void (^)(NSString *, NSDictionary *))onEvent;

- (void)createBrowser:(NSString *)browserId
       discoveryGroup:(NSString *)discoveryGroup
              resolve:(void (^)(id _Nullable))resolve
               reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)stopBrowser:(NSString *)browserId
            resolve:(void (^)(id _Nullable))resolve
             reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)invalidate;

@end
