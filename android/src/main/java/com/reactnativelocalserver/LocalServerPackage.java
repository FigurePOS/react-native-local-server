package com.reactnativelocalserver;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativelocalserver.tcp.factory.ClientFactory;
import com.reactnativelocalserver.tcp.factory.ServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LocalServerPackage implements ReactPackage {

    private ClientFactory clientFactory = new ClientFactory();
    private ServerFactory serverFactory = new ServerFactory();
    private EventEmitter eventEmitter;

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        eventEmitter = new EventEmitter(reactContext);
        modules.add(new TCPClientModule(reactContext, eventEmitter, clientFactory));
        modules.add(new TCPServerModule(reactContext, eventEmitter, serverFactory));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
