import 'react-native-gesture-handler';
import { StyleSheet, Text, View ,Button,Image,SafeAreaView,Linking,useWindowDimensions, Dimensions,Title,Caption,Animated} from 'react-native'
import React from 'react'
import {createDrawerNavigator, DrawerContent,DrawerContentScrollView,DrawerItemList,DrawerItem} from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as moment from 'jalali-moment';
const CustomDrawer = (props) => {
  return (
    <View style={{backgroundColor:'white',flex:1}}>
                {/* <UserView /> */}
                <View StyleSheet={{backgroundColor:'#EE2E18',height:200, justifyContent:'center',alignItems:'center'}}>
                    <Ionicons name="person-circle-outline" size={80} color="white" />
                    <Title>Test</Title>
                    <Caption>test@github.com</Caption>
                </View>
                <DrawerContentScrollView>
                    <DrawerItemList {...props} 
                     activeTintColor={'#EE2E18'}
                    
                    />
                </DrawerContentScrollView>
                <DrawerItem label="خروج" icon={({color})=><MaterialIcons name="logout" size={24} color={color} />} />
            </View>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({})