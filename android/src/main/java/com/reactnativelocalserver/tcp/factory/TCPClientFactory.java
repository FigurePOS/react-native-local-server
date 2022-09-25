package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.TCPClient;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPClientFactory {
    public TCPClient of(String id, String host, int port, EventEmitter eventEmitter) {
        return new TCPClient(id, host, port, eventEmitter);
    }
}
