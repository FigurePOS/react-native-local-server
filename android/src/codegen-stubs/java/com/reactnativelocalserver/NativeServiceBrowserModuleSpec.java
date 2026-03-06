package com.reactnativelocalserver;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;

public abstract class NativeServiceBrowserModuleSpec extends ReactContextBaseJavaModule {
    public static final String NAME = "ServiceBrowserModule";

    public NativeServiceBrowserModuleSpec(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public abstract void createBrowser(String id, String discoveryGroup, Promise promise);
    public abstract void stopBrowser(String id, Promise promise);

    protected void emitOnStarted(WritableMap value) {}
    protected void emitOnStopped(WritableMap value) {}
    protected void emitOnServiceFound(WritableMap value) {}
    protected void emitOnServiceLost(WritableMap value) {}
}
