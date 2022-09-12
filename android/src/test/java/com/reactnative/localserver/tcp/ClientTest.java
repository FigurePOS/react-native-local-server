package com.reactnative.localserver.tcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.fail;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.reactnativelocalserver.tcp.Client;
import com.reactnativelocalserver.tcp.ClientConnection;
import com.reactnativelocalserver.tcp.factory.ClientConnectionFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class ClientTest {
    @Mock
    ClientConnectionFactory connectionFactory;
    @Mock
    ClientConnection connection;
    @Mock
    EventEmitter eventEmitter;

    private String clientId = "client-1";
    private String host = "localhost";
    private Integer port = 12000;

    @Test
    public void shouldCreateClient() {
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        assertThat(client.getId()).isEqualTo(clientId);
        assertThat(client.getHost()).isEqualTo(host);
        assertThat(client.getPort()).isEqualTo(port);
        verify(connectionFactory, times(1)).of(clientId, host, port, eventEmitter);
    }

    @Test
    public void shouldCreateClientWithoutFactory() {
        Client client = new Client(clientId, host, port, eventEmitter);

        assertThat(client.getId()).isEqualTo(clientId);
        assertThat(client.getHost()).isEqualTo(host);
        assertThat(client.getPort()).isEqualTo(port);
    }

    @Test
    public void shouldStartClient() throws Exception {
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        client.start();
        verify(connection, times(1)).start();
    }

    @Test
    public void shouldNotStartClient_ConnectionStartThrowsError() throws Exception {
        Exception exception = new Exception("Failed to start connection");
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        doThrow(exception).when(connection).start();
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        try {
            client.start();
            fail("client.start() did not throw exception");
        } catch (Exception e) {
            assertThat(e).isEqualTo(exception);
        }
        verify(connection, times(1)).start();
    }

    @Test
    public void shouldStopClient() throws Exception {
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        client.stop(StopReasonEnum.Manual);
        verify(connection, times(1)).stop(StopReasonEnum.Manual);
    }

    @Test
    public void shouldStopClientWithCustomReason() throws Exception {
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        client.stop("custom-reason");
        verify(connection, times(1)).stop("custom-reason");
    }

    @Test
    public void shouldNotStopClient_ConnectionStartThrowsError() throws Exception {
        Exception exception = new Exception("Failed to stop connection");
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        doThrow(exception).when(connection).stop(StopReasonEnum.Manual);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        try {
            client.stop(StopReasonEnum.Manual);
            fail("client.stop() did not throw exception");
        } catch (Exception e) {
            assertThat(e).isEqualTo(exception);
        }
        verify(connection, times(1)).stop(StopReasonEnum.Manual);
    }

    @Test
    public void shouldSend() throws Exception {
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        client.send("message");
        verify(connection, times(1)).send("message");
    }

    @Test
    public void shouldNotSend_ConnectionStartThrowsError() throws Exception {
        Exception exception = new Exception("Failed to send");
        when(connectionFactory.of(clientId, host, port, eventEmitter)).thenReturn(connection);
        doThrow(exception).when(connection).send("message");
        Client client = new Client(clientId, host, port, eventEmitter, connectionFactory);

        try {
            client.send("message");
            fail("client.send() did not throw exception");
        } catch (Exception e) {
            assertThat(e).isEqualTo(exception);
        }
        verify(connection, times(1)).send("message");
    }
}
