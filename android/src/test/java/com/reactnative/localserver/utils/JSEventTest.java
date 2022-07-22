package com.reactnative.localserver.utils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.entry;

import com.reactnativelocalserver.utils.JSEvent;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.junit.MockitoJUnitRunner;

@RunWith(MockitoJUnitRunner.class)
public class JSEventTest {

    @Test
    public void shouldCreateJSEvent() {
        JSEvent event = new JSEvent("NAME");
        assertThat(event.getName()).isEqualTo("NAME");
        assertThat(event.getBody()).containsExactly(entry("type", "NAME"));
    }

    @Test
    public void shouldPutString() {
        JSEvent event = new JSEvent("NAME");
        event.putString("key", "value");
        assertThat(event.getBody()).containsEntry("key", "value");
    }
}
