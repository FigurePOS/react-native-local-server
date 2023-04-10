package com.reactnativelocalserver.tcp;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;

import com.reactnativelocalserver.utils.EventHandler;
import com.reactnativelocalserver.utils.TCPServerEventName;

public class TCPServerDiscovery {
    private static final String TAG = "TCPServerDiscovery";
    private final NsdServiceInfo config;
    private final EventHandler eventHandler;
    private RegistrationHandler listener;

    public TCPServerDiscovery(NsdServiceInfo config, EventHandler eventHandler) {
        this.config = config;
        this.eventHandler = eventHandler;
    }

    public void register(NsdManager nsdManager) {
        if (listener != null) {
            Log.d(TAG, "register - already registered");
            return;
        }
        if (this.config == null) {
            Log.e(TAG, "register - missing config");
            return;
        }
        listener = new RegistrationHandler();
        nsdManager.registerService(this.config, NsdManager.PROTOCOL_DNS_SD, listener);
    }

    public void unregister(NsdManager nsdManager) {
        if (listener == null) {
            Log.d(TAG, "unregister - not registered");
            return;
        }
        nsdManager.unregisterService(listener);
    }
    public void setPort(int port) {
        if (this.config == null) {
            return;
        }
        this.config.setPort(port);
    }

    class RegistrationHandler implements NsdManager.RegistrationListener {

        @Override
        public void onRegistrationFailed(NsdServiceInfo nsdServiceInfo, int i) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistrationFailed, "Error Code: " + i);
        }

        @Override
        public void onUnregistrationFailed(NsdServiceInfo nsdServiceInfo, int i) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryUnregistrationFailed, "Error Code: " + i);
        }

        @Override
        public void onServiceRegistered(NsdServiceInfo nsdServiceInfo) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistered);
        }

        @Override
        public void onServiceUnregistered(NsdServiceInfo nsdServiceInfo) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryUnregistered);
        }
    }
}
