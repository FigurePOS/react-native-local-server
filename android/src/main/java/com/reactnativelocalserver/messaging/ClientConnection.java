package com.reactnativelocalserver.messaging;

import android.util.Log;

import com.reactnativelocalserver.utils.SocketWrapper;

import java.io.IOException;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;

public class ClientConnection {
    private static final String TAG = "ClientConnection";
    private final String clientId;
    private final String host;
    private final int port;

    private SocketWrapper socket;
    private TCPRunnable runnable;
    private Thread thread;

    public ClientConnection(String clientId, String host, int port) {
        this.clientId = clientId;
        this.host = host;
        this.port = port;
    }

    public void start() {
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

    public void send(String data) {
        Log.d(TAG, "send: " + clientId + "\n\tdata: " + data);
        socket.write(data);
    }

    public void stop() {
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
    }

    public class TCPRunnable implements Runnable {

        @Override
        public void run() {
            try {
                while (true) {
                    String messageFromServer = socket.read();
                    if (Thread.interrupted()) {
                        Log.d(TAG, "was interrupted: " + clientId);
                    }
                    if (messageFromServer != null) {
                        Log.d(TAG, "received message on: " + clientId + "\n\tmessage: " + messageFromServer);
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
