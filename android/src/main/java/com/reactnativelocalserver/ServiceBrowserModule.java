package com.reactnativelocalserver;

import android.content.Context;
import android.net.nsd.NsdManager;
import android.os.Build;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.service.browser.ServiceBrowser;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.HashMap;
import java.util.Map;

@RequiresApi(api = Build.VERSION_CODES.N)
@ReactModule(name = ServiceBrowserModule.NAME)
public class ServiceBrowserModule extends ReactContextBaseJavaModule {
    public static final String NAME = "ServiceBrowserModule";

    private final EventEmitter eventEmitter;
    private final Map<String, ServiceBrowser> browsers;
    private final ReactApplicationContext reactApplicationContext;

    public ServiceBrowserModule(ReactApplicationContext reactContext, EventEmitter eventEmitter) {
        super(reactContext);
        this.reactApplicationContext = reactContext;
        this.eventEmitter = eventEmitter;
        this.browsers = new HashMap<>();
    }

    @NonNull
    @Override
    public String getName() {
        return this.NAME;
    }

    @ReactMethod
    public void createBrowser(String id, String discoveryGroup, Promise promise) {
        Log.d(NAME, "createBrowser started for id: " + id);
        if (browsers.get(id) != null) {
            promise.reject("service.browser.already-exists", "Browser with this id already exists");
            return;
        }
        try {
            NsdManager manager = (NsdManager) reactApplicationContext.getApplicationContext().getSystemService(Context.NSD_SERVICE);
            ServiceBrowser browser = new ServiceBrowser(id, manager, eventEmitter, discoveryGroup);
            browsers.put(id, browser);
            browser.start(promise::resolve);
        } catch (Exception e) {
            promise.reject("service.browser.error", e.getMessage());
        }
    }

    @ReactMethod
    public void stopBrowser(String id, Promise promise) {
        Log.d(NAME, "createBrowser started for id: " + id);
        ServiceBrowser browser = browsers.get(id);
        if (browser == null) {
            promise.reject("service.browser.not-exists", "Browser with this id does not exist");
            return;
        }
        try {
            browsers.remove(id);
            browser.stop(promise::resolve);
        } catch (Exception e) {
            promise.reject("service.browser.error", e.getMessage());
        }
    }

    @Override
    public void invalidate() {
        Log.d(NAME, "invalidate");
        for (Map.Entry<String, ServiceBrowser> entry : browsers.entrySet()) {
            try {
                entry.getValue().stop(r -> {
                });
            } catch (Exception e) {
                Log.e(NAME, "invalidate - failed to stop browser: " + entry.getKey(), e);
            }
        }
        browsers.clear();
        super.invalidate();
    }
}
