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

/**
 * TCPServerDiscovery
 * This class is responsible for registering and unregistering the server with the network service discovery manager.
 * Currently, it supports both NsdManager and DNSSD.
 * We had to switch to DNSSD because NsdManager was having following issue:
 * - The service was registered and discoverable fine on iOS devices.
 * - But when the iOS device tried to connect to the service, it was getting stuck in preparing state.
 * - In logs of the Android device we found following error:
 *   Error parsing mDNSpacket, Failed to read NSEC record from mDNS response, Invalid label pointer: 00F2
 */
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

    /**
     * Register the server with the system NsdManager.
     */
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

    /**
     * Register the server with the DNSSD.
     */
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

    /**
     * Unregister the server from the system NsdManager.
     */
    public void unregister(NsdManager nsdManager) {
        if (listener == null) {
            Log.d(TAG, "unregister - not registered");
            return;
        }
        nsdManager.unregisterService(listener);
    }

    /**
     * Unregister the server from the DNSSD.
     */
    public void unregister(DNSSD dnssd) {
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

    /**
     * Registration listener for NsdManager.
     */
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

    /**
     * Registration listener for DNSSD.
     */
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
