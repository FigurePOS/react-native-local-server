package com.reactnativelocalserver;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public abstract class NativeUDPServerModuleSpec extends ReactContextBaseJavaModule {
    public static final String NAME = "UDPServerModule";

    public NativeUDPServerModuleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public abstract void createServer(String id, double port, double numberOfDroppedBytesFromMsgStart, Promise promise);
    public abstract void stopServer(String id, String reason, Promise promise);
    public abstract void send(String host, double port, String message, Promise promise);
    public abstract void addListener(String eventType);
    public abstract void removeListeners(double count);
}
