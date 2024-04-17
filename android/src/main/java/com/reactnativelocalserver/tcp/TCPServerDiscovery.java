package com.reactnativelocalserver.tcp;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;

import com.github.druk.dnssd.DNSSD;
import com.github.druk.dnssd.DNSSDRegistration;
import com.github.druk.dnssd.DNSSDService;
import com.github.druk.dnssd.RegisterListener;
import com.reactnativelocalserver.utils.EventHandler;
import com.reactnativelocalserver.utils.TCPServerEventName;

public class TCPServerDiscovery {
    private static final String TAG = "TCPServerDiscovery";
    private final NsdServiceInfo config;
    private final EventHandler eventHandler;
    private RegistrationHandler listener;

    private DNSSDService dnssdService;

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

    public void register(DNSSD dnssd) {
        if (listener != null) {
            Log.d(TAG, "register - already registered");
            return;
        }
        if (this.config == null) {
            Log.e(TAG, "register - missing config");
            return;
        }
        try {
            this.dnssdService = dnssd.register(this.config.getServiceName(), this.config.getServiceType(), this.config.getPort(), new DNSSDRegistrationListener());
        } catch (Exception e) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistrationFailed, "Error: " + e.getMessage());
        }
    }

    public void unregister(NsdManager nsdManager) {
        if (listener == null) {
            Log.d(TAG, "unregister - not registered");
            return;
        }
        nsdManager.unregisterService(listener);
    }

    public void unregister() {
        if (dnssdService == null) {
            Log.d(TAG, "unregister - not registered");
            return;
        }
        dnssdService.stop();
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

    class DNSSDRegistrationListener implements RegisterListener {
        @Override
        public void serviceRegistered(DNSSDRegistration registration, int flags, String serviceName, String regType, String domain) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistered);
        }

        @Override
        public void operationFailed(DNSSDService service, int errorCode) {

        }
    }
}
