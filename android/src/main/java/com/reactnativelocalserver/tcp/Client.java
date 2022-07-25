package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.tcp.factory.ClientConnectionFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.function.Consumer;

public class Client {
    private final static String TAG = "TCPClient";
    private final String id;
    private final String host;
    private final int port;
    private final ClientConnection connection;

    public Client(String id, String host, int port, EventEmitter eventEmitter) {
        this(id, host, port, eventEmitter, new ClientConnectionFactory());
    }

    public Client(String id, String host, int port, EventEmitter eventEmitter, ClientConnectionFactory connectionFactory) {
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

    public void stop() throws Exception {
        Log.d(TAG, "stop: " + id);
        connection.stop();
    }

    public void send(String message) throws Exception {
        Log.d(TAG, "send: " + id + "\n\tmessage: " + message);
        connection.send(message);
    }

    public void setOnConnectionClosed(Consumer<String> onConnectionClosed) {
        this.connection.setOnConnectionClosed(onConnectionClosed);
    }
}
