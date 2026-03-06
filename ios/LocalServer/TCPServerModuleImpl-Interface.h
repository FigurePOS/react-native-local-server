#pragma once

#import <Foundation/Foundation.h>

@interface TCPServerModuleImpl : NSObject

- (instancetype)initWithOnEvent:(void (^)(NSString *, NSDictionary *))onEvent;

- (void)createServer:(NSString *)serverId
                port:(double)port
      discoveryGroup:(NSString * _Nullable)discoveryGroup
       discoveryName:(NSString * _Nullable)discoveryName
             resolve:(void (^)(id _Nullable))resolve
              reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)stopServer:(NSString *)serverId
            reason:(NSString *)reason
           resolve:(void (^)(id _Nullable))resolve
            reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)send:(NSString *)serverId
connectionId:(NSString *)connectionId
     message:(NSString *)message
     resolve:(void (^)(id _Nullable))resolve
      reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)closeConnection:(NSString *)serverId
           connectionId:(NSString *)connectionId
                 reason:(NSString *)reason
                resolve:(void (^)(id _Nullable))resolve
                 reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)getConnectionIds:(NSString *)serverId
                 resolve:(void (^)(id _Nullable))resolve
                  reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)getLocalIpAddress:(void (^)(id _Nullable))resolve
                   reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)invalidate;

@end
