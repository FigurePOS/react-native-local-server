package com.reactnativelocalserver.messaging;

import android.util.Log;

import com.reactnativelocalserver.utils.SocketWrapper;

import java.io.IOException;
import java.net.Socket;
import java.util.UUID;

public class ServerConnection {
    private static final String TAG = "ServerConnection";
    private final String id;

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
        runnable.send(data);
    }

    public void start(Socket socket) throws IOException {
        Log.d(TAG, "start");
        if (runnable != null) {
            // TODO throw error
            return;
        }
        SocketWrapper s = new SocketWrapper(socket);
        runnable = new TCPRunnable(s);
        thread = new Thread(runnable, "com.react-native-messaging.server-connection." + id);
        thread.start();
    }

    public class TCPRunnable implements Runnable {
        private boolean shouldRun = true;
        private final SocketWrapper socket;

        public TCPRunnable(SocketWrapper socket) {
            this.socket = socket;
        }

        public void send(String data) {
            socket.write(data);
        }

        @Override
        public void run() {
            try {
                try {
                    while (shouldRun) {
                        String messageFromServer = socket.read();
                        if (messageFromServer != null) {
                            Log.d(TAG, "received message: " + messageFromServer);
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error in run 2", e);
                } finally {
                    socket.close();
                }
            } catch (Exception e) {
                Log.e(TAG, "Error in run", e);
            }
        }
    }
}
