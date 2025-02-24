import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home";
import NailCameraScreen from '../screens/nail_camera';
import MyPageScreen from '../screens/my_page';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={HomeScreen} ></Tab.Screen>
            <Tab.Screen name="Camera" component={NailCameraScreen} ></Tab.Screen>
            <Tab.Screen name="My Page" component={MyPageScreen} ></Tab.Screen>
        </Tab.Navigator>
    )
}

export default BottomTabs;