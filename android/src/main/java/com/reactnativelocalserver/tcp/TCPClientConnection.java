package com.reactnativelocalserver.tcp;

import android.os.Build;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.SocketWrapper;
import com.reactnativelocalserver.utils.StopReasonEnum;
import com.reactnativelocalserver.utils.TCPClientEventName;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.SocketException;
import java.util.function.Consumer;

public class TCPClientConnection {
    private static final String TAG = "TCPClientConnection";
    private final String clientId;
    private final String host;
    private final int port;
    private final EventEmitter eventEmitter;

    private Consumer<String> onConnectionClosed;
    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;
    private String lastStopReason = null;

    public TCPClientConnection(String clientId, String host, int port, EventEmitter eventEmitter) {
        this.clientId = clientId;
        this.host = host;
        this.port = port;
        this.eventEmitter = eventEmitter;
    }

    public void start() throws Exception {
        Log.d(TAG, "start: " + clientId);
        if (runnable != null) {
            throw new Exception("Connection is already running");
        }
        InetAddress serverAddress = InetAddress.getByName(host);
        socket = new SocketWrapper(new Socket(serverAddress, port));
        runnable = new TCPRunnable();
        thread = new Thread(runnable, "com.react-native-messaging.tcp.client." + clientId);
        thread.start();
    }

    public void send(String data) throws Exception {
        Log.d(TAG, "send: " + clientId + "\n\tdata: " + data);
        if (runnable == null) {
            throw new Exception("Connection closed");
        }
        socket.write(data);
    }

    public void stop(String reason) throws Exception {
        Log.d(TAG, "stop: " + clientId);
        try {
            lastStopReason = reason;
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void handleLifecycleEvent(String eventName) {
        handleLifecycleEvent(eventName, null);
    }

    private void handleLifecycleEvent(String eventName, String reason) {
        JSEvent event = new JSEvent(eventName);
        event.putString("clientId", clientId);
        if (reason != null) {
            event.putString("reason", reason);
        }
        this.eventEmitter.emitEvent(event);
    }

    private void handleDataReceived(String data) {
        JSEvent event = new JSEvent(TCPClientEventName.DataReceived);
        event.putString("clientId", clientId);
        event.putString("data", data);
        this.eventEmitter.emitEvent(event);
    }

    @RequiresApi(api = Build.VERSION_CODES.N)
    private void cleanUp(String reason) {
        Log.d(TAG, "clean up: " + clientId);
        if (thread != null && !thread.isInterrupted()) {
            thread.interrupt();
        }
        String reasonToStop = lastStopReason != null ? lastStopReason : reason;
        thread = null;
        runnable = null;
        socket = null;
        lastStopReason = null;
        handleLifecycleEvent(TCPClientEventName.Stopped, reasonToStop);
        if (onConnectionClosed != null) {
            onConnectionClosed.accept(clientId);
        }
    }

    public void setOnConnectionClosed(Consumer<String> onConnectionClosed) {
        this.onConnectionClosed = onConnectionClosed;
    }

    public class TCPRunnable implements Runnable {
        @RequiresApi(api = Build.VERSION_CODES.N)
        @Override
        public void run() {
            handleLifecycleEvent(TCPClientEventName.Ready);
            try {
                while (true) {
                    String dataFromServer = socket.read();
                    if (dataFromServer == null) {
                        throw new SocketException(StopReasonEnum.ClosedByPeer);
                    }
                    Log.d(TAG, "received data on: " + clientId + "\n\tdata: " + dataFromServer);
                    handleDataReceived(dataFromServer);
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run", e);
                cleanUp(e.getMessage());
            }
        }
    }
}
