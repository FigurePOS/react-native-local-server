import "react-native-gesture-handler"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import * as React from "react"
import { Provider } from "react-redux"

import { Colors } from "./common/constants"
import { store } from "./configureStore"
import { CallerIDServerScreen } from "./screens/CallerId"
import { CounterScreen } from "./screens/Counter"
import { MessagingClientScreen } from "./screens/MessagingClient"
import { MessagingServerScreen } from "./screens/MessagingServer"
import { ServiceBrowserScreen } from "./screens/ServiceBrowser"
import { TCPClientScreen } from "./screens/TCPClient"
import { TCPServerScreen } from "./screens/TCPServer"
import { UDPServerScreen } from "./screens/UDPServer"

const Drawer = createDrawerNavigator()

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.Primary,
    },
}

export enum ScreenNames {
    TCPServer = "TCP Server",
    TCPClient = "TCP Client",
    ServiceBrowser = "Service Browser",
    UDPServer = "UDP Server",
    MessagingServer = "Messaging Server",
    MessagingClient = "Messaging Client",
    Counter = "Counter",
    CallerID = "Caller ID",
}

export const AppE = () => {
    return (
        <Provider store={store}>
            <NavigationContainer theme={MyTheme}>
                <Drawer.Navigator initialRouteName={ScreenNames.Counter}>
                    <Drawer.Screen name={ScreenNames.TCPServer} component={TCPServerScreen} />
                    <Drawer.Screen name={ScreenNames.TCPClient} component={TCPClientScreen} />
                    <Drawer.Screen name={ScreenNames.ServiceBrowser} component={ServiceBrowserScreen} />
                    <Drawer.Screen name={ScreenNames.UDPServer} component={UDPServerScreen} />
                    <Drawer.Screen name={ScreenNames.MessagingServer} component={MessagingServerScreen} />
                    <Drawer.Screen name={ScreenNames.MessagingClient} component={MessagingClientScreen} />
                    <Drawer.Screen name={ScreenNames.Counter} component={CounterScreen} />
                    <Drawer.Screen name={ScreenNames.CallerID} component={CallerIDServerScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </Provider>
    )
}
