package com.reactnativelocalserver.utils;

import java.util.HashMap;
import java.util.Map;

public class JSEvent {
    private final String name;
    private final Map<String, String> body;

    public JSEvent(String name) {
        this.name = name;
        this.body = new HashMap();
        this.putString("type", name);
    }

    public String getName() {
        return name;
    }

    public Map<String, String> getBody() {
        return body;
    }

    public void putString(String key, String data) {
        body.put(key, data);
    }
    public void putInt(String key, int data) {
        body.put(key, String.valueOf(data));
    }
}
