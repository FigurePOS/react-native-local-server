

@objc(LocalServer)
class LocalServer: NSObject {
    
    private let server: Server = Server(portArg: 12000)


    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    @objc(startServer:withRejecter:)
    func startServer(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        print("startServer - started")
//        if (server != nil) {
//            print("startServer - already running")
//            resolve(false)
//        }
//        server = Server(portArg: 12000)
        try! server.start()
        resolve(true)
    }
    
    @objc(stopServer:withRejecter:)
    func stopServer(resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        print("stopServer - started")
        server.stop()
        resolve(true)
    }
}
