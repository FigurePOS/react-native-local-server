package com.reactnativelocalserver.messaging;

import android.util.Log;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;

public class ClientConnection {
    private static final String TAG = "ClientConnection";
    private final String clientId;
    private final String host;
    private final int port;

    private TCPRunnable runnable;
    private Thread thread;

    public ClientConnection(String clientId, String host, int port) {
        this.clientId = clientId;
        this.host = host;
        this.port = port;
    }

    public void start() {
        Log.d(TAG, "start");
        if (runnable != null) {
            // TODO throw error
            return;
        }
        runnable = new TCPRunnable();
        thread = new Thread(runnable, "com.react-native-messaging.client." + clientId);
        thread.start();
    }

    public void send(String data) {
        Log.d(TAG, "send: " + data);
        runnable.send(data);
    }

    public class TCPRunnable implements Runnable {
        private boolean shouldRun = true;
        private PrintWriter out;
        private BufferedReader in;
        private Socket socket;

        public void send(String data) {
            out.println(data);
        }

        @Override
        public void run() {
            try {
                InetAddress serverAddress = InetAddress.getByName(host);
                socket = new Socket(serverAddress, port);
                try {
                    out = new PrintWriter( new BufferedWriter( new OutputStreamWriter(socket.getOutputStream())),true);
                    in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
                    while (shouldRun) {
                        String messageFromServer = in.readLine();
                        Log.d(TAG, "received message: " + messageFromServer);
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
