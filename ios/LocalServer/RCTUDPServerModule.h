#pragma once

#ifdef __cplusplus
#if __has_include(<LocalServerSpec/LocalServerSpec.h>)
#import <LocalServerSpec/LocalServerSpec.h>

@interface RCTUDPServerModule : NativeUDPServerModuleSpecBase <NativeUDPServerModuleSpec>
@end

#endif
#endif
