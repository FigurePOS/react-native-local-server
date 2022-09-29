package com.reactnativelocalserver.utils;

import android.net.nsd.NsdServiceInfo;

public class NsdServiceInfoFactory {
    public static NsdServiceInfo of(String name, String type, int port) {
        if (name == null || type == null) {
            return null;
        }
        NsdServiceInfo config = new NsdServiceInfo();
        config.setServiceType("_" + type + "._tcp");
        config.setServiceName(name);
        config.setPort(port);
        return config;
    }
}

