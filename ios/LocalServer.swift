@objc(LocalServer)
class LocalServer: NSObject {

    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    @objc(startServer:withRejecter:)
    func startServer(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        print("startServer - started")
        resolve(true)
    }
}
