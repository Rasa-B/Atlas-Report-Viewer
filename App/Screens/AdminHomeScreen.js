import React from 'react';
import { ImageBackground ,StyleSheet, View, Image, Text, Platform, StatusBar, Dimensions} from 'react-native';
import { StyledButton,ButtonText ,PageTitle,SubTitle} from '../../Components/styles';
import {StackActions } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
//import {NavigationContainer} from '@react-navigation/native';
//import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
//import Ionicons from 'react-native-vector-icons/Ionicons';

function AdminHomeScreen({navigation,route}) {
    const {userData}=route.params;
    const fullName=userData.fullName;
    const user=userData
    console.log(user)
  return (
    <View style={styles.container}>
        
   <ImageBackground
   style={styles.image} 
    source={require('../assets/background.jpg')}
    >
        {/* <View style={styles.navbar}></View> */}
        {/* <Image source={require('../assets/Fardatech.png')} resizeMode="cover" style={styles.logo} ></Image> */}
        <View style={styles.navBar}>
        <View style={{flex:1,justifyContent:'center', alignItems:'flex-start'}}>
        <Image source={require('../assets/icons/menu-burger.png')} style={styles.burgerMenu}/>
        </View>
            
            <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
        <Image source={require('../assets/Fardatech.png')}  style={styles.logo} />
        </View>
        <View style={{flex:1,justifyContent:'center', alignItems:'center'}}/>
        </View>
        <View style={{flex:0.20,flexDirection:'row-reverse',justifyContent:'space-evenly',alignItems:'flex-start' }}>
           
            <View style={{ top:'15%' ,borderColor:'black',borderWidth:'2',borderRadius:5,backgroundColor:'gold',width:110,height:60,justifyContent:'center',alignItems:'center'}}>

            <Text style={{fontWeight:'bold'}}>
                مشاهده گزارش
            </Text>
            </View>
            <View style={{ top:'15%' ,borderColor:'black',borderRadius:5,borderWidth:'2',backgroundColor:'gold',width:110,height:60,justifyContent:'center',alignItems:'center'}}>

                <Text style={{fontWeight:'bold'}}>
                       جستجوی گزارش        
                </Text>
            </View>
        </View>
        <View style={{flex:0.1,flexDirection:'column',justifyContent:'center',alignContent:'center'}}>

        <PageTitle welcome={true}>خوش آمدید</PageTitle>
        <View>

        <SubTitle welcome={true}>{fullName || 'کریم باقری'}</SubTitle>
        </View>
        </View>
        <StyledButton onPress={()=>navigation.getParent('root').navigate('Login')}
                    
                     style={{borderRadius:5,width:'60%',alignSelf:'center',top:'50%'}}>
                        <ButtonText>
                            خروج
                        </ButtonText>
                    </StyledButton>
    </ImageBackground> 
    <View style={styles.bottomNav}>

        </View>   
    {/* <Image source={require('../assets/background.jpg')} ></Image> */}
    {/* <View style={styles.navbar}><Text>Salam</Text></View> */}
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
         flex: 1,
        //  alignItems:'flex-start',
        paddingTop:Platform.OS==="android" ? StatusBar.currentHeight : 0,
      },
      image: {
        flex: 0.9,
        justifyContent: 'flex-start',
      },
      navBar:{
    //     color:'white',
    //     fontSize:42,
    //     lineHeight: 84,
    // fontWeight: 'bold',
    // textAlign: 'center',
        // flex:3,
        // width:'100%',
        // height:'12%',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor:'#EE2E18',
        borderColor:'#EE2E18',
        flex:0.14,
        flexDirection:'row-reverse',
        alignSelf:'flex-end'
    },
    bottomNav:{
        backgroundColor:'#EE2E18',
        flex:0.1,
        flexDirection:'row-reverse',
        justifyContent:'space-evenly',
        alignItems:'center'
         //
         //bottom:'-78%',
        //  position:'absolute',
        //flexDirection:'row-reverse',
        // justifyContent:'flex-end',
        // alignItems:'flex-end',
        // alignSelf:'flex-end'
    },
    logo:{
        width:60,
        height:60,
        // marginRight:20,
        // marginTop:50,
        
        // position:'absolute',
        // justifyContent:'center',
        // alignContent:'center',
        top:'10%',
        position:'relative',
    },
    burgerMenu:{
        width:30,
        height:25,
         top:'20%',
        marginLeft:'65%',
        position:'relative'
        // position:"absolute"
    }
})
export default AdminHomeScreen;