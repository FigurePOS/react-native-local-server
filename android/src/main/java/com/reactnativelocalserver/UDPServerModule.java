package com.reactnativelocalserver;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.udp.UDPServer;
import com.reactnativelocalserver.udp.factory.UDPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = UDPServerModule.NAME)
public class UDPServerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "UDPServerModule";

    private final EventEmitter eventEmitter;
    private final UDPServerFactory serverFactory;
    private final Map<String, UDPServer> servers = new HashMap();

    public UDPServerModule(ReactApplicationContext reactContext, EventEmitter eventEmitter, UDPServerFactory serverFactory) {
        super(reactContext);
        this.eventEmitter = eventEmitter;
        this.serverFactory = serverFactory;
    }

    public Map<String, UDPServer> getServers() {
        return servers;
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
            promise.reject("udp.server.already-exists", "Server with this id already exists");
            return;
        }
        try {
            UDPServer server = serverFactory.of(id, port, eventEmitter);
            server.start();
            servers.put(id, server);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("udp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void stopServer(String id, Promise promise) {
        Log.d(NAME, "stopServer started for id: " + id);
        UDPServer server = servers.get(id);
        if (server == null) {
            promise.reject("udp.server.not-exists", "Server with this id does not exist");
            return;
        }
        try {
            server.stop();
            servers.remove(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("udp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void send(String serverId, String host, int port, String message, Promise promise) {
        Log.d(NAME, "send started for server: " + serverId);
        UDPServer server = servers.get(serverId);
        if (server == null) {
            promise.reject("udp.server.not-exists", "Server with this id does not exist");
            return;
        }
        try {
            server.send(host, port, message);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("udp.server.error", e.getMessage());
        }
    }


    @Override
    public void invalidate() {
        Log.d(NAME, "invalidate - number of servers: " + servers.size());
        for (Map.Entry<String, UDPServer> entry : servers.entrySet()) {
            try {
                entry.getValue().stop();
            } catch (Exception e) {
                Log.e(NAME, "invalidate - failed to stop server: " + entry.getKey(), e);
            }
        }
        servers.clear();
        super.invalidate();
    }
}
