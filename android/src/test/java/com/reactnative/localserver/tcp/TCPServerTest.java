package com.reactnative.localserver.tcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.tcp.TCPServerConnection;
import com.reactnativelocalserver.tcp.TCPServerConnectionManager;
import com.reactnativelocalserver.tcp.factory.ServerSocketFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.TCPServerEventName;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RunWith(MockitoJUnitRunner.class)
public class TCPServerTest {

    @Mock
    TCPServerConnectionManager connectionManager;
    @Mock
    TCPServerConnection connection;

    @Mock
    ServerSocketFactory socketFactory;
    @Mock
    ServerSocket serverSocket;
    @Mock
    Socket connectionSocket;

    @Mock
    EventEmitter eventEmitter;
    @Captor
    ArgumentCaptor<JSEvent> eventCaptor;

    private String serverId = "server-1";
    private String connectionId = "server-connection-1";
    private Integer port = 12000;

    @Test
    public void shouldCreateServer() {
        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);

        assertThat(server.getId()).isEqualTo(serverId);
        assertThat(server.getPort()).isEqualTo(port);
        assertThat(server.getConnections()).isEmpty();
    }

    @Test
    public void shouldCreateServerWithDefaultFactory() {
        TCPServer server = new TCPServer(serverId, port, eventEmitter);

        assertThat(server.getId()).isEqualTo(serverId);
        assertThat(server.getPort()).isEqualTo(port);
        assertThat(server.getConnections()).isEmpty();
    }

    @Test(timeout = 1000)
    public void shouldStartServer() throws Exception {
        when(socketFactory.of(port)).thenReturn(serverSocket);
        when(serverSocket.accept()).thenReturn(connectionSocket);
        when(connectionManager.create(serverId, eventEmitter)).thenReturn(connectionId);

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        server.start(1);
        TimeUnit.MILLISECONDS.sleep(500);

        verify(eventEmitter, times(2)).emitEvent(eventCaptor.capture());
        List<JSEvent> capturedEvents = eventCaptor.getAllValues();
        assertThat(capturedEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(capturedEvents.get(0).getBody()).containsEntry("serverId", serverId);

        verify(serverSocket, times(1)).accept();

        verify(connectionManager, times(1)).start(connectionId, connectionSocket);

        assertThat(capturedEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(capturedEvents.get(1).getBody()).containsEntry("serverId", serverId);
        assertThat(capturedEvents.get(1).getBody()).containsEntry("connectionId", connectionId);
    }

    @Test
    public void shouldNotStartServer_ServerSocketThrowsException() throws Exception {
        IOException exception = new IOException();
        when(socketFactory.of(port)).thenThrow(exception);

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        try {
            server.start();
            fail("server.start() did not throw exception.");
        } catch (Exception e) {
            assertThat(e.getMessage()).isEqualTo("Port " + port + " already in use.");
            assertThat(e.getCause()).isEqualTo(exception);
        }
    }

    @Test(timeout = 1000)
    public void shouldNotStartServer_AcceptThrowsException() throws Exception {
        IOException exception = new IOException();
        when(socketFactory.of(port)).thenReturn(serverSocket);
        when(serverSocket.accept()).thenThrow(exception);

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        server.start(1);
        TimeUnit.MILLISECONDS.sleep(500);

        verify(eventEmitter, times(2)).emitEvent(eventCaptor.capture());
        List<JSEvent> capturedEvents = eventCaptor.getAllValues();
        assertThat(capturedEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(capturedEvents.get(0).getBody()).containsEntry("serverId", serverId);

        verify(serverSocket, times(1)).accept();

        assertThat(capturedEvents.get(1).getName()).isEqualTo(TCPServerEventName.Stopped);
        assertThat(capturedEvents.get(1).getBody()).containsEntry("serverId", serverId);

        assertThat(server.getConnections()).isEmpty();
    }

    @Test
    public void shouldSendData() throws Exception {
        String message = "This is the message";
        when(connectionManager.get(connectionId)).thenReturn(connection);

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        server.send(connectionId, message);

        verify(connection, times(1)).send(message);
    }

    @Test
    public void shouldNotSendData_UnknownConnection() throws Exception {
        String message = "This is the message";
        when(connectionManager.get(connectionId)).thenReturn(null);

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        try {
            server.send(connectionId, message);
            fail("server.send() did not throw exception");
        } catch (Exception e) {
            assertThat(e.getMessage()).isEqualTo("Unknown connection: " + connectionId);
        }
    }

    @Test
    public void shouldReturnEmptyConnectionIds() throws Exception {
        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        when(connectionManager.getConnections()).thenReturn(new HashMap<>());
        assertThat(server.getConnectionIds()).isEqualTo(new HashSet<>());
    }

    @Test
    public void shouldReturnConnectionIds() throws Exception {
        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);
        Map<String, TCPServerConnection> connections = new HashMap<>();
        connections.put("connection-1", null);
        connections.put("connection-2", null);
        when(connectionManager.getConnections()).thenReturn(connections);
        assertThat(server.getConnectionIds()).containsExactly("connection-1", "connection-2");
    }

    @Test(timeout = 1000)
    public void shouldStopServer() throws Exception {
        when(socketFactory.of(port)).thenCallRealMethod();

        TCPServer server = new TCPServer(serverId, port, eventEmitter, socketFactory, connectionManager);

        server.start();
        TimeUnit.MILLISECONDS.sleep(300);
        server.stop(null);
        TimeUnit.MILLISECONDS.sleep(300);

        verify(eventEmitter, times(2)).emitEvent(eventCaptor.capture());
        List<JSEvent> capturedEvents = eventCaptor.getAllValues();
        assertThat(capturedEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(capturedEvents.get(0).getBody()).containsEntry("serverId", serverId);
        assertThat(capturedEvents.get(1).getName()).isEqualTo(TCPServerEventName.Stopped);
        assertThat(capturedEvents.get(1).getBody()).containsEntry("serverId", serverId);

        verify(connectionManager).clear();
    }
}
