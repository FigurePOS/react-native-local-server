package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.SocketWrapper;
import com.reactnativelocalserver.utils.TCPClientEventName;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

public class ClientConnection {
    private static final String TAG = "TCPClientConnection";
    private final String clientId;
    private final String host;
    private final int port;
    private final EventEmitter eventEmitter;

    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;

    public ClientConnection(String clientId, String host, int port, EventEmitter eventEmitter) {
        this.clientId = clientId;
        this.host = host;
        this.port = port;
        this.eventEmitter = eventEmitter;
    }

    public void start() throws Exception {
        Log.d(TAG, "start: " + clientId);
        if (runnable != null) {
            // TODO throw error
            return;
        }
        try {
            InetAddress serverAddress = InetAddress.getByName(host);
            socket = new SocketWrapper(new Socket(serverAddress, port));
        } catch (UnknownHostException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        runnable = new TCPRunnable();
        thread = new Thread(runnable, "com.react-native-messaging.client." + clientId);
        thread.start();
    }

    public void send(String data) throws Exception {
        Log.d(TAG, "send: " + clientId + "\n\tdata: " + data);
        socket.write(data);
    }

    public void stop() throws Exception {
        Log.d(TAG, "stop: " + clientId);
        try {
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void cleanUp() {
        Log.d(TAG, "clean up: " + clientId);
        thread.interrupt();
        thread = null;
        runnable = null;
        socket = null;
        handleLifecycleEvent(TCPClientEventName.Stopped);
    }

    private void handleLifecycleEvent(String eventName) {
        JSEvent event = new JSEvent(eventName);
        event.putString("clientId", clientId);
        this.eventEmitter.emitEvent(event);
    }

    private void handleDataReceived(String data) {
        JSEvent event = new JSEvent(TCPClientEventName.DataReceived);
        event.putString("clientId", clientId);
        event.putString("data", data);
        this.eventEmitter.emitEvent(event);
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(TCPClientEventName.Ready);
            try {
                while (true) {
                    String dataFromServer = socket.read();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + clientId);
                    }
                    if (dataFromServer != null) {
                        Log.d(TAG, "received data on: " + clientId + "\n\tdata: " + dataFromServer);
                        handleDataReceived(dataFromServer);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run 2", e);
            } finally {
                cleanUp();
            }
        }
    }
}
