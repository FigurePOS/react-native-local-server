package com.reactnativelocalserver;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class NativeTCPClientModuleSpec extends ReactContextBaseJavaModule {
    public static final String NAME = "TCPClientModule";

    public NativeTCPClientModuleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public abstract void createClient(String id, String host, double port, Promise promise);
    public abstract void createClientFromDiscovery(String id, String discoveryGroup, String discoveryName, Promise promise);
    public abstract void stopClient(String id, String reason, Promise promise);
    public abstract void send(String clientId, String message, Promise promise);
    public abstract void addListener(String eventType);
    public abstract void removeListeners(double count);
}
