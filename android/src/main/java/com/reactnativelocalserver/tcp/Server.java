package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.tcp.factory.ServerConnectionFactory;
import com.reactnativelocalserver.tcp.factory.ServerSocketFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.TCPServerEventName;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;


public class Server {
    private final static String TAG = "TCPServer";
    private final ServerConnectionFactory connectionFactory;
    private final ServerSocketFactory socketFactory;
    private final EventEmitter eventEmitter;
    private final Map<String, ServerConnection> connections = new HashMap();

    private final String id;
    private final int port;

    private ServerSocket serverSocket;
    private TCPRunnable runnable;
    private Thread thread;


    public Server(String id, int port, EventEmitter eventEmitter) {
        this(id, port, eventEmitter, new ServerSocketFactory(), new ServerConnectionFactory());
    }

    public Server(String id, int port, EventEmitter eventEmitter, ServerSocketFactory socketFactory, ServerConnectionFactory connectionFactory) {
        this.id = id;
        this.port = port;
        this.eventEmitter = eventEmitter;
        this.socketFactory = socketFactory;
        this.connectionFactory = connectionFactory;
    }

    public String getId() {
        return id;
    }

    public int getPort() {
        return port;
    }

    public Map<String, ServerConnection> getConnections() {
        return connections;
    }

    public void start() throws Exception {
        Log.d(TAG, "start: " + id);
        try {
            serverSocket = socketFactory.of(port);
            if (runnable != null) {
                // TODO throw error
                return;
            }
            runnable = new TCPRunnable();
            thread = new Thread(runnable, "com.react-native-messaging.server." + id);
            thread.start();
        } catch (IOException e) {
            Log.e(TAG, "start failed", e);
            throw new Exception("Port " + port + " already in use.", e);
        }
    }

    public void stop() throws Exception {
        Log.d(TAG, "stop: " + id);
        try {
            serverSocket.close();
        } catch (IOException e) {
            Log.e(TAG, "close server socket error", e);
        }
    }

    public void send(String connectionId, String message) throws Exception {
        Log.d(TAG, "send: " + id + "\n\tto: " + connectionId + "\n\tmessage: " + message);
        ServerConnection connection = connections.get(connectionId);
        if (connection == null) {
            // TODO throw err
            return;
        }
        connection.send(message + "\r\n");
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
        handleLifecycleEvent(TCPServerEventName.Stopped);
    }

    private void handleConnectionAccepted(String connectionId) {
        JSEvent event = new JSEvent(TCPServerEventName.ConnectionAccepted);
        event.putString("serverId", id);
        event.putString("connectionId", connectionId);
        this.eventEmitter.emitEvent(event);
    }

    private void handleLifecycleEvent(String eventName) {
        JSEvent event = new JSEvent(eventName);
        event.putString("serverId", id);
        this.eventEmitter.emitEvent(event);
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(TCPServerEventName.Ready);
            try {
                while (serverSocket != null) {
                    Socket s = serverSocket.accept();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + id);
                        throw new InterruptedException();
                    }
                    if (s != null) {
                        Log.d(TAG, "client connected");
                        ServerConnection connection = new ServerConnection(id, eventEmitter);
                        connection.start(s);
                        connections.put(connection.getId(), connection);
                        handleConnectionAccepted(connection.getId());
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "error in connection accepting", e);
                cleanUp();
            }
        }
    }
}
