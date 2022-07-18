import "react-native-gesture-handler"
import * as React from "react"
import { DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createDrawerNavigator } from "@react-navigation/drawer"
import { TCPServerScreen } from "./screens/TCPServer"
import { TCPClientScreen } from "./screens/TCPClient"
import { Provider } from "react-redux"
import configureStore from "./configureStore"
import { Colors } from "./common/constants"

const Drawer = createDrawerNavigator()

const store = configureStore()

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
                <Drawer.Navigator initialRouteName={"TCP Server"}>
                    <Drawer.Screen name={"TCP Server"} component={TCPServerScreen} />
                    <Drawer.Screen name={"TCP Client"} component={TCPClientScreen} />
                </Drawer.Navigator>
            </NavigationContainer>
        </Provider>
    )
}
