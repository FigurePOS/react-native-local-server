package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.Client;
import com.reactnativelocalserver.utils.EventEmitter;

public class ClientFactory {
    public Client of(String id, String host, int port, EventEmitter eventEmitter) {
        return new Client(id, host, port, eventEmitter);
    }
}
