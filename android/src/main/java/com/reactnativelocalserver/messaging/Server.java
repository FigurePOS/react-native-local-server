package com.reactnativelocalserver.messaging;

import android.util.Log;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
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
        Log.d(TAG, "start: " + id);
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
        Log.d(TAG, "stop: " + id);
        try {
            serverSocket.close();
        } catch (IOException e) {
            Log.e(TAG, "close server socket error", e);
        }
    }

    public void send(String connectionId, String message) {
        Log.d(TAG, "send: " + id + "\n\tto: " + connectionId + "\n\tmessage: " + message);
        ServerConnection connection = connections.get(connectionId);
        if (connection == null) {
            // TODO throw err
            return;
        }
        connection.send(message + "\r\n");
    }

    public void broadcast(String message) {
        Log.d(TAG, "broadcast: " + id + "\n\tmessage: " + message);
        for (ServerConnection connection : connections.values()) {
            connection.send(message);
        }
    }

    private void cleanUp() {
        Log.d(TAG, "clean up: " + id);
        for (ServerConnection connection : connections.values()) {
            connection.stop();
        }
        connections.clear();
        thread.interrupt();
        thread = null;
        runnable = null;
        serverSocket = null;
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            try {
                while (serverSocket != null) {
                    Socket s = serverSocket.accept();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + id);
                        throw new InterruptedException();
                    }
                    if (s != null) {
                        Log.d(TAG, "client connected");
                        ServerConnection connection = new ServerConnection();
                        connection.start(s);
                        connections.put(connection.getId(), connection);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "error in connection accepting", e);
                cleanUp();
            }
        }
    }
}
