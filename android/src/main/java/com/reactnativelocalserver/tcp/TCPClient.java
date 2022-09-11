package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.tcp.factory.TCPClientConnectionFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.function.Consumer;

public class TCPClient {
    private final static String TAG = "TCPClient";
    private final String id;
    private final String host;
    private final int port;
    private final TCPClientConnection connection;

    public TCPClient(String id, String host, int port, EventEmitter eventEmitter) {
        this(id, host, port, eventEmitter, new TCPClientConnectionFactory());
    }

    public TCPClient(String id, String host, int port, EventEmitter eventEmitter, TCPClientConnectionFactory connectionFactory) {
        this.id = id;
        this.host = host;
        this.port = port;
        this.connection = connectionFactory.of(id, host, port, eventEmitter);
    }

    public String getId() {
        return id;
    }

    public String getHost() {
        return host;
    }

    public int getPort() {
        return port;
    }

    public void start() throws Exception {
        Log.d(TAG, "start: " + id);
        connection.start();
    }

    public void stop(String reason) throws Exception {
        Log.d(TAG, "stop: " + id);
        connection.stop(reason);
    }

    public void send(String message) throws Exception {
        Log.d(TAG, "send: " + id + "\n\tmessage: " + message);
        connection.send(message);
    }

    public void setOnConnectionClosed(Consumer<String> onConnectionClosed) {
        this.connection.setOnConnectionClosed(onConnectionClosed);
    }
}
