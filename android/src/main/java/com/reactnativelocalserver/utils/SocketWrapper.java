package com.reactnativelocalserver.utils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class SocketWrapper {

    private final Socket socket;
    private final BufferedReader in;
    private final PrintWriter out;

    public SocketWrapper(Socket socket) throws IOException {
        this.socket = socket;
        out = new PrintWriter(new BufferedWriter(new OutputStreamWriter(socket.getOutputStream())), true);
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    public String read() throws IOException {
        return in.readLine();
    }

    public void write(String data) {
        out.println(data);
    }

    public void close() throws IOException {
        socket.close();
    }
}
