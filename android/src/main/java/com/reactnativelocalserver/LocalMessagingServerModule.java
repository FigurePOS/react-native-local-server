package com.reactnativelocalserver;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.messaging.Server;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = LocalMessagingServerModule.NAME)
public class LocalMessagingServerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "LocalMessagingServer";

    private final Map<String, Server> servers = new HashMap();

    public LocalMessagingServerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void createServer(String id, int port, Promise promise) {
        Log.d(NAME, "createServer started for id: " + id);
        if (servers.get(id) != null) {
            promise.reject("client.already-exists", "Server with this id already exists");
            return;
        }
        Server server = new Server(id, port);
        server.start();
        servers.put(server.getId(), server);
        promise.resolve(true);
    }

    @ReactMethod
    public void stopServer(String id, Promise promise) {
        Log.d(NAME, "stopServer started for id: " + id);
        Server server = servers.get(id);
        if (server == null) {
            promise.reject("server.not-exists", "Server with this id does not exist");
            return;
        }
        server.stop();
        servers.remove(id);
        promise.resolve(true);
    }

    @ReactMethod
    public void send(String serverId, String connectionId, String message, Promise promise) {
        Log.d(NAME, "send started for server: " + serverId);
        Server server = servers.get(serverId);
        if (server == null) {
            promise.reject("server.not-exists", "Server with this id does not exist");
            return;
        }
        server.send(connectionId, message);
        promise.resolve(true);
    }

    @ReactMethod
    public void broadcast(String serverId, String message, Promise promise) {
        Log.d(NAME, "broadcast started for server: " + serverId);
        Server server = servers.get(serverId);
        if (server == null) {
            promise.reject("server.not-exists", "Server with this id does not exist");
            return;
        }
        server.broadcast(message);
        promise.resolve(true);
    }
}
