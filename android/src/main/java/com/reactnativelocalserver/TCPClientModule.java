package com.reactnativelocalserver;

import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.tcp.Client;
import com.reactnativelocalserver.tcp.factory.ClientFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = TCPClientModule.NAME)
public class TCPClientModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TCPClientModule";

    private final ClientFactory clientFactory;

    private final EventEmitter eventEmitter;

    private final Map<String, Client> clients = new HashMap();

    public TCPClientModule(ReactApplicationContext reactContext, EventEmitter eventEmitter, ClientFactory clientFactory) {
        super(reactContext);
        this.eventEmitter = eventEmitter;
        this.clientFactory = clientFactory;
    }

    public Map<String, Client> getClients() {
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
            promise.reject("client.already-exists", "Client with this id already exists");
            return;
        }
        try {
            Client client = clientFactory.of(id, host, port, eventEmitter);
            client.start();
            clients.put(id, client);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("client.error", e);
        }
    }

    @ReactMethod
    public void stopClient(String id, Promise promise) {
        Log.d(NAME, "stopClient started for id:" + id);
        Client client = clients.get(id);
        if (client == null) {
            promise.reject("client.not-exists", "Client with this id does not exist");
            return;
        }
        try {
            client.stop();
            clients.remove(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("client.error", e);
        }
    }

    @ReactMethod
    public void send(String clientId, String message, Promise promise) {
        Log.d(NAME, "send started for client:" + clientId);
        Client client = clients.get(clientId);
        if (client == null) {
            promise.reject("client.not-exists", "Client with this id does not exist");
            return;
        }
        try {
            client.send(message);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("client.error", e);
        }
    }

    @Override
    public void invalidate() {
        Log.d(NAME, "invalidate - number of clients: " + clients.size());
        for (Map.Entry<String, Client> entry : clients.entrySet()) {
            try {
                entry.getValue().stop();
            } catch (Exception e) {
                Log.e(NAME, "invalidate - failed to stop client: " + entry.getKey(), e);
            }
        }
        clients.clear();
        super.invalidate();
    }
}
