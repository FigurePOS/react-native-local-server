package com.reactnativelocalserver;

import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.messaging.Client;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@ReactModule(name = LocalMessagingClientModule.NAME)
public class LocalMessagingClientModule extends ReactContextBaseJavaModule {
    public static final String NAME = "LocalMessagingClient";

    private final Map<String, Client> clients = new HashMap();

    public LocalMessagingClientModule(ReactApplicationContext reactContext) {
        super(reactContext);
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
        Client client = new Client(id, host, port);
        client.start();
        clients.put(client.getId(), client);
        promise.resolve(true);
    }

    @ReactMethod
    public void stopClient(String id, Promise promise) {
        Log.d(NAME, "stopClient started for id:" + id);
        Client client = clients.get(id);
        if (client == null) {
            promise.reject("client.not-exists", "Client with this id does not exist");
            return;
        }
        client.stop();
        clients.remove(id);
        promise.resolve(true);
    }

    @ReactMethod
    public void send(String clientId, String message, Promise promise) {
        Log.d(NAME, "send started for client:" + clientId);
        Client client = clients.get(clientId);
        if (client == null) {
            promise.reject("client.not-exists", "Client with this id does not exist");
            return;
        }
        client.send(message);
        promise.resolve(true);
    }
}
