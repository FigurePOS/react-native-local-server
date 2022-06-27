package com.reactnativelocalserver.tcp;

import android.util.Log;

import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.TCPServerEventName;
import com.reactnativelocalserver.utils.SocketWrapper;

import java.io.IOException;
import java.net.Socket;
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

    public void stop() {
        Log.d(TAG, "stop: " + id);
        try {
            socket.close();
        } catch (IOException e) {
            Log.e(TAG, "stop error: " + id, e);
        }
    }

    private void cleanUp() {
        Log.d(TAG, "clean up: " + id);
        thread.interrupt();
        thread = null;
        runnable = null;
        socket = null;
        handleLifecycleEvent(TCPServerEventName.ConnectionClosed);
    }

    private void handleMessageReceived(String message) {
        JSEvent event = new JSEvent(TCPServerEventName.MessageReceived);
        event.putString("serverId", serverId);
        event.putString("connectionId", id);
        event.putString("message", message);
        this.eventEmitter.emitEvent(event);
    }

    private void handleLifecycleEvent(String eventName) {
        JSEvent event = new JSEvent(eventName);
        event.putString("serverId", serverId);
        event.putString("connectionId", id);
        this.eventEmitter.emitEvent(event);
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(TCPServerEventName.Ready);
            try {
                while (true) {
                    String messageFromServer = socket.read();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + id);
                        throw new InterruptedException();
                    }
                    if (messageFromServer != null) {
                        Log.d(TAG, "received message: " + id + "\n\tmessage: " + messageFromServer);
                        handleMessageReceived(messageFromServer);
                    }
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run: " + id, e);
            } finally {
                cleanUp();
            }
        }
    }
}
