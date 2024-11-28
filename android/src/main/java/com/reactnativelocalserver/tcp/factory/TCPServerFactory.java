package com.reactnativelocalserver.tcp.factory;

import android.net.nsd.NsdServiceInfo;

import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPServerFactory {
    public TCPServer of(String id, Integer port, NsdServiceInfo discoveryConfig, EventEmitter eventEmitter) {
        return new TCPServer(id, port, discoveryConfig, eventEmitter);
    }

    public TCPServer of(String id, Integer port, NsdServiceInfo discoveryConfig, boolean useJmDNS, EventEmitter eventEmitter) {
        return new TCPServer(id, port, discoveryConfig, eventEmitter, useJmDNS);
    }

    public TCPServer of(String id, Integer port, EventEmitter eventEmitter) {
        return new TCPServer(id, port, null, eventEmitter);
    }
}
