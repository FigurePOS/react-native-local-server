package com.reactnativelocalserver.tcp.factory;

import com.reactnativelocalserver.tcp.Server;
import com.reactnativelocalserver.utils.EventEmitter;

public class ServerFactory {
    public Server of(String id, Integer port, EventEmitter eventEmitter) {
        return new Server(id, port, eventEmitter);
    }
}
