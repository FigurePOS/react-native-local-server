import "react-native-gesture-handler"
import * as React from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Provider } from "react-redux"
import { store } from "./configureStore"
import { Colors } from "./common/constants"
import { TCPServerScreen } from "./screens/TCPServer"
import { TCPClientScreen } from "./screens/TCPClient"
import { UDPServerScreen } from "./screens/UDPServer"
import { MessagingServerScreen } from "./screens/MessagingServer"
import { MessagingClientScreen } from "./screens/MessagingClient"
import { CounterScreen } from "./screens/Counter"
import { CallerIDServerScreen } from "./screens/CallerId"

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
    UDPServer = "UDP Server",
    MessagingServer = "Messaging Server",
    MessagingClient = "Messaging Client",
    Counter = "Counter",
    CallerID = "Caller ID",
}

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer theme={MyTheme}>
                <Drawer.Navigator initialRouteName={ScreenNames.CallerID}>
                    <Drawer.Screen name={ScreenNames.TCPServer} component={TCPServerScreen} />
                    <Drawer.Screen name={ScreenNames.TCPClient} component={TCPClientScreen} />
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
