package com.reactnativelocalserver.service.browser;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.NsdManagerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

@RequiresApi(api = Build.VERSION_CODES.N)
public class ServiceBrowser {

    private final String id;
    private final NsdManagerFactory nsdManagerFactory;
    private final String group;
    private final EventEmitter eventEmitter;
    private final Map<String, NsdServiceInfo> services = new HashMap<>();
    private Listener listener;
    private Consumer<Boolean> onStarted;
    private Consumer<Boolean> onStopped;

    public ServiceBrowser(String id, NsdManagerFactory nsdManagerFactory, EventEmitter eventEmitter, String group) {
        this.id = id;
        this.nsdManagerFactory = nsdManagerFactory;
        this.eventEmitter = eventEmitter;
        this.group = group;
    }

    public String getName() {
        return "ServiceBrowser";
    }

    public void start(Consumer<Boolean> onStarted) {
        Log.d(getName(), "start");
        listener = new Listener();
        this.onStarted = onStarted;
        nsdManagerFactory.of().discoverServices(group, NsdManager.PROTOCOL_DNS_SD, listener);
    }

    public void stop(Consumer<Boolean> onStopped) {
        Log.d(getName(), "stop");
        this.onStopped = onStopped;
        if (listener == null) {
            onStopped.accept(false);
            return;
        }
        nsdManagerFactory.of().stopServiceDiscovery(listener);
    }

    protected void handleLifecycleEvent(String eventName) {
        handleLifecycleEvent(eventName, null);
    }

    protected void handleLifecycleEvent(String eventName, String reason) {
        JSEvent event = new JSEvent(eventName);
        event.putString("browserId", id);
        if (reason != null) {
            event.putString("reason", reason);
        }
        this.eventEmitter.emitEvent(event);
    }

    protected void handleServiceLifecycleEvent(String eventName, NsdServiceInfo nsdServiceInfo) {
        JSEvent event = new JSEvent(eventName);
        event.putString("browserId", id);
        if (nsdServiceInfo != null) {
            event.putString("name", nsdServiceInfo.getServiceName());
            event.putString("group", nsdServiceInfo.getServiceType());
        }
        this.eventEmitter.emitEvent(event);
    }

    class Listener implements NsdManager.DiscoveryListener {
        @Override
        public void onDiscoveryStarted(String s) {
            Log.d(getName(), "onDiscoveryStarted");
            if (onStarted != null) {
                onStarted.accept(true);
                onStarted = null;
            }
            handleLifecycleEvent(ServiceBrowserEventName.Started);
        }

        @Override
        public void onStartDiscoveryFailed(String s, int i) {
            Log.d(getName(), "onStartDiscoveryFailed");
            if (onStarted != null) {
                onStarted.accept(false);
                onStarted = null;
            }
        }

        @Override
        public void onDiscoveryStopped(String s) {
            Log.d(getName(), "onDiscoveryStopped");
            if (onStopped != null) {
                onStopped.accept(false);
                onStopped = null;
            }
            handleLifecycleEvent(ServiceBrowserEventName.Stopped);
        }

        @Override
        public void onStopDiscoveryFailed(String s, int i) {
            Log.d(getName(), "onStopDiscoveryFailed");
            if (onStopped != null) {
                onStopped.accept(false);
                onStopped = null;
            }
        }

        @Override
        public void onServiceFound(NsdServiceInfo nsdServiceInfo) {
            Log.d(getName(), "onServiceFound " + nsdServiceInfo.getServiceName());
            services.put(nsdServiceInfo.getServiceName(), nsdServiceInfo);
            handleServiceLifecycleEvent(ServiceBrowserEventName.ServiceFound, nsdServiceInfo);
        }

        @Override
        public void onServiceLost(NsdServiceInfo nsdServiceInfo) {
            Log.d(getName(), "onServiceLost " + nsdServiceInfo.getServiceName());
            handleServiceLifecycleEvent(ServiceBrowserEventName.ServiceLost, nsdServiceInfo);
            services.remove(nsdServiceInfo.getServiceName());
        }
    }
}