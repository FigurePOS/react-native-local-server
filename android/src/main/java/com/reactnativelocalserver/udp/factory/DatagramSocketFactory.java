package com.reactnativelocalserver.udp.factory;

import java.io.IOException;
import java.net.DatagramSocket;
import java.net.ServerSocket;

public class DatagramSocketFactory {
    public DatagramSocket of(Integer port) throws IOException {
        return new DatagramSocket(port);
    }
}
