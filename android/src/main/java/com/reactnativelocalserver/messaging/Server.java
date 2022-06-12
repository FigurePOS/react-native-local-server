package com.reactnativelocalserver.messaging;

import android.util.Log;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

public class Server {
    private final static String TAG = "Server";
    private final String id;
    private final int port;
    private ServerSocket serverSocket;
    private final Map<String, ServerConnection> connections = new HashMap();

    private TCPRunnable runnable;
    private Thread thread;

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
            serverSocket = new ServerSocket(port, 1);
            if (runnable != null) {
                // TODO throw error
                return;
            }
            runnable = new TCPRunnable();
            thread = new Thread(runnable, "com.react-native-messaging.server." + id);
            thread.start();
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

    public class TCPRunnable implements Runnable {
        private boolean shouldRun = true;

        @Override
        public void run() {
            try {
                while (shouldRun && serverSocket != null) {
                    Socket s = serverSocket.accept();
                    if (s != null) {
                        Log.d(TAG, "client connected");
                        ServerConnection connection = new ServerConnection();
                        connection.start(s);
                        connections.put(connection.getId(), connection);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "error in connection accepting", e);
            }

        }
    }
}
