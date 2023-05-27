import { StyleSheet, Text, View ,ScrollView,ImageBackground,TouchableOpacity} from 'react-native'
import React,{useState,useEffect} from 'react'
import axios from 'axios';
import { DotIndicator } from 'react-native-indicators';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Line } from '../../Components/styles';
const Profile = ({navigation,route}) => {
    const url='http://192.168.8.102:3000/api/';
    const {userData}=route.params;
    const [profileUser,setProfileUser]=useState({});
    const [name,setName]=useState('');
    const [number,setNumber]=useState('');
    const [email,setEmail]=useState('');
    const [dob,setDob]=useState('');
    const [dataReady,setDataReady]=useState(false)
    const GetUserData=()=>{
        const userId=userData.id;
        const Link=url+"user/users/"+userId;
        console.log(Link)
        axios.get(Link).then((response)=>{
            if(response.data.status==="SUCCESS!"){
                const user=response.data.data[0];
                const email=user.email;
                 setName(user.fullName)
                 setEmail(email)
                 setNumber(user.phoneNumber)
                 setDob(user.dateOfBirth)
                setDataReady(true)
            }
        }).catch((err)=>console.log(err))
    }
    useEffect(()=>{
        GetUserData();
    },[])
  return (
    <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'flex-start'}}>
      <ScrollView automaticallyAdjustKeyboardInsets={true} bouncesZoom={true}  invertStickyHeaders={true} keyboardDismissMode='on-drag' style={{paddingTop:10}}>
        <View style={styles.container}>
        {!dataReady?
        <DotIndicator color='red' />:
        <View style={{flex:1,justifyContent:'space-evenly',alignItems:'center',width:'100%'}}>
            <MaterialCommunityIcons name="account-tie" size={170} color='#EE2E18' />
            <Text style={styles.title}>پروفایل</Text>
            <Line style={{width:'90%',color:'#1f2937'}}/>
        <View style={styles.dataContainer}>
        <MaterialCommunityIcons name="badge-account-outline" size={30} color='#EE2E18' />
      <Text style={styles.label}>{name}</Text>
        </View>
        <View style={styles.dataContainer}>
        <MaterialCommunityIcons name="email-outline" size={30} color='#EE2E18' />
        <Text style={styles.label}>{email}</Text>
          </View>
          <View style={styles.dataContainer}>
          <MaterialCommunityIcons name="cellphone" size={30} color='#EE2E18' />
          <Text style={styles.label}>{number}</Text>
            </View>
            {dob?
            <View style={styles.dataContainer}>
            <FontAwesome5 name="birthday-cake" size={30} color='#EE2E18' />
            <Text style={styles.label}>{dob}</Text>
              </View>:null}
            <Line style={{width:'90%',color:'#1f2937'}} />
            <TouchableOpacity style={styles.editButton}>
            <MaterialCommunityIcons name="account-edit" size={30} color='#bfbdbd' />
            <Text style={{fontSize:18,color:'white',marginRight:10}}>ویرایش پروفایل</Text>
            </TouchableOpacity>
        </View>
        
        }
       
    </View>
    </ScrollView>
    </ImageBackground>
  )
}

export default Profile

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'space-evenly',
        alignItems:'center',
        paddingVertical:10,
        paddingBottom:20
    },
    title:{
        fontSize:30,
        fontWeight:'bold'
    },
    dataContainer:{
        borderRadius:5,
        borderWidth:1,
        borderColor:'#9ca3af',
        width:'90%',
        alignItems:'center',
        flexDirection:'row-reverse',
        height:55,
        marginVertical:20,
        paddingHorizontal:5,
        backgroundColor:'#9ca3af'
    },
    label:{
        fontWeight:'bold',
        color:'black',
        textAlign:'center',
        alignSelf:'center',
        marginRight:10,
        textAlign:'center'
    },
    editButton:{
        borderRadius:5,
        borderWidth:1,
        borderColor:'#1f2937',
        width:'80%',
        alignItems:'center',
        justifyContent:'center',
        flexDirection:'row-reverse',
        height:60,
        marginVertical:30,
        backgroundColor:'#1f2937',
        marginBottom:30,
    }
})