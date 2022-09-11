package com.reactnativelocalserver.udp.factory;

import com.reactnativelocalserver.udp.UDPServer;
import com.reactnativelocalserver.utils.EventEmitter;

public class UDPServerFactory {
    public UDPServer of(String id, Integer port, EventEmitter eventEmitter) {
        return new UDPServer(id, port, eventEmitter);
    }
}
