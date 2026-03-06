package com.reactnativelocalserver;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;

public abstract class NativeTCPServerModuleSpec extends ReactContextBaseJavaModule {
    public static final String NAME = "TCPServerModule";

    public NativeTCPServerModuleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public abstract void createServer(String id, double port, @Nullable String discoveryGroup, @Nullable String discoveryName, Promise promise);
    public abstract void stopServer(String id, String reason, Promise promise);
    public abstract void send(String serverId, String connectionId, String message, Promise promise);
    public abstract void closeConnection(String serverId, String connectionId, String reason, Promise promise);
    public abstract void getConnectionIds(String serverId, Promise promise);
    public abstract void getLocalIpAddress(Promise promise);

    protected void emitOnReady(WritableMap value) {}
    protected void emitOnStopped(WritableMap value) {}
    protected void emitOnConnectionAccepted(WritableMap value) {}
    protected void emitOnConnectionReady(WritableMap value) {}
    protected void emitOnConnectionClosed(WritableMap value) {}
    protected void emitOnDataReceived(WritableMap value) {}
}
