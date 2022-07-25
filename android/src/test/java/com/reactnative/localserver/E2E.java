package com.reactnative.localserver;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.TCPClientModule;
import com.reactnativelocalserver.TCPServerModule;
import com.reactnativelocalserver.tcp.factory.ClientFactory;
import com.reactnativelocalserver.tcp.factory.ServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.TCPClientEventName;
import com.reactnativelocalserver.utils.TCPServerEventName;

import org.junit.After;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.Timeout;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;
import java.util.concurrent.TimeUnit;

@RunWith(MockitoJUnitRunner.class)
public class E2E {
    private final int port = 12000;
    @Rule
    public Timeout globalTimeout = Timeout.seconds(10);
    @Mock
    ReactApplicationContext context;
    @Mock
    EventEmitter serverEventEmitter;
    @Captor
    ArgumentCaptor<JSEvent> serverEventCaptor;
    @Mock
    EventEmitter clientEventEmitter;
    @Captor
    ArgumentCaptor<JSEvent> clientEventCaptor;
    private TCPServerModule serverModule;
    private TCPClientModule clientModule;

    @Before
    public void setup() {
        serverModule = new TCPServerModule(context, serverEventEmitter, new ServerFactory());
        clientModule = new TCPClientModule(context, clientEventEmitter, new ClientFactory());
    }

    @After
    public void tearDown() {
        serverModule.invalidate();
        clientModule.invalidate();
    }

    @Test
    public void serverShouldSendData() throws Exception {
        prepareServer("server");
        prepareClient("client");

        verify(serverEventEmitter, times(3)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        String connectionId = serverEvents.get(2).getBody().get("connectionId");

        Promise promise = mockPromise();
        serverModule.send("server", connectionId, "Hello From Server", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.DataReceived);
        assertThat(clientEvents.get(1).getBody()).containsEntry("data", "Hello From Server");
    }

    @Test
    public void clientShouldSendData() throws Exception {
        prepareServer("server");
        prepareClient("client");

        verify(clientEventEmitter, times(1)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);

        Promise promise = mockPromise();
        clientModule.send("client", "Hello From Client", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(serverEventEmitter, times(4)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.DataReceived);
    }

    @Test
    public void clientShouldDisconnect() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        clientModule.stopClient("client", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);

        verify(serverEventEmitter, times(4)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);
    }

    @Test
    public void serverShouldAcceptMultipleConnections() throws Exception {
        prepareServer("server");
        prepareClient("client-1");
        prepareClient("client-2");

        verify(serverEventEmitter, times(5)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
    }

    @Test
    public void serverShouldStop() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        serverModule.stopServer("server", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(serverEventEmitter, times(5)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.Stopped);
        assertThat(serverEvents.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);
    }

    @Test
    public void serverShouldNotSendDataToClosedConnection() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise stopPromise = mockPromise();
        clientModule.stopClient("client", stopPromise);
        verify(stopPromise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);

        verify(serverEventEmitter, times(4)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);

        String connectionId = serverEvents.get(3).getBody().get("connectionId");
        Promise sendPromise = mockPromise();
        serverModule.send("server", connectionId, "message", sendPromise);
        verify(sendPromise).reject("server.error", "Unknown connection: " + connectionId);
    }

    @Test
    public void clientShouldNotSendDataToClosedConnection() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        serverModule.stopServer("server", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(serverEventEmitter, times(5)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.Stopped);
        assertThat(serverEvents.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);

        Promise sendPromise = mockPromise();
        clientModule.send("client", "message", sendPromise);
        verify(sendPromise).reject("client.not-exists", "Client with this id does not exist");
    }

    private void prepareServer(String id) throws Exception {
        Promise promise = mockPromise();
        serverModule.createServer(id, port, promise);
        verify(promise).resolve(true);
        TimeUnit.MILLISECONDS.sleep(100);
    }

    private void prepareClient(String id) throws Exception {
        Promise promise = mockPromise();
        clientModule.createClient(id, "localhost", port, promise);
        verify(promise).resolve(true);
        TimeUnit.MILLISECONDS.sleep(100);
    }

    private Promise mockPromise() {
        return Mockito.mock(Promise.class);
    }
}
