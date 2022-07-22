package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.ClientConnection;
import com.reactnativelocalserver.utils.EventEmitter;

public class ClientConnectionFactory {
    public ClientConnection of(String clientId, String host, Integer port, EventEmitter eventEmitter) {
        return new ClientConnection(clientId, host, port, eventEmitter);
    }
}
