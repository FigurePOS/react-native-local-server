package com.reactnative.localserver;

import static org.assertj.core.api.Java6Assertions.assertThat;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.TCPClientModule;
import com.reactnativelocalserver.tcp.TCPClient;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.StopReasonEnum;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.net.UnknownHostException;


@RunWith(MockitoJUnitRunner.class)
public class TCPClientModuleTest {

    @Mock
    Promise promise;
    @Mock
    Promise promise2;
    @Mock
    ReactApplicationContext context;
    @Mock
    TCPClientFactory clientFactory;
    @Mock
    TCPClient client;
    @Mock
    EventEmitter eventEmitter;

    @Test
    public void shouldReturnNameForLogging() {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        assertThat(module.getName()).isEqualTo("TCPClientModule");
    }

    @Test
    public void shouldCreateClient() throws Exception {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);

        module.createClient("client-1", "localhost", 12000, promise);

        verify(clientFactory).of("client-1", "localhost", 12000, eventEmitter);
        verify(client).start();
        verify(promise).resolve(true);
        assertThat(module.getClients()).containsEntry("client-1", client);
    }

    @Test
    public void shouldNotCreateClient_ClientExists() throws Exception {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);

        module.createClient("client-1", "localhost", 12000, promise);
        module.createClient("client-1", "localhost", 12000, promise);

        verify(clientFactory, times(1)).of("client-1", "localhost", 12000, eventEmitter);
        verify(client, times(1)).start();
        verify(promise, times(1)).resolve(true);
        verify(promise, times(1)).reject("client.already-exists", "Client with this id already exists");
        assertThat(module.getClients()).containsEntry("client-1", client);
    }


    @Test
    public void shouldNotCreateClient_ClientStartThrowsException() throws Exception {
        Exception exception = new UnknownHostException("Could not connect to localhost:12000");
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);
        doThrow(exception).when(client).start();

        module.createClient("client-1", "localhost", 12000, promise);

        verify(clientFactory, times(1)).of("client-1", "localhost", 12000, eventEmitter);
        verify(client, times(1)).start();
        verify(promise, times(1)).reject("client.error", "unknown host: localhost");
        assertThat(module.getClients()).doesNotContainEntry("client-1", client);
    }

    @Test
    public void shouldStopClient() throws Exception {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);

        module.createClient("client-1", "localhost", 12000, promise);
        module.stopClient("client-1", StopReasonEnum.Manual, promise2);

        verify(client).stop(StopReasonEnum.Manual);
        verify(promise2).resolve(true);
        assertThat(module.getClients()).doesNotContainEntry("client-1", client);
    }

    @Test
    public void shouldNotStopClient_ClientDoesNotExist() throws Exception {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        module.stopClient("client-1", StopReasonEnum.Manual, promise);
        verify(promise).reject("client.not-exists", "Client with this id does not exist");
    }

    @Test
    public void shouldNotStopClient_ClientStopThrowsException() throws Exception {
        Exception exception = new Exception("Failed to stop client");
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);
        doThrow(exception).when(client).stop(StopReasonEnum.Manual);

        module.createClient("client-1", "localhost", 12000, promise);
        module.stopClient("client-1", StopReasonEnum.Manual, promise2);

        verify(client).stop(StopReasonEnum.Manual);
        verify(promise2).reject("client.error", exception.getMessage());
        assertThat(module.getClients()).containsEntry("client-1", client);
    }

    @Test
    public void shouldSendData() throws Exception {
        String message = "This is the message";
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);
        module.createClient("client-1", "localhost", 12000, promise);
        module.send("client-1", message, promise2);

        verify(client).send(message);
        verify(promise2).resolve(true);
    }

    @Test
    public void shouldNotSendData_ClientSendThrowsException() throws Exception {
        String message = "This is the message";
        Exception exception = new Exception("Failed to send message");
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);
        doThrow(exception).when(client).send(message);

        module.createClient("client-1", "localhost", 12000, promise);
        module.send("client-1", message, promise2);

        verify(client).send(message);
        verify(promise2).reject("client.error", exception.getMessage());
    }

    @Test
    public void shouldNotSendData_ClientDoesNotExist() throws Exception {
        String message = "This is the message";
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        module.send("client-1", message, promise2);

        verify(client, never()).send(message);
        verify(promise2).reject("client.not-exists", "Client with this id does not exist");
    }

    @Test
    public void shouldInvalidate() throws Exception {
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);

        module.createClient("client-1", "localhost", 12000, promise);

        module.invalidate();
        verify(client).stop(StopReasonEnum.Invalidation);
        assertThat(module.getClients()).isEmpty();
    }

    @Test
    public void shouldInvalidate_EvenWhenStopFails() throws Exception {
        Exception exception = new Exception("Failed to stop client");
        TCPClientModule module = new TCPClientModule(context, eventEmitter, clientFactory);
        when(clientFactory.of("client-1", "localhost", 12000, eventEmitter)).thenReturn(client);
        doThrow(exception).when(client).stop(StopReasonEnum.Invalidation);

        module.createClient("client-1", "localhost", 12000, promise);

        module.invalidate();
        verify(client).stop(StopReasonEnum.Invalidation);
        assertThat(module.getClients()).isEmpty();
    }

}
