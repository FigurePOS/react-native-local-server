package com.reactnative.localserver;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.TCPServerModule;
import com.reactnativelocalserver.tcp.TCPServer;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.net.UnknownHostException;


@RunWith(MockitoJUnitRunner.class)
public class TCPServerModuleTest {

    @Mock
    Promise promise;
    @Mock
    Promise promise2;
    @Mock
    ReactApplicationContext context;
    @Mock
    TCPServerFactory serverFactory;
    @Mock
    TCPServer server;
    @Mock
    EventEmitter eventEmitter;

    @Test
    public void shouldReturnNameForLogging() {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        assertThat(module.getName()).isEqualTo("TCPServerModule");
    }

    @Test
    public void shouldCreateServer() throws Exception {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);

        module.createServer("server-1", 12000, promise);

        verify(serverFactory).of("server-1", 12000, eventEmitter);
        verify(server).start();
        verify(promise).resolve(true);
        assertThat(module.getServers()).containsEntry("server-1", server);
    }

    @Test
    public void shouldNotCreateServer_ServerExists() throws Exception {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);

        module.createServer("server-1", 12000, promise);
        module.createServer("server-1", 12000, promise);

        verify(serverFactory, times(1)).of("server-1", 12000, eventEmitter);
        verify(server, times(1)).start();
        verify(promise, times(1)).resolve(true);
        verify(promise, times(1)).reject("tcp.server.already-exists", "Server with this id already exists");
        assertThat(module.getServers()).containsEntry("server-1", server);
    }


    @Test
    public void shouldNotCreateServer_ServerStartThrowsException() throws Exception {
        Exception exception = new UnknownHostException("Could not connect to localhost:12000");
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);
        doThrow(exception).when(server).start();

        module.createServer("server-1", 12000, promise);

        verify(serverFactory, times(1)).of("server-1", 12000, eventEmitter);
        verify(server, times(1)).start();
        verify(promise, times(1)).reject("tcp.server.error", exception.getMessage());
        assertThat(module.getServers()).doesNotContainEntry("server-1", server);
    }

    @Test
    public void shouldStopServer() throws Exception {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);

        module.createServer("server-1", 12000, promise);
        module.stopServer("server-1", null, promise2);

        verify(server).stop(null);
        verify(promise2).resolve(true);
        assertThat(module.getServers()).doesNotContainEntry("server-1", server);
    }

    @Test
    public void shouldNotStopServer_ServerDoesNotExist() throws Exception {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        module.stopServer("server-1", null, promise);
        verify(promise).reject("tcp.server.not-exists", "Server with this id does not exist");
    }

    @Test
    public void shouldNotStopServer_ServerStopThrowsException() throws Exception {
        Exception exception = new Exception("Failed to stop server");
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);
        doThrow(exception).when(server).stop(null);

        module.createServer("server-1", 12000, promise);
        module.stopServer("server-1", null, promise2);

        verify(server).stop(null);
        verify(promise2).reject("tcp.server.error", exception.getMessage());
        assertThat(module.getServers()).containsEntry("server-1", server);
    }

    @Test
    public void shouldSendData() throws Exception {
        String message = "This is the message";
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);
        module.createServer("server-1", 12000, promise);
        module.send("server-1", "connection-1", message, promise2);

        verify(server).send("connection-1", message);
        verify(promise2).resolve(true);
    }

    @Test
    public void shouldNotSendData_ServerSendThrowsException() throws Exception {
        String message = "This is the message";
        Exception exception = new Exception("Failed to send message");
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);
        doThrow(exception).when(server).send("connection-1", message);

        module.createServer("server-1", 12000, promise);
        module.send("server-1", "connection-1", message, promise2);

        verify(server).send("connection-1", message);
        verify(promise2).reject("tcp.server.error", exception.getMessage());
    }

    @Test
    public void shouldNotSendData_ServerDoesNotExist() throws Exception {
        String message = "This is the message";
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        module.send("server-1", "connection-1", message, promise2);

        verify(server, never()).send("connection-1", message);
        verify(promise2).reject("tcp.server.not-exists", "Server with this id does not exist");
    }

    @Test
    public void shouldInvalidate() throws Exception {
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);

        module.createServer("server-1", 12000, promise);

        module.invalidate();
        verify(server).stop(StopReasonEnum.Invalidation);
        assertThat(module.getServers()).isEmpty();
    }

    @Test
    public void shouldInvalidate_EvenWhenStopFails() throws Exception {
        Exception exception = new Exception("Failed to stop server");
        TCPServerModule module = new TCPServerModule(context, eventEmitter, serverFactory);
        when(serverFactory.of("server-1", 12000, eventEmitter)).thenReturn(server);
        doThrow(exception).when(server).stop(StopReasonEnum.Invalidation);

        module.createServer("server-1", 12000, promise);

        module.invalidate();
        verify(server).stop(StopReasonEnum.Invalidation);
        assertThat(module.getServers()).isEmpty();
    }

}
