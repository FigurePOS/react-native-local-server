package com.reactnativelocalserver.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;

public class EventEmitter {
    private final ReactApplicationContext reactContext;
    private EventHandler handler;

    public EventEmitter(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    public void setEventHandler(EventHandler handler) {
        this.handler = handler;
    }

    public void emitEvent(JSEvent event) {
        WritableMap body = Arguments.createMap();
        for (Map.Entry<String, String> entry : event.getBody().entrySet()) {
            body.putString(entry.getKey(), entry.getValue());
        }
        if (handler != null) {
            handler.handleEvent(event.getName(), body);
        }
        this
            .reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(event.getName(), body);
    }

    public interface EventHandler {
        void handleEvent(String name, WritableMap body);
    }
}
