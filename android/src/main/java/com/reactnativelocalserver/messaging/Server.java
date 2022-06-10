package com.reactnativelocalserver.messaging;

import android.util.Log;

import com.reactnativelocalserver.utils.SocketWrapper;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

public class Server {
    private final static String TAG = "Server";
    private final static int CONNECTION_COUNT = 4;
    private final String id;
    private final int port;
    private ServerSocket serverSocket;
    private final Map<String, ServerConnection> connections = new HashMap();

    public Server(String id, int port) {
        this.id = id;
        this.port = port;
    }

    public String getId() {
        return id;
    }

    public int getPort() {
        return port;
    }

    public void start() {
        Log.d(TAG, "start");
        try {
            serverSocket = new ServerSocket(port, CONNECTION_COUNT);
            Socket s = serverSocket.accept();
            if (s != null){
                Log.d(TAG, "client is not null");
                ServerConnection connection = new ServerConnection();
                connection.start(s);
                connections.put(connection.getId(), connection);
            } else {
                Log.d(TAG, "client is null");
            }
            if (s != null) {

            }
        } catch (IOException e) {
            Log.e(TAG, "start failed", e);
        }
    }

    public void stop() {
        Log.d(TAG, "stop");
    }

    public void send(String connectionId, String message) {
        Log.d(TAG, "send to: " + connectionId + "\n message: " + message);
        ServerConnection connection = connections.get(connectionId);
        if (connection == null) {
            // TODO throw err
            return;
        }
        connection.send(message + "\r\n");
    }

    public void broadcast(String message) {
        Log.d(TAG, "broadcast: " + message);
        for (ServerConnection connection : connections.values()) {
            connection.send(message);
        }
    }
}
