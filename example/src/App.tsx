import "react-native-gesture-handler"
import * as React from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { Provider } from "react-redux"
import { store } from "./configureStore"
import { Colors } from "./common/constants"
import { TCPServerScreen } from "./screens/TCPServer"
import { TCPClientScreen } from "./screens/TCPClient"
import { MessagingServerScreen } from "./screens/MessagingServer"
import { MessagingClientScreen } from "./screens/MessagingClient"
import { CounterScreen } from "./screens/Counter"

const Drawer = createDrawerNavigator()

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: Colors.Primary,
    },
}

export default function App() {
    return (
        <Provider store={store}>
            <NavigationContainer theme={MyTheme}>
                <Drawer.Navigator initialRouteName={"Messaging Server"}>
                    <Drawer.Screen name={"TCP Server"} component={TCPServerScreen} />
                    <Drawer.Screen name={"TCP Client"} component={TCPClientScreen} />
                    <Drawer.Screen name={"Messaging Server"} component={MessagingServerScreen} />
                    <Drawer.Screen name={"Messaging Client"} component={MessagingClientScreen} />
                    <Drawer.Screen name={"Counter"} component={CounterScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </Provider>
    )
}
