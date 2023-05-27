import 'react-native-gesture-handler';
import { StyleSheet, Text, View ,Button,Image,SafeAreaView,Linking,useWindowDimensions, Dimensions,Title,Caption,Animated, TouchableOpacity} from 'react-native'
import React, {useState,useEffect} from 'react'
import {createDrawerNavigator, DrawerContent,DrawerContentScrollView,DrawerItemList,DrawerItem} from '@react-navigation/drawer'
import { DrawerActions, NavigationContainer } from '@react-navigation/native'
import AdminContactScreen from '../Screens/AdminContactScreen'
import AdminHomeScreen from '../Screens/AdminHomeScreen'
import { Ionicons, MaterialIcons, MaterialCommunityIcons,FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as moment from 'jalali-moment';
// import CustomDrawer from './CustomDrawer';
const Drawer = ({navigation,route}) => {
    const {userData}=route.params;
    const Drawer=createDrawerNavigator();
    const LogoTitle=()=>{
        return(
            <Image 
                style={{width:50,height:50,marginBottom:'50%'}}  
                source={require('../assets/Fardatech.png')}          
            />
        );
    }
    const dimension=useWindowDimensions();
    const drawerType=dimension.width >=700 ? 'permanent' : 'front';
    const [date,setDate]=useState('');
    let options = { year: 'numeric', month: 'long', day: 'numeric' };
    useEffect(()=>{
        let today = new Date().toLocaleDateString('fa-IR', options);
        setDate(today);
    },[])
    // React.useEffect(() => {
    //     const unsubscribe = navigation.addListener('drawerOpen', (e) => {
    //       // Do something
    //     });
      
    //     return unsubscribe;
    //   }, [navigation]);
    
    const CustomDrawer=(props)=>{
        return <View style={{flex:1,justifyContent:'space-evenly'}}>
                 <View style={{backgroundColor:'#EE2E18',height:'26%', justifyContent:'center',alignItems:'center',top:0,position:'absolute',width:'100%',paddingTop:10}}>
                 <Ionicons name="person-circle-outline" size={80} color='#1f2937' />
                    <Text style={{fontWeight:'bold',fontSize:18,color:'white',marginTop:5}}>{userData.fullName}</Text>
                    <Text style={{fontWeight:'bold',fontSize:16,color:'#1f2937',marginTop:20}}>{date}</Text>
                </View>
            <DrawerContentScrollView {...props}>
                <View style={{marginTop:'60%'}}>

                <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>  
            {/* <TouchableOpacity style={{bottom:0}}>
            <MaterialIcons name="logout" size={24} color='red' />
            </TouchableOpacity> */}
            <TouchableOpacity style={{marginBottom:40,borderRadius:5,borderWidth:1,backgroundColor:'#EE2E18',width:'95%',marginLeft:10,borderColor:'#EE2E18',flexDirection:'row',height:45,alignItems:'center',paddingLeft:5}}
                onPress={()=>navigation.navigate('Login')}
            >
            <MaterialIcons name="logout" size={24} color='white' />
            <Text style={{fontWeight:'bold',fontSize:16,color:'white',marginLeft:30}}>خروج</Text>
            {/* <DrawerItem label="خروج" icon={({color})=><MaterialIcons name="logout" size={24} color={color} onPress={()=>navigation.goBack()}/> } /> */}
            </TouchableOpacity>
        </View>      
    }
  return (
    <NavigationContainer independent={true}>
        <Drawer.Navigator initialRouteName="AdminContactScreen" id="LeftDrawer" screenOptions={{headerStyle:{backgroundColor:'#EE2E18'},headerTitle:(props)=><LogoTitle {...props} />,drawerIcon:({size,color})=><Ionicons name="menu-outline" size={24} color={color} />}} drawerStyle={{backgroundColor:'#EE2E18'}} drawerType={drawerType}  drawerContentOptions={{labelStyle:{fontSize:17,fontWeight:'bold'}}} drawerContent={(props)=><CustomDrawer {...props} />}>
       {/* <Drawer.Navigator initialRouteName="AdminContactScreen" id="LeftDrawer" screenOptions={{headerStyle:{backgroundColor:'#EE2E18'},headerTitle:(props)=><LogoTitle {...props} />,drawerIcon:({size,color})=><Ionicons name="menu-outline" size={24} color={color} />,headerLeft:()=><TouchableOpacity style={{marginLeft:10}} onPress={()=>navigation.dispatch(DrawerActions.openDrawer())}><Ionicons name="menu-outline" size={30} color='black' /></TouchableOpacity>}} drawerStyle={{backgroundColor:'#EE2E18'}} drawerType={drawerType}  drawerContentOptions={{labelStyle:{fontSize:17,fontWeight:'bold'}} }> */}
        {/* <Drawer.Navigator initialRouteName="AdminContactScreen" screenOptions={{headerStyle:{backgroundColor:'#EE2E18'},headerTitle:(props)=><LogoTitle {...props} />,drawerIcon:()=><Ionicons name="menu-outline" size={24} color="white" />,drawerLabelStyle:{color:'red'},drawerPosition:'left'}} drawerStyle={{backgroundColor:'#EE2E18'}} drawerType={drawerType} drawerContent={(props)=><CustomDrawer {...props} />} drawerContentOptions={{labelStyle:{fontSize:17,fontWeight:'bold'}}}> */}
            <Drawer.Screen name="صفحه اصلی" component={AdminContactScreen} initialParams={{userData}} independent={true} options={{headerStyle:{backgroundColor:'#EE2E18'},drawerIcon:({size,color})=>(<Ionicons name="ios-home" size={size} color={color} />),drawerPosition:'left',drawerStyle:{backgroundColor:'white'}, drawerActiveTintColor:'red', drawerInactiveTintColor:'#1f2937' }} />
            <Drawer.Screen name="ویرایش پروفایل" component={AdminHomeScreen} initialParams={{userData}}  options={{headerStyle:{backgroundColor:'#EE2E18'},drawerIcon:({size,color})=>(<MaterialCommunityIcons name="account-edit" size={size} color={color} />),drawerPosition:'left',drawerStyle:{backgroundColor:'white'}, drawerActiveTintColor:'red',drawerInactiveTintColor:'#1f2937'}}/>
        </Drawer.Navigator>
    </NavigationContainer>
  )
}

export default Drawer

const styles = StyleSheet.create({})