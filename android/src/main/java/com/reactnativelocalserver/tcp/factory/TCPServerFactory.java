package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPServerFactory {
    public TCPServer of(String id, Integer port, EventEmitter eventEmitter) {
        return new TCPServer(id, port, eventEmitter);
    }
}
