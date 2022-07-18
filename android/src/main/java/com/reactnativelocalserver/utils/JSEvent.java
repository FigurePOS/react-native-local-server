package com.reactnativelocalserver.utils;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

public class JSEvent {
    private final String name;
    private final WritableMap body;

    public JSEvent(String name) {
        this.name = name;
        this.body = Arguments.createMap();
        this.putString("type", name);
    }

    public String getName() {
        return name;
    }

    public WritableMap getBody() {
        return body;
    }

    public void putString(String key, String data) {
        body.putString(key, data);
    }
}
