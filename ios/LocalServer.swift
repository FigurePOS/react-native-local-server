import Network


@objc(LocalServer)
class LocalServer: NSObject {
    
    private let server: Server = Server(id: "server-1", port: 12000)
    private let client: Client = Client(id: "client-1", host: "192.168.1.65", port: 12000)


    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }
    
    @objc(startServer:withRejecter:)
    func startServer(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("startServer - started")
        try! server.start()
        resolve(true)
    }
    
    @objc(startClient:withRejecter:)
    func startClient(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("startClient - started")
        client.start()
        resolve(true)
    }
    
    @objc(sendFromClient:withResolver:withRejecter:)
    func sendFromClient(message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("sendFromClient - started")
        client.send(message: message)
        resolve(true)
    }
    
    @objc(sendFromServer:withResolver:withRejecter:)
    func sendFromServer(message: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) -> Void {
        print("sendFromServer - started")
        server.broadcast(message: message)
        resolve(true)
    }
}
