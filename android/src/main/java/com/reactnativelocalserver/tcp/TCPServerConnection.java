package com.reactnativelocalserver.tcp;

import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.SocketWrapper;
import com.reactnativelocalserver.utils.StopReasonEnum;
import com.reactnativelocalserver.utils.TCPServerEventName;

import java.io.IOException;
import java.net.Socket;
import java.net.SocketException;
import java.util.UUID;
import java.util.function.Consumer;

public class TCPServerConnection {
    private static final String TAG = "TCPServerConnection";
    private final String serverId;
    private final String id;
    private final EventEmitter eventEmitter;

    private Consumer<String> onConnectionClosed;
    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;
    private String lastStopReason = null;

    public TCPServerConnection(String serverId, EventEmitter eventEmitter) {
        this.serverId = serverId;
        this.eventEmitter = eventEmitter;
        this.id = UUID.randomUUID().toString();
    }

    public String getId() {
        return this.id;
    }

    public void setOnConnectionClosed(Consumer<String> onConnectionClosed) {
        this.onConnectionClosed = onConnectionClosed;
    }

    public void send(String data) throws Exception {
        if (runnable == null) {
            throw new Exception("Connection is closed");
        }
        socket.write(data);
    }

    public void start(Socket socket) throws Exception {
        Log.d(TAG, "start: " + id);
        if (runnable != null) {
            throw new Exception("Connection is already running");
        }
        this.socket = new SocketWrapper(socket);
        runnable = new TCPRunnable();
        thread = new Thread(runnable, "com.react-native-messaging.tcp.server-connection." + id);
        thread.start();
    }

    public void stop(String reason) throws Exception {
        Log.d(TAG, "stop: " + id);
        try {
            lastStopReason = reason;
            socket.close();
        } catch (IOException e) {
            Log.e(TAG, "stop error: " + id, e);
            throw new Exception("Failed to stop connection", e);
        }
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    private void cleanUp(String reason) {
        Log.d(TAG, "clean up: " + id);
        if (thread != null && !thread.isInterrupted()) {
            thread.interrupt();
        }
        String reasonToStop = lastStopReason != null ? lastStopReason : reason;
        thread = null;
        runnable = null;
        socket = null;
        lastStopReason = null;
        handleLifecycleEvent(TCPServerEventName.ConnectionClosed, reasonToStop);
        if (onConnectionClosed != null) {
            onConnectionClosed.accept(id);
        }
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
        @RequiresApi(api = Build.VERSION_CODES.N)
        @Override
        public void run() {
            handleLifecycleEvent(TCPServerEventName.ConnectionReady);
            try {
                while (true) {
                    String dataFromClient = socket.read();
                    if (dataFromClient == null) {
                        throw new SocketException(StopReasonEnum.ClosedByPeer);
                    }
                    Log.d(TAG, "received data: " + id + "\n\tdata: " + dataFromClient);
                    handleDataReceived(dataFromClient);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run: " + id, e);
                cleanUp(e.getMessage());
            }
        }
    }
}
