package com.reactnativelocalserver.utils;

import android.content.Context;
import android.net.nsd.NsdManager;

import com.facebook.react.bridge.ReactApplicationContext;

public class NsdManagerFactory {
    private final ReactApplicationContext applicationContext;

    public NsdManagerFactory(ReactApplicationContext applicationContext) {
        this.applicationContext = applicationContext;
    }

    public NsdManager of() {
        return (NsdManager) applicationContext.getApplicationContext().getSystemService(Context.NSD_SERVICE);
    }
}
