package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.SocketWrapper;
import com.reactnativelocalserver.utils.TCPServerEventName;

import java.io.IOException;
import java.net.Socket;
import java.net.SocketException;
import java.util.UUID;

public class ServerConnection {
    private static final String TAG = "TCPServerConnection";
    private final String serverId;
    private final String id;
    private final EventEmitter eventEmitter;

    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;

    public ServerConnection(String serverId, EventEmitter eventEmitter) {
        this.serverId = serverId;
        this.eventEmitter = eventEmitter;
        this.id = UUID.randomUUID().toString();
    }

    public String getId() {
        return this.id;
    }

    public void send(String data) {
        if (runnable == null) {
            // TODO throw err
            return;
        }
        socket.write(data);
    }

    public void start(Socket socket) throws IOException {
        Log.d(TAG, "start: " + id);
        if (runnable != null) {
            // TODO throw error
            return;
        }
        this.socket = new SocketWrapper(socket);
        runnable = new TCPRunnable();
        thread = new Thread(runnable, "com.react-native-messaging.server-connection." + id);
        thread.start();
    }

    public void stop() throws Exception {
        Log.d(TAG, "stop: " + id);
        try {
            socket.close();
        } catch (IOException e) {
            Log.e(TAG, "stop error: " + id, e);
            throw new Exception("Failed to stop connection", e);
        }
    }

    private void cleanUp(String reason) {
        Log.d(TAG, "clean up: " + id);
        if (thread != null && !thread.isInterrupted()) {
            thread.interrupt();
        }
        thread = null;
        runnable = null;
        socket = null;
        handleLifecycleEvent(TCPServerEventName.ConnectionClosed, reason);
    }

    private void handleDataReceived(String data) {
        JSEvent event = new JSEvent(TCPServerEventName.DataReceived);
        event.putString("serverId", serverId);
        event.putString("connectionId", id);
        event.putString("data", data);
        this.eventEmitter.emitEvent(event);
    }

    private void handleLifecycleEvent(String eventName) {
        handleLifecycleEvent(eventName, null);
    }

    private void handleLifecycleEvent(String eventName, String reason) {
        JSEvent event = new JSEvent(eventName);
        event.putString("serverId", serverId);
        event.putString("connectionId", id);
        if (reason != null) {
            event.putString("reason", reason);
        }
        this.eventEmitter.emitEvent(event);
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(TCPServerEventName.ConnectionReady);
            try {
                while (true) {
                    String dataFromServer = socket.read();
                    if (dataFromServer == null) {
                        throw new SocketException("Connection closed by peer");
                    }
                    Log.d(TAG, "received data: " + id + "\n\tdata: " + dataFromServer);
                    handleDataReceived(dataFromServer);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run: " + id, e);
                cleanUp(e.getMessage());
            }
        }
    }
}
