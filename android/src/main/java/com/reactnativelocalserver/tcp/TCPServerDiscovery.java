package com.reactnativelocalserver.tcp;

import android.net.nsd.NsdManager;
import android.net.nsd.NsdServiceInfo;
import android.util.Log;

import com.reactnativelocalserver.utils.EventHandler;
import com.reactnativelocalserver.utils.TCPServerEventName;

import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.SocketException;
import java.util.Collections;

import javax.jmdns.JmDNS;
import javax.jmdns.ServiceInfo;

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

    private JmDNS jmdns;
    private ServiceInfo serviceInfo;

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
     * Register the server with the JmDNS.
     */
    public void register() {
        if (listener != null) {
            Log.d(TAG, "register - already registered");
            return;
        }
        if (this.config == null) {
            Log.e(TAG, "register - missing config");
            return;
        }
        try {
            Log.d(TAG, "register - starting registration " + this.config.getServiceName() + ", " + this.config.getServiceType());
            // Create a JmDNS instance
            InetAddress address = localIpv4Addr();
            jmdns = JmDNS.create(address != null ? address : InetAddress.getLocalHost());
            // Register a service
            serviceInfo = ServiceInfo.create(this.config.getServiceType() + ".", this.config.getServiceName(), this.config.getPort(), this.config.getServiceName());

            jmdns.registerService(serviceInfo);
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistered);
        } catch (Exception e) {
            eventHandler.handleLifecycleEvent(TCPServerEventName.DiscoveryRegistrationFailed, "Error: " + e.getMessage());
            Log.e(TAG, "register - error", e);
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
     * Unregister the server from the JmDNS.
     */
    public void unregister() {
        if (jmdns == null || serviceInfo == null) {
            Log.d(TAG, "unregister - not registered");
            return;
        }
        jmdns.unregisterService(serviceInfo);
    }

    public void setPort(int port) {
        if (this.config == null) {
            return;
        }
        this.config.setPort(port);
    }

    private Inet4Address localIpv4Addr() {
        try {
            for (NetworkInterface intf : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!intf.isUp() || intf.isLoopback() || intf.isPointToPoint())
                    continue;
                if (intf.getName().startsWith("p2p")) // p2p-wlan0, p2p-p2p0-0
                    continue;
                if (intf.getName().startsWith("dummy") || intf.getName().startsWith("rmnet"))
                    continue;
                for (InetAddress inetAddress : Collections.list(intf.getInetAddresses())) {
                    if (inetAddress instanceof Inet4Address) {
                        return (Inet4Address) inetAddress;
                    }
                }
            }
        } catch (SocketException ex) {
            Log.e("helpers", "Inet4Address Lookup Failed", ex);
        }
        return null;
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
}
