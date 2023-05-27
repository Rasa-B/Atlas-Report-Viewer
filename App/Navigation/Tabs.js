import React from 'react';
import { ImageBackground ,StyleSheet, View, Image, Text, Platform, StatusBar, Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AdminHomeScreen from '../Screens/AdminHomeScreen';
import Login from '../Screens/Login';
const Tab=createBottomTabNavigator();
const Tabs=()=>{
    return(
        <Tab.Navigator independent={true}>
            <Tab.Screen name="Login" component={Login}/>
            <Tab.Screen name="Admin" component={AdminHomeScreen}/>
        </Tab.Navigator>
    );
}
export default Tabs;