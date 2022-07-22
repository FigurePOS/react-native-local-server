package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.ServerConnection;
import com.reactnativelocalserver.utils.EventEmitter;

public class ServerConnectionFactory {
    public ServerConnection of(String serverId, EventEmitter eventEmitter) {
        return new ServerConnection(serverId, eventEmitter);
    }
}
