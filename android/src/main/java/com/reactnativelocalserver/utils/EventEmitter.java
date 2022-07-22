package com.reactnativelocalserver.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Map;

public class EventEmitter {
    private final ReactApplicationContext reactContext;

    public EventEmitter(ReactApplicationContext reactContext) {
        this.reactContext = reactContext;
    }

    public void emitEvent(JSEvent event) {
        WritableMap body = Arguments.createMap();
        for (Map.Entry<String, String> entry : event.getBody().entrySet()) {
            body.putString(entry.getKey(), entry.getValue());
        }
        this
            .reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(event.getName(), body);
    }
}
