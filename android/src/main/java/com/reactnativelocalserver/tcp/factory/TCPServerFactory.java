package com.reactnativelocalserver.tcp.factory;

import android.net.nsd.NsdServiceInfo;

import com.github.druk.dnssd.DNSSD;
import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.utils.EventEmitter;

public class TCPServerFactory {
    public TCPServer of(String id, Integer port, NsdServiceInfo discoveryConfig, EventEmitter eventEmitter) {
        return new TCPServer(id, port, discoveryConfig, eventEmitter);
    }

    public TCPServer of(String id, Integer port, NsdServiceInfo discoveryConfig, DNSSD dnssd, EventEmitter eventEmitter) {
        return new TCPServer(id, port, discoveryConfig, eventEmitter, dnssd);
    }

    public TCPServer of(String id, Integer port, EventEmitter eventEmitter) {
        return new TCPServer(id, port, null, eventEmitter);
    }
}
