package com.reactnative.localserver.udp;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.UDPServerModule;
import com.reactnativelocalserver.udp.factory.UDPServerFactory;
import com.reactnativelocalserver.utils.EventEmitter;
import com.reactnativelocalserver.utils.JSEvent;
import com.reactnativelocalserver.utils.UDPServerEventName;

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
    @Rule
    public Timeout globalTimeout = Timeout.seconds(10);
    @Mock
    ReactApplicationContext context;
    @Mock
    EventEmitter eventEmitter;
    @Captor
    ArgumentCaptor<JSEvent> eventCaptor;
    private UDPServerModule serverModule;

    @Before
    public void setup() {
        serverModule = new UDPServerModule(context, eventEmitter, new UDPServerFactory());
    }

    @After
    public void tearDown() {
        serverModule.invalidate();
    }

    @Test
    public void serverShouldStart() throws Exception {
        prepareServer("server-1", 12000);
        verify(eventEmitter, times(1)).emitEvent(eventCaptor.capture());
        List<JSEvent> serverEvents = eventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(UDPServerEventName.Ready);
        assertThat(serverEvents.get(0).getBody().get("serverId")).isEqualTo("server-1");
    }

    @Test
    public void serverShouldSendData() throws Exception {
        prepareServer("server-1", 12000);
        prepareServer("server-2", 12001);

        Promise promise = mockPromise();
        serverModule.send("localhost", 12001, "Hello there", promise);
        verify(promise).resolve(true);
        TimeUnit.MILLISECONDS.sleep(100);

        verify(eventEmitter, times(3)).emitEvent(eventCaptor.capture());
        List<JSEvent> serverEvents = eventCaptor.getAllValues();
        assertThat(serverEvents.get(0).getName()).isEqualTo(UDPServerEventName.Ready);
        assertThat(serverEvents.get(0).getBody().get("serverId")).isEqualTo("server-1");
        assertThat(serverEvents.get(1).getName()).isEqualTo(UDPServerEventName.Ready);
        assertThat(serverEvents.get(1).getBody().get("serverId")).isEqualTo("server-2");
        assertThat(serverEvents.get(2).getName()).isEqualTo(UDPServerEventName.DataReceived);
        assertThat(serverEvents.get(2).getBody().get("serverId")).isEqualTo("server-2");
        assertThat(serverEvents.get(2).getBody().get("data")).isEqualTo("Hello there");
        assertThat(serverEvents.get(2).getBody().get("port")).isInstanceOfAny(String.class);
        assertThat(serverEvents.get(2).getBody().get("host")).isEqualTo("127.0.0.1");
    }

    @Test
    public void serverShouldNotStartPortAlreadyInUse() throws Exception {
        prepareServer("server-1", 12000);
        Promise promise = mockPromise();
        serverModule.createServer("server-2", 12000, promise);
        verify(promise).reject("udp.server.error", "Port 12000 already in use.");
    }

    @Test
    public void serverShouldNotStartIdAlreadyInUse() throws Exception {
        prepareServer("server-1", 12000);
        Promise promise = mockPromise();
        serverModule.createServer("server-1", 12001, promise);
        verify(promise).reject("udp.server.already-exists", "Server with this id already exists");
    }

    private void prepareServer(String id, int port) throws Exception {
        Promise promise = mockPromise();
        serverModule.createServer(id, port, promise);
        verify(promise).resolve(true);
        TimeUnit.MILLISECONDS.sleep(100);
    }

    private Promise mockPromise() {
        return Mockito.mock(Promise.class);
    }
}
