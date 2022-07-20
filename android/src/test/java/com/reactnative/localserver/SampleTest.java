package com.reactnative.localserver;

import static org.mockito.Mockito.verify;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.reactnativelocalserver.TCPClientModule;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;


@RunWith(MockitoJUnitRunner.class)
public class SampleTest {

    @Mock
    Promise promise;

    @Mock
    ReactApplicationContext context;

    @Test
    public void emailValidator_CorrectEmailSimple_ReturnsTrue() {
        Assert.assertNotNull(promise);
        TCPClientModule module = new TCPClientModule(context);

        module.createClient("client-1", "localhost", 12000, promise);

        verify(promise).resolve(true);

        module.createClient("client-1", "localhost", 12000, promise);

        verify(promise).reject("client.already-exists", "Client with this id already exists");

    }
}
