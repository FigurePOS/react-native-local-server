package com.reactnativelocalserver.tcp.factory;

import java.io.IOException;
import java.net.ServerSocket;

public class ServerSocketFactory {
    public ServerSocket of(Integer port) throws IOException {
        return new ServerSocket(port, 1);
    }
}
