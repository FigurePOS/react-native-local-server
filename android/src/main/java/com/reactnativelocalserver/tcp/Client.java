package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.utils.EventEmitter;

public class Client {
    private final static String TAG = "TCPClient";
    private final String id;
    private final String host;
    private final int port;
    private final EventEmitter eventEmitter;
    private final ClientConnection connection;

    public Client(String id, String host, int port, EventEmitter eventEmitter) {
        this.id = id;
        this.host = host;
        this.port = port;
        this.eventEmitter = eventEmitter;
        connection = new ClientConnection(id, host, port, eventEmitter);
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

    public void start() {
        Log.d(TAG, "start: " + id);
        connection.start();
    }

    public void stop() {
        Log.d(TAG, "stop: " + id);
        connection.stop();
    }

    public void send(String message) {
        Log.d(TAG, "send: " + id + "\n\tmessage: " + message);
        connection.send(message);
    }
}
