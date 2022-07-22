package com.reactnative.localserver.tcp;

import static org.assertj.core.api.Assertions.assertThat;

import com.reactnativelocalserver.tcp.Server;
import com.reactnativelocalserver.tcp.ServerConnection;
import com.reactnativelocalserver.tcp.factory.ServerConnectionFactory;
import com.reactnativelocalserver.tcp.factory.ServerSocketFactory;
import com.reactnativelocalserver.utils.EventEmitter;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.net.ServerSocket;

@RunWith(MockitoJUnitRunner.class)
public class ServerTest {

    @Mock
    ServerConnectionFactory connectionFactory;
    @Mock
    ServerConnection connection;

    @Mock
    ServerSocketFactory socketFactory;
    @Mock
    ServerSocket serverSocket;

    @Mock
    EventEmitter eventEmitter;

    private String serverId = "server-1";
    private Integer port = 12000;

    @Test
    public void shouldCreateServer() {
        Server server = new Server(serverId, port, eventEmitter, socketFactory, connectionFactory);

        assertThat(server.getId()).isEqualTo(serverId);
        assertThat(server.getPort()).isEqualTo(port);
        assertThat(server.getConnections()).isEmpty();
    }

//    @Test
//    public void shouldStartServer() throws Exception {
//        when(socketFactory.of(port)).thenReturn(serverSocket);
//        Server server = new Server(serverId, port, eventEmitter, socketFactory, connectionFactory);
//
//        server.start();
//        verify(serverSocket, times(1)).accept();
//    }
}
