package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.TCPClientConnection;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPClientConnectionFactory {
    public TCPClientConnection of(String clientId, String host, Integer port, EventEmitter eventEmitter) {
        return new TCPClientConnection(clientId, host, port, eventEmitter);
    }
}
