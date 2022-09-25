package com.reactnativelocalserver;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.tcp.TCPClient;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import java.net.UnknownHostException;
import java.util.HashMap;
import java.util.Map;

@ReactModule(name = TCPClientModule.NAME)
public class TCPClientModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TCPClientModule";

    private final TCPClientFactory clientFactory;

    private final EventEmitter eventEmitter;

    private final Map<String, TCPClient> clients = new HashMap();

    public TCPClientModule(ReactApplicationContext reactContext, EventEmitter eventEmitter, TCPClientFactory clientFactory) {
        super(reactContext);
        this.eventEmitter = eventEmitter;
        this.clientFactory = clientFactory;
    }

    public Map<String, TCPClient> getClients() {
        return clients;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    @ReactMethod
    public void createClient(String id, String host, int port, Promise promise) {
        Log.d(NAME, "createClient started for id:" + id);
        if (clients.get(id) != null) {
            promise.reject("tcp.client.already-exists", "Client with this id already exists");
            return;
        }
        try {
            TCPClient client = clientFactory.of(id, host, port, eventEmitter);
            client.setOnConnectionClosed(this::onConnectionClosed);
            client.start();
            clients.put(id, client);
            promise.resolve(true);
        } catch (UnknownHostException e) {
            promise.reject("tcp.client.error", "unknown host: " + host);
        } catch (Exception e) {
            promise.reject("tcp.client.error", e.getMessage());
        }
    }

    @ReactMethod
    public void stopClient(String id, String reason, Promise promise) {
        Log.d(NAME, "stopClient started for id:" + id);
        TCPClient client = clients.get(id);
        if (client == null) {
            promise.reject("tcp.client.not-exists", "Client with this id does not exist");
            return;
        }
        try {
            client.stop(reason);
            clients.remove(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.client.error", e.getMessage());
        }
    }

    @ReactMethod
    public void send(String clientId, String message, Promise promise) {
        Log.d(NAME, "send started for client:" + clientId);
        TCPClient client = clients.get(clientId);
        if (client == null) {
            promise.reject("tcp.client.not-exists", "Client with this id does not exist");
            return;
        }
        try {
            client.send(message);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.client.error", e.getMessage());
        }
    }

    @Override
    public void invalidate() {
        Log.d(NAME, "invalidate - number of clients: " + clients.size());
        for (Map.Entry<String, TCPClient> entry : clients.entrySet()) {
            try {
                entry.getValue().stop(StopReasonEnum.Invalidation);
            } catch (Exception e) {
                Log.e(NAME, "invalidate - failed to stop client: " + entry.getKey(), e);
            }
        }
        clients.clear();
        super.invalidate();
    }

    private void onConnectionClosed(String clientId) {
        clients.remove(clientId);
    }
}
