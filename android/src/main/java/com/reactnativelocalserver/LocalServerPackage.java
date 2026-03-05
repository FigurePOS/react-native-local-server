package com.reactnativelocalserver;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;

import com.facebook.react.TurboReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.model.ReactModuleInfo;
import com.facebook.react.module.model.ReactModuleInfoProvider;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.udp.factory.UDPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.NsdManagerFactory;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiresApi(api = Build.VERSION_CODES.N)
public class LocalServerPackage extends TurboReactPackage {

    private final TCPClientFactory tcpClientFactory = new TCPClientFactory();
    private final TCPServerFactory tcpServerFactory = new TCPServerFactory();
    private final UDPServerFactory udpServerFactory = new UDPServerFactory();

    @Nullable
    @Override
    public NativeModule getModule(@NonNull String name, @NonNull ReactApplicationContext reactContext) {
        EventEmitter eventEmitter = new EventEmitter(reactContext);
        NsdManagerFactory nsdManagerFactory = new NsdManagerFactory(reactContext);
        switch (name) {
            case TCPClientModule.NAME:
                return new TCPClientModule(reactContext, eventEmitter, tcpClientFactory);
            case TCPServerModule.NAME:
                return new TCPServerModule(reactContext, eventEmitter, tcpServerFactory, nsdManagerFactory, true);
            case UDPServerModule.NAME:
                return new UDPServerModule(reactContext, eventEmitter, udpServerFactory);
            case ServiceBrowserModule.NAME:
                return new ServiceBrowserModule(reactContext, eventEmitter, nsdManagerFactory);
            default:
                return null;
        }
    }

    @NonNull
    @Override
    public ReactModuleInfoProvider getReactModuleInfoProvider() {
        return () -> {
            Map<String, ReactModuleInfo> map = new HashMap<>();
            map.put(TCPClientModule.NAME, new ReactModuleInfo(
                    TCPClientModule.NAME, TCPClientModule.NAME,
                    false, false, false, true));
            map.put(TCPServerModule.NAME, new ReactModuleInfo(
                    TCPServerModule.NAME, TCPServerModule.NAME,
                    false, false, false, true));
            map.put(UDPServerModule.NAME, new ReactModuleInfo(
                    UDPServerModule.NAME, UDPServerModule.NAME,
                    false, false, false, true));
            map.put(ServiceBrowserModule.NAME, new ReactModuleInfo(
                    ServiceBrowserModule.NAME, ServiceBrowserModule.NAME,
                    false, false, false, true));
            return map;
        };
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
