package com.reactnativelocalserver.utils;

public interface EventHandler {
    void handleLifecycleEvent(String eventName);

    void handleLifecycleEvent(String eventName, String reason);
}
