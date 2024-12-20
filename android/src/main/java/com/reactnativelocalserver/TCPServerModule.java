package com.reactnativelocalserver;

import android.content.Context;
import android.net.nsd.NsdServiceInfo;
import android.net.wifi.WifiInfo;
import android.net.wifi.WifiManager;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;
import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.NsdManagerFactory;
import com.reactnativelocalserver.utils.NsdServiceInfoFactory;
import com.reactnativelocalserver.utils.StopReasonEnum;

import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@ReactModule(name = TCPServerModule.NAME)
public class TCPServerModule extends ReactContextBaseJavaModule {
    public static final String NAME = "TCPServerModule";

    private final EventEmitter eventEmitter;
    private final TCPServerFactory serverFactory;
    private final NsdManagerFactory nsdManagerFactory;
    private final Map<String, TCPServer> servers = new HashMap();
    private final ReactApplicationContext reactApplicationContext;

    private final boolean useJmDNS;

    public TCPServerModule(ReactApplicationContext reactContext, EventEmitter eventEmitter, TCPServerFactory serverFactory, NsdManagerFactory nsdManagerFactory) {
        this(reactContext, eventEmitter, serverFactory, nsdManagerFactory, false);
    }

    public TCPServerModule(ReactApplicationContext reactContext, EventEmitter eventEmitter, TCPServerFactory serverFactory, NsdManagerFactory nsdManagerFactory, boolean useJmDNS) {
        super(reactContext);
        this.reactApplicationContext = reactContext;
        this.eventEmitter = eventEmitter;
        this.serverFactory = serverFactory;
        this.nsdManagerFactory = nsdManagerFactory;
        this.useJmDNS = useJmDNS;
    }

    public Map<String, TCPServer> getServers() {
        return servers;
    }

    @Override
    @NonNull
    public String getName() {
        return NAME;
    }

    public void createServer(String id, int port, Promise promise) {
        createServer(id, port, null, null, promise);
    }

    @ReactMethod
    public void createServer(String id, int port, String discoveryGroup, String discoveryName, Promise promise) {
        Log.d(NAME, "createServer started for id: " + id);
        if (servers.get(id) != null) {
            promise.reject("tcp.server.already-exists", "Server with this id already exists");
            return;
        }
        NsdServiceInfo discoveryConfig = NsdServiceInfoFactory.of(discoveryName, discoveryGroup, port);
        try {
            TCPServer server = serverFactory.of(id, port, discoveryConfig, true, eventEmitter);
            server.start(nsdManagerFactory.of());
            servers.put(id, server);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void stopServer(String id, String reason, Promise promise) {
        Log.d(NAME, "stopServer started for id: " + id);
        TCPServer server = servers.get(id);
        if (server == null) {
            promise.reject("tcp.server.not-exists", "Server with this id does not exist");
            return;
        }
        try {
            server.stop(reason);
            servers.remove(id);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void send(String serverId, String connectionId, String message, Promise promise) {
        Log.d(NAME, "send started for server: " + serverId);
        TCPServer server = servers.get(serverId);
        if (server == null) {
            promise.reject("tcp.server.not-exists", "Server with this id does not exist");
            return;
        }
        try {
            server.send(connectionId, message);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void closeConnection(String serverId, String connectionId, String reason, Promise promise) {
        Log.d(NAME, "close connection started for server: " + serverId);
        TCPServer server = servers.get(serverId);
        if (server == null) {
            promise.reject("tcp.server.not-exists", "Server with this id does not exist");
            return;
        }
        try {
            server.closeConnection(connectionId, reason);
            promise.resolve(true);
        } catch (Exception e) {
            promise.reject("tcp.server.error", e.getMessage());
        }
    }

    @ReactMethod
    public void getConnectionIds(String serverId, Promise promise) {
        Log.d(NAME, "get connection ids for server: " + serverId);
        TCPServer server = servers.get(serverId);
        if (server == null) {
            promise.reject("tcp.server.not-exists", "Server with this id does not exist");
            return;
        }
        Set<String> ids = server.getConnectionIds();
        promise.resolve(ids);
    }

    @ReactMethod
    public void getLocalIpAddress(final Promise promise) throws Exception {
        Log.d(NAME, "getLocalIpAddress");
        new Thread(new Runnable() {
            public void run() {
                try {
                    WifiManager manager = (WifiManager) reactApplicationContext.getApplicationContext().getSystemService(Context.WIFI_SERVICE);
                    if (manager == null) {
                        promise.resolve(null);
                        return;
                    }
                    WifiInfo info = manager.getConnectionInfo();
                    String ipAddress = InetAddress.getByAddress(
                            ByteBuffer
                                    .allocate(4)
                                    .order(ByteOrder.LITTLE_ENDIAN)
                                    .putInt(info.getIpAddress())
                                    .array())
                            .getHostAddress();
                    Log.d(NAME, "getLocalIpAddress: " + ipAddress);
                    promise.resolve(ipAddress);
                } catch (Exception e) {
                    promise.reject("tcp.server.error", e.getMessage());
                }
            }
        }).start();
    }

    @Override
    public void invalidate() {
        Log.d(NAME, "invalidate - number of servers: " + servers.size());
        for (Map.Entry<String, TCPServer> entry : servers.entrySet()) {
            try {
                entry.getValue().stop(StopReasonEnum.Invalidation);
            } catch (Exception e) {
                Log.e(NAME, "invalidate - failed to stop server: " + entry.getKey(), e);
            }
        }
        servers.clear();
        super.invalidate();
    }
}
