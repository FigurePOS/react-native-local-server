package com.reactnativelocalserver;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.udp.factory.UDPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class LocalServerPackage implements ReactPackage {

    private TCPClientFactory tcpClientFactory = new TCPClientFactory();
    private TCPServerFactory tcpServerFactory = new TCPServerFactory();
    private UDPServerFactory udpServerFactory = new UDPServerFactory();
    private EventEmitter eventEmitter;

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        eventEmitter = new EventEmitter(reactContext);
        modules.add(new TCPClientModule(reactContext, eventEmitter, tcpClientFactory));
        modules.add(new TCPServerModule(reactContext, eventEmitter, tcpServerFactory));
        modules.add(new UDPServerModule(reactContext, eventEmitter, udpServerFactory));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
