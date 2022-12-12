package com.reactnativelocalserver.tcp;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;

import com.reactnativelocalserver.tcp.factory.ServerSocketFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.EventHandler;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.TCPServerEventName;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Map;
import java.util.Set;


public class TCPServer implements EventHandler {
    private final static String TAG = "TCPServer";
    private final TCPServerConnectionManager connectionManager;
    private final ServerSocketFactory socketFactory;
    private final EventEmitter eventEmitter;
    private final TCPServerDiscovery discovery;
    private final String id;
    private final int port;

    private NsdManager nsdManager;
    private Integer maxConnections = null;
    private Integer connectionCount = 0;
    private ServerSocket serverSocket;
    private TCPRunnable runnable;
    private Thread thread;
    private String lastStopReason = null;


    public TCPServer(String id, int port, NsdServiceInfo discoveryConfig, EventEmitter eventEmitter) {
        this(id, port, discoveryConfig, eventEmitter, new ServerSocketFactory(), new TCPServerConnectionManager());
    }

    public TCPServer(String id, int port, EventEmitter eventEmitter, ServerSocketFactory socketFactory, TCPServerConnectionManager connectionManager) {
        this(id, port, null, eventEmitter, socketFactory, connectionManager);
    }

    public TCPServer(String id, int port, NsdServiceInfo discoveryConfig, EventEmitter eventEmitter, ServerSocketFactory socketFactory, TCPServerConnectionManager connectionManager) {
        this.id = id;
        this.port = port;
        this.discovery = new TCPServerDiscovery(discoveryConfig, this);
        this.eventEmitter = eventEmitter;
        this.socketFactory = socketFactory;
        this.connectionManager = connectionManager;
    }

    public String getId() {
        return id;
    }

    public int getPort() {
        return port;
    }

    public Map<String, TCPServerConnection> getConnections() {
        return connectionManager.getConnections();
    }

    public Set<String> getConnectionIds() {
        return connectionManager.getConnections().keySet();
    }

    public void start() throws Exception {
        this.start(null, null);
    }

    public void start(Integer maxConnections) throws Exception {
        this.start(maxConnections, null);
    }

    public void start(NsdManager manager) throws Exception {
        this.start(null, manager);
    }

    public void start(Integer maxConnections, NsdManager manager) throws Exception {
        Log.d(TAG, "start: " + id);
        this.maxConnections = maxConnections;
        this.nsdManager = manager;
        try {
            serverSocket = socketFactory.of(port);
            runnable = new TCPRunnable();
            thread = new Thread(runnable, "com.react-native-messaging.tcp.server." + id);
            thread.start();
        } catch (IOException e) {
            Log.e(TAG, "start failed", e);
            throw new Exception("Port " + port + " already in use.", e);
        }
    }

    public void stop(String reason) throws Exception {
        Log.d(TAG, "stop: " + id);
        try {
            lastStopReason = reason;
            serverSocket.close();
        } catch (IOException e) {
            Log.e(TAG, "close server socket error", e);
            throw new Exception("Failed to stop server: " + id, e);
        }
    }

    public void send(String connectionId, String message) throws Exception {
        Log.d(TAG, "send: " + id + "\n\tto: " + connectionId + "\n\tmessage: " + message);
        TCPServerConnection connection = connectionManager.get(connectionId);
        if (connection == null) {
            throw new Exception("Unknown connection: " + connectionId);
        }
        connection.send(message);
    }

    public void closeConnection(String connectionId, String reason) throws Exception {
        Log.d(TAG, "close connection: " + id + "\n\tconnectionId: " + connectionId);
        TCPServerConnection connection = connectionManager.get(connectionId);
        if (connection == null) {
            throw new Exception("Unknown connection: " + connectionId);
        }
        connection.stop(reason);
    }

    private void cleanUp(String reason) {
        Log.d(TAG, "clean up: " + id);
        if (nsdManager != null) {
            discovery.unregister(nsdManager);
        }
        connectionManager.clear();
        if (thread != null && !thread.isInterrupted()) {
            thread.interrupt();
        }
        String reasonToStop = lastStopReason != null ? lastStopReason : reason;
        thread = null;
        runnable = null;
        serverSocket = null;
        lastStopReason = null;
        handleLifecycleEvent(TCPServerEventName.Stopped, reasonToStop);
    }

    private void handleConnectionAccepted(String connectionId) {
        JSEvent event = new JSEvent(TCPServerEventName.ConnectionAccepted);
        event.putString("serverId", id);
        event.putString("connectionId", connectionId);
        connectionCount++;
        this.eventEmitter.emitEvent(event);
    }

    public void handleLifecycleEvent(String eventName) {
        handleLifecycleEvent(eventName, null);
    }

    public void handleLifecycleEvent(String eventName, String reason) {
        JSEvent event = new JSEvent(eventName);
        event.putString("serverId", id);
        if (reason != null) {
            event.putString("reason", reason);
        }
        this.eventEmitter.emitEvent(event);
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(TCPServerEventName.Ready);
            if (nsdManager != null) {
                discovery.register(nsdManager);
            }
            try {
                while (serverSocket != null && (maxConnections == null || connectionCount < maxConnections)) {
                    Socket s = serverSocket.accept();
                    if (s != null) {
                        Log.d(TAG, "client connected");
                        String connectionId = connectionManager.create(id, eventEmitter);
                        connectionManager.start(connectionId, s);
                        handleConnectionAccepted(connectionId);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "error in connection accepting", e);
                cleanUp(e.getMessage());
            }
        }
    }
}
