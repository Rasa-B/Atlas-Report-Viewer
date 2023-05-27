import { StyleSheet, Text, View ,Button,ScrollView,Image} from 'react-native'
import React, {Component} from 'react'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import AddReport from './AddReport';
import ViewReports from './ViewReports';
import SearchReports from './SearchReports';
import Profile from './Profile';
import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons, Ionicons} from '@expo/vector-icons';
const AdminContactScreen = ({navigation,route}) => {
    const {userData}=route.params;
    const role=userData.role;
    const Tab=createBottomTabNavigator();
    const screenOptions=(route,color)=>{
        let iconName;
        switch(route.name){
            case "مشاهده گزارش‌ها":
                iconName="file-document-outline"
                break;
            case "ایجاد گزارش":
                    iconName="file-plus-outline"
                    break;
            case "جستجوی گزارش":
                iconName="file-search-outline" 
                break;
            case "پروفایل":
                iconName="account-circle-outline"
                break;    
            default:
                break;          
        }
        return <MaterialCommunityIcons name={iconName} size={32.5} color={color} />
    }
    const LogoTitle=()=>{
        return(
            <Image 
                style={{width:50,height:50,marginBottom:'50%'}}  
                source={require('../assets/Fardatech.png')}          
            />
        );
    }
    return (
        <NavigationContainer independent={true} >
        <Tab.Navigator initialRouteName='ViewReports' screenOptions={({route})=>({tabBarIcon: ({color})=> screenOptions(route,color) ,  tabBarAactiveTintColor:'white',tabBarInactiveTintColor:'#1f2937',tabBarStyle:{fontWeight:'bold',textShadowColor:'white', textShadowRadius:2,textShadowOffset: {width: -1, height: 1},backgroundColor:'#EE2E18',borderTopColor: '#66666666',elevation:0},headerStyle:{backgroundColor:'transparent',elevation:0,shadowOpacity:0},headerTintColor: '#fff',headerShown:false}) } 
        tabBarOptions={{
            activeTintColor:'white',
            inactiveTintColor:'#1f2937',
            style:{
                backgroundColor:'yellow',
                position:'absolute',
                borderTopColor: '#66666666',
                elevation:0,
            },
            indicatorStyle: {
                backgroundColor: 'red',
                borderBottomColor: 'red',
                borderBottomWidth: 1
              },
        }} >
            
            <Tab.Screen name="مشاهده گزارش‌ها" component={ViewReports} initialParams={{userData}} />
            {role==="admin"?<Tab.Screen name="ایجاد گزارش" component={AddReport} initialParams={{userData}} /> : null}
            <Tab.Screen name="جستجوی گزارش" component={SearchReports} initialParams={{userData}} />
            <Tab.Screen name="پروفایل" component={Profile} initialParams={{userData}} />
   
        </Tab.Navigator>
    </NavigationContainer>
  )
}

export default AdminContactScreen

const styles = StyleSheet.create({
    Lable:{
        textShadowColor:'white',
        textShadowRadius:2,
        textShadowOffset:1,
    }
})