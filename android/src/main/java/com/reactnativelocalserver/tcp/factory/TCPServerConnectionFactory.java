package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.TCPServerConnection;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPServerConnectionFactory {
    public TCPServerConnection of(String serverId, EventEmitter eventEmitter) {
        return new TCPServerConnection(serverId, eventEmitter);
    }
}
