//
//  TCPServerModule.mm
//  LocalServer
//
//  Created by David Lang on 02.06.2022.
//  Copyright © 2022 Figure, Inc. All rights reserved.
//

#import <LocalServerSpec/RCTNativeTCPServerModuleSpec.h>

// Wire the Swift class into the codegen-generated TurboModule protocol.
// The Swift class implements all required methods; this declaration connects them.
@interface TCPServerModule () <NativeTCPServerModuleSpec>
@end
