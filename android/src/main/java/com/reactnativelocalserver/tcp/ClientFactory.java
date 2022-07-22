package com.reactnativelocalserver.tcp;

import com.reactnativelocalserver.utils.EventEmitter;

public class ClientFactory {
    public Client of(String id, String host, int port, EventEmitter eventEmitter) {
        return new Client(id, host, port, eventEmitter);
    }
}
