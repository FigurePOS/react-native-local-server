package com.reactnativelocalserver.messaging;

import android.util.Log;

import com.reactnativelocalserver.utils.SocketWrapper;

import java.io.IOException;
import java.net.Socket;
import java.util.UUID;

public class ServerConnection {
    private static final String TAG = "ServerConnection";
    private final String id;

    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;

    public ServerConnection() {
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
    }

    public class TCPRunnable implements Runnable {
        @Override
        public void run() {
            try {
                while (true) {
                    String messageFromServer = socket.read();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + id);
                        throw new InterruptedException();
                    }
                    if (messageFromServer != null) {
                        Log.d(TAG, "received message: " + id + "\n\tmessage: " + messageFromServer);
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
