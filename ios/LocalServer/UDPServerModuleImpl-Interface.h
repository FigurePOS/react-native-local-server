#pragma once

#import <Foundation/Foundation.h>

@interface UDPServerModuleImpl : NSObject

- (instancetype)initWithOnEvent:(void (^)(NSString *, NSDictionary *))onEvent;

- (void)createServer:(NSString *)serverId
                port:(double)port
numberOfDroppedBytesFromMsgStart:(double)numberOfDroppedBytesFromMsgStart
             resolve:(void (^)(id _Nullable))resolve
              reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)stopServer:(NSString *)serverId
            reason:(NSString *)reason
           resolve:(void (^)(id _Nullable))resolve
            reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)send:(NSString *)host
        port:(double)port
     message:(NSString *)message
     resolve:(void (^)(id _Nullable))resolve
      reject:(void (^)(NSString * _Nullable, NSString * _Nullable, NSError * _Nullable))reject;

- (void)invalidate;

@end
