#pragma once

#import <Foundation/Foundation.h>

@interface TCPClientModuleImpl : NSObject

- (instancetype)initWithOnEvent:(void (^)(NSString *, NSDictionary *))onEvent;

- (void)createClient:(NSString *)clientId
                host:(NSString *)host
                port:(double)port
             resolve:(void (^)(id _Nullable))resolve
              reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)createClientFromDiscovery:(NSString *)clientId
                   discoveryGroup:(NSString *)discoveryGroup
                    discoveryName:(NSString *)discoveryName
                          resolve:(void (^)(id _Nullable))resolve
                           reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)stopClient:(NSString *)clientId
            reason:(NSString *)reason
           resolve:(void (^)(id _Nullable))resolve
            reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)send:(NSString *)clientId
     message:(NSString *)message
     resolve:(void (^)(id _Nullable))resolve
      reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)invalidate;

@end
