package com.reactnative.localserver.tcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.reactnativelocalserver.tcp.TCPServerConnection;
import com.reactnativelocalserver.tcp.TCPServerConnectionManager;
import com.reactnativelocalserver.tcp.factory.TCPServerConnectionFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.net.Socket;

@RunWith(MockitoJUnitRunner.class)
public class TCPServerConnectionManagerTest {
    @Mock
    TCPServerConnectionFactory connectionFactory;
    @Mock
    TCPServerConnection connection;
    @Mock
    TCPServerConnection connection2;
    @Mock
    EventEmitter eventEmitter;
    @Mock
    Socket socket;

    private String serverId = "server-1";
    private String connectionId = "server-connection-1";
    private String connection2Id = "server-connection-2";

    @Test
    public void shouldCreateConnection() {
        when(connectionFactory.of(serverId, eventEmitter)).thenReturn(connection);
        when(connection.getId()).thenReturn(connectionId);

        TCPServerConnectionManager manager = new TCPServerConnectionManager(connectionFactory);
        String connectionIdFromMethod = manager.create(serverId, eventEmitter);

        assertThat(connectionIdFromMethod).isEqualTo(connectionId);
        assertThat(manager.get(connectionId)).isEqualTo(connection);
        assertThat(manager.getConnections()).containsEntry(connectionId, connection);
    }

    @Test
    public void shouldStartConnection() throws Exception {
        when(connectionFactory.of(serverId, eventEmitter)).thenReturn(connection);
        when(connection.getId()).thenReturn(connectionId);

        TCPServerConnectionManager manager = new TCPServerConnectionManager(connectionFactory);
        String connectionIdFromMethod = manager.create(serverId, eventEmitter);

        manager.start(connectionIdFromMethod, socket);

        verify(connection).start(socket);
    }

    @Test
    public void shouldNotStartConnection_UnknownConnection() {
        TCPServerConnectionManager manager = new TCPServerConnectionManager();
        try {
            manager.start(connectionId, socket);
            fail("manager.start() did not throw exception.");
        } catch (Exception e) {
            assertThat(e.getMessage()).isEqualTo("Unknown connection: " + connectionId);
        }
    }


    @Test
    public void shouldClearConnectionsAndNotThrow() throws Exception {
        when(connection.getId()).thenReturn(connectionId);
        when(connection2.getId()).thenReturn(connection2Id);
        doThrow(new Exception()).when(connection2).stop(StopReasonEnum.Invalidation);

        TCPServerConnectionManager manager = new TCPServerConnectionManager(connectionFactory);

        when(connectionFactory.of(serverId, eventEmitter)).thenReturn(connection);
        manager.create(serverId, eventEmitter);

        when(connectionFactory.of(serverId, eventEmitter)).thenReturn(connection2);
        manager.create(serverId, eventEmitter);

        assertThat(manager.getConnections()).containsEntry(connectionId, connection);
        assertThat(manager.getConnections()).containsEntry(connection2Id, connection2);

        manager.clear();

        verify(connection, times(1)).stop(StopReasonEnum.Invalidation);
        verify(connection2, times(1)).stop(StopReasonEnum.Invalidation);
        assertThat(manager.getConnections()).isEmpty();
    }
}
