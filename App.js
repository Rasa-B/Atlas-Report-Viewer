import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import * as Device from 'expo-device';
import * as React from 'react';
import { StyleSheet, Text, View,ScrollView ,ImageBackground, Platform} from 'react-native';
import Tabs from './App/Navigation/Tabs';
import Login from './App/Screens/Login';
import AdminHomeScreen from './App/Screens/AdminHomeScreen';
import Signup from './App/Screens/Signup';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationAction } from 'react-navigation';
import { NavigationContainer,StackActions } from '@react-navigation/native';
import RootStack from './App/Navigation/RootNavigator';
import AddReport from './App/Screens/AddReport';
import ViewReports from './App/Screens/ViewReports';
const Tab=createBottomTabNavigator();
export default function App() {
  return (
  //  <ImageBackground style={{flex:1,paddingTop:Platform.OS==="android" ? StatusBar.currentHeight : 0}} source={require('./App/assets/background.jpg')}>
  //    <Login style={{flex:1}}/>

  //  </ImageBackground>
//   <NavigationContainer style={{backgroundColor:'#EE2E18',}}>

//   <Tab.Navigator>
//   <Tab.Screen name="ورود" component={Login } />
//   <Tab.Screen name="ثبت‌نام" component={Signup }/>
//   <Tab.Screen name="خانه" component={AdminHomeScreen} />
// </Tab.Navigator>
//   </NavigationContainer>

     
    <RootStack />
  
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
