package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.tcp.factory.ServerConnectionFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import java.net.Socket;
import java.util.HashMap;
import java.util.Map;

public class ServerConnectionManager {
    private static final String TAG = "ServerConnectionManager";
    private final ServerConnectionFactory connectionFactory;
    private final Map<String, ServerConnection> connections = new HashMap();

    public ServerConnectionManager() {
        this(new ServerConnectionFactory());
    }

    public ServerConnectionManager(ServerConnectionFactory connectionFactory) {
        this.connectionFactory = connectionFactory;
    }

    public String create(String serverId, EventEmitter eventEmitter) {
        ServerConnection connection = connectionFactory.of(serverId, eventEmitter);
        String connectionId = connection.getId();
        connections.put(connectionId, connection);
        return connectionId;
    }

    public Map<String, ServerConnection> getConnections() {
        return connections;
    }

    public void start(String id, Socket socket) throws Exception {
        ServerConnection connection = connections.get(id);
        if (connection == null) {
            throw new Exception("Unknown connection: " + id);
        }
        connection.setOnConnectionClosed(this::onConnectionClosed);
        connection.start(socket);
    }

    public ServerConnection get(String id) {
        return connections.get(id);
    }

    public void onConnectionClosed(String connectionId) {
        connections.remove(connectionId);
    }

    public void clear() {
        for (Map.Entry<String, ServerConnection> entry : connections.entrySet()) {
            try {
                entry.getValue().stop(StopReasonEnum.Invalidation);
            } catch (Exception e) {
                Log.e(TAG, "failed to stop connection: " + entry.getKey(), e);
            }
        }
        connections.clear();
    }
}
