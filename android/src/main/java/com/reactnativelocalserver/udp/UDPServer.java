package com.reactnativelocalserver.udp;

import android.util.Log;

import com.reactnativelocalserver.udp.factory.DatagramSocketFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.UDPServerEventName;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;


public class UDPServer {
    private final static String TAG = "UDPServer";
    private final DatagramSocketFactory socketFactory;
    private final EventEmitter eventEmitter;

    private final String id;
    private final int port;
    private final int bufferSize = 64 * 1024;
    private final byte[] dataBuffer = new byte[bufferSize];

    private DatagramSocket serverSocket;
    private UDPRunnable runnable;
    private Thread thread;
    private String lastStopReason = null;

    public UDPServer(String id, int port, EventEmitter eventEmitter) {
        this(id, port, eventEmitter, new DatagramSocketFactory());
    }

    public UDPServer(String id, int port, EventEmitter eventEmitter, DatagramSocketFactory socketFactory) {
        this.id = id;
        this.port = port;
        this.eventEmitter = eventEmitter;
        this.socketFactory = socketFactory;
    }

    public String getId() {
        return id;
    }

    public int getPort() {
        return port;
    }

    public void start() throws Exception {
        Log.d(TAG, "start: " + id);
        try {
            serverSocket = socketFactory.of(port);
            runnable = new UDPRunnable();
            thread = new Thread(runnable, "com.react-native-messaging.udp.server." + id);
            thread.start();
        } catch (SocketException e) {
            Log.e(TAG, "start failed", e);
            throw new Exception("Port " + port + " already in use.", e);
        }
    }

    public void stop(String reason) throws Exception {
        Log.d(TAG, "stop: " + id);
        lastStopReason = reason;
        try {
            serverSocket.close();
        } catch (Exception e) {
            Log.e(TAG, "close server socket error", e);
            throw new Exception("Failed to stop server: " + id, e);
        }
    }

    public void send(String host, int port, String message) throws Exception {
        Log.d(TAG, "send: " + id + "\n\tto: " + host + ":" + port + "\n\tmessage: " + message);
        try {
            InetAddress address = InetAddress.getByName(host);
            byte[] buffer = message.getBytes();
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, address, port);
            serverSocket.send(packet);
        } catch (UnknownHostException e) {
            Log.e(TAG, "Unknown host: " + host, e);
            throw new Exception("Unknown host: " + host, e);
        } catch (IOException e) {
            Log.e(TAG, "Failed to send data", e);
            throw new Exception("Failed to send data", e);
        }
    }

    private void cleanUp(String reason) {
        Log.d(TAG, "clean up: " + id);
        if (thread != null && !thread.isInterrupted()) {
            thread.interrupt();
        }
        String reasonToStop = lastStopReason != null ? lastStopReason : reason;
        lastStopReason = null;
        thread = null;
        runnable = null;
        serverSocket = null;
        handleLifecycleEvent(UDPServerEventName.Stopped, reasonToStop);
    }

    private void handleDataReceived(String data, InetAddress address, int port) {
        JSEvent event = new JSEvent(UDPServerEventName.DataReceived);
        event.putString("serverId", id);
        event.putString("data", data);
        event.putString("host", address.getHostAddress());
        event.putString("port", "" + port);
        this.eventEmitter.emitEvent(event);
    }

    private void handleLifecycleEvent(String eventName) {
        handleLifecycleEvent(eventName, null);
    }

    private void handleLifecycleEvent(String eventName, String reason) {
        JSEvent event = new JSEvent(eventName);
        event.putString("serverId", id);
        if (reason != null) {
            event.putString("reason", reason);
        }
        this.eventEmitter.emitEvent(event);
    }

    public class UDPRunnable implements Runnable {
        @Override
        public void run() {
            handleLifecycleEvent(UDPServerEventName.Ready);
            try {
                while (serverSocket != null) {
                    DatagramPacket packet = new DatagramPacket(dataBuffer, bufferSize);
                    serverSocket.receive(packet);

                    String receivedData = new String(packet.getData(), 0, packet.getLength());
                    InetAddress address = packet.getAddress();
                    int port = packet.getPort();
                    handleDataReceived(receivedData, address, port);
                }
            } catch (Exception e) {
                Log.e(TAG, "error in connection accepting", e);
                cleanUp(e.getMessage());
            }
        }
    }
}
