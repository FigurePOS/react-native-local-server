package com.reactnative.localserver.tcp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.TCPClientModule;
import com.reactnativelocalserver.TCPServerModule;
import com.reactnativelocalserver.tcp.factory.TCPClientFactory;
import com.reactnativelocalserver.tcp.factory.TCPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.NsdManagerFactory;
import com.reactnativelocalserver.utils.StopReasonEnum;
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
    NsdManagerFactory nsdManagerFactory;
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
        serverModule = new TCPServerModule(context, serverEventEmitter, new TCPServerFactory(), nsdManagerFactory);
        clientModule = new TCPClientModule(context, clientEventEmitter, new TCPClientFactory());
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
        clientModule.stopClient("client", null, promise);
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
        assertThat(serverEvents.get(3).getBody().get("reason")).isEqualTo(StopReasonEnum.ClosedByPeer);
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
        serverModule.stopServer("server", null, promise);
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
        assertThat(clientEvents.get(1).getBody().get("reason")).isEqualTo(StopReasonEnum.ClosedByPeer);
    }

    @Test
    public void serverShouldReturnConnectionIds() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        serverModule.getConnectionIds("server", promise);
        verify(promise).resolve(anySet());
    }

    @Test
    public void serverShouldNotReturnConnectionIdsUnknownServer() throws Exception {
        Promise promise = mockPromise();
        serverModule.getConnectionIds("server", promise);
        verify(promise).reject("tcp.server.not-exists", "Server with this id does not exist");
    }

    @Test
    public void serverShouldNotStartPortAlreadyInUse() throws Exception {
        prepareServer("server-1");

        Promise promise = mockPromise();
        serverModule.createServer("server-2", port, promise);
        verify(promise).reject("tcp.server.error", "Port 12000 already in use.");

        TimeUnit.MILLISECONDS.sleep(100);

        verify(serverEventEmitter, times(1)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(0).getBody().get("serverId")).isEqualTo("server-1");
    }

    @Test
    public void clientShouldNotConnectToUnknownHost() throws Exception {
        Promise promise = mockPromise();
        clientModule.createClient("client", "unknown-host", port, promise);
        verify(promise).reject("tcp.client.error", "unknown host: unknown-host");

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(0)).emitEvent(clientEventCaptor.capture());
    }

    @Test
    public void clientShouldNotConnectToUnknownPort() throws Exception {
        prepareServer("server");

        Promise promise = mockPromise();
        clientModule.createClient("client", "localhost", port + 1, promise);
        verify(promise).reject("tcp.client.error", "Connection refused (Connection refused)");

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(0)).emitEvent(clientEventCaptor.capture());
    }

    @Test
    public void serverShouldStopWithCustomReason() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        serverModule.stopServer("server", "custom-reason", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(serverEventEmitter, times(5)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEvents = serverEventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEvents.get(1).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEvents.get(2).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEvents.get(3).getName()).isEqualTo(TCPServerEventName.Stopped);
        assertThat(serverEvents.get(3).getBody().get("reason")).isEqualTo("custom-reason");
        assertThat(serverEvents.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);
        assertThat(clientEvents.get(1).getBody().get("reason")).isEqualTo(StopReasonEnum.ClosedByPeer);
    }

    @Test
    public void serverShouldNotSendDataToClosedConnection() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise stopPromise = mockPromise();
        clientModule.stopClient("client", null, stopPromise);
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
        verify(sendPromise).reject("tcp.server.error", "Unknown connection: " + connectionId);
    }

    @Test
    public void clientShouldNotSendDataToClosedConnection() throws Exception {
        prepareServer("server");
        prepareClient("client");

        Promise promise = mockPromise();
        serverModule.stopServer("server", null, promise);
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
        verify(sendPromise).reject("tcp.client.not-exists", "Client with this id does not exist");
    }


    @Test
    public void serverShouldCloseConnection() throws Exception {
        prepareServer("server");
        prepareClient("client");

        verify(serverEventEmitter, times(3)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEventsBefore = serverEventCaptor.getAllValues();
        String connectionId = serverEventsBefore.get(2).getBody().get("connectionId");

        Promise promise = mockPromise();
        serverModule.closeConnection("server", connectionId, null, promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);

        verify(serverEventEmitter, times(4)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEventsAfter = serverEventCaptor.getAllValues();
        assertThat(serverEventsAfter.get(3).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEventsAfter.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEventsAfter.get(5).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEventsAfter.get(6).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);
    }

    @Test
    public void serverShouldCloseConnectionWithCustomReason() throws Exception {
        prepareServer("server");
        prepareClient("client");

        verify(serverEventEmitter, times(3)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEventsBefore = serverEventCaptor.getAllValues();
        String connectionId = serverEventsBefore.get(2).getBody().get("connectionId");

        Promise promise = mockPromise();
        serverModule.closeConnection("server", connectionId, "custom-reason", promise);
        verify(promise).resolve(true);

        TimeUnit.MILLISECONDS.sleep(100);

        verify(clientEventEmitter, times(2)).emitEvent(clientEventCaptor.capture());
        List<JSEvent> clientEvents = clientEventCaptor.getAllValues();
        assertThat(clientEvents.get(0).getName()).isEqualTo(TCPClientEventName.Ready);
        assertThat(clientEvents.get(1).getName()).isEqualTo(TCPClientEventName.Stopped);

        verify(serverEventEmitter, times(4)).emitEvent(serverEventCaptor.capture());
        List<JSEvent> serverEventsAfter = serverEventCaptor.getAllValues();
        assertThat(serverEventsAfter.get(3).getName()).isEqualTo(TCPServerEventName.Ready);
        assertThat(serverEventsAfter.get(4).getName()).isEqualTo(TCPServerEventName.ConnectionAccepted);
        assertThat(serverEventsAfter.get(5).getName()).isEqualTo(TCPServerEventName.ConnectionReady);
        assertThat(serverEventsAfter.get(6).getName()).isEqualTo(TCPServerEventName.ConnectionClosed);
        assertThat(serverEventsAfter.get(6).getBody().get("reason")).isEqualTo("custom-reason");
    }

    private void prepareServer(String id) throws Exception {
        prepareServer(id, null, null);
    }

    private void prepareServer(String id, String discoveryGroup, String discoveryName) throws Exception {
        Promise promise = mockPromise();
        serverModule.createServer(id, port, discoveryGroup, discoveryName, promise);
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
