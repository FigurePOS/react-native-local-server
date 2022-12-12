package com.reactnativelocalserver;

import android.os.Build;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.udp.factory.UDPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.NsdManagerFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RequiresApi(api = Build.VERSION_CODES.N)
public class LocalServerPackage implements ReactPackage {

    private TCPClientFactory tcpClientFactory = new TCPClientFactory();
    private TCPServerFactory tcpServerFactory = new TCPServerFactory();
    private UDPServerFactory udpServerFactory = new UDPServerFactory();
    private EventEmitter eventEmitter;
    private NsdManagerFactory nsdManagerFactory;

    @NonNull
    @Override
    public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        eventEmitter = new EventEmitter(reactContext);
        nsdManagerFactory = new NsdManagerFactory(reactContext);
        modules.add(new TCPClientModule(reactContext, eventEmitter, tcpClientFactory));
        modules.add(new TCPServerModule(reactContext, eventEmitter, tcpServerFactory, nsdManagerFactory));
        modules.add(new UDPServerModule(reactContext, eventEmitter, udpServerFactory));
        modules.add(new ServiceBrowserModule(reactContext, eventEmitter, nsdManagerFactory));
        return modules;
    }

    @NonNull
    @Override
    public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
