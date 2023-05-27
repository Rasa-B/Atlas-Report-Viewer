import { StyleSheet, Text, View ,Image,ScrollView,Platform,StatusBar, ImageBackground,ActivityIndicator} from 'react-native'
import React, {useState,useEffect,useRef} from 'react'
import { Colors,StyledContainer,InnerContainer, PageLogo, PageTitle ,SubTitle,StyledFormArea,LeftIcon,StyledInputLabel,StyledTextInput,RightIcon,StyledButton,ButtonText,Msgbox,Line,StyledSignupButton,ExtraText,ExtraView,TextLink,TextLinkContent} from '../../Components/styles';
import { Formik } from 'formik';
import { State } from 'react-native-gesture-handler';
import { Octicons, Ionicons } from '@expo/vector-icons';
import {StackActions } from '@react-navigation/native';
const {brand,darkLight,secondary,primary,tertiary}=Colors;

//APIs
import axios from 'axios';
// const fetchApi=async ()=>{
//     try {
//         const res= await axios.get('http://localhost:3000/api/user/login')
//         console.log(res.data);
        
//     } catch (error) {
//         console.log(error.message);
//     }
// }
// useEffect(()=>{
//     fetchApi();
// },[])

const Login = ({navigation}) => {
    const [hidePassword,setHidePassword]=useState(true);
    const [message,setMessage]=useState();
    const [messageType,setMessageType]=useState();
    const [getDataReady,setGetDataReady]=useState(true);
    const handleLogin=(credentials,setSubmitting)=>{
        handleMessage(null);
        const url='http://192.168.8.102:3000/api/user/login';
        axios.post(url,credentials).then((response)=>{
            const result=response.data;
            const {message,status,data}=result;
            if(status=='SUCCESS!'){
                const userData={
                    id:result.data._id,
                     fullName:result.data.fullName,
                    // phoneNumber:result.data.phoneNumber,
                    // email:result.data.email,
                    // dateOfBirth:result.data.dateOfBirth, 
                    role:result.data.role                   
                };
                handleMessage(message,status);
                if(data.role==='admin'){                    
                // navigation.navigate("AddReport");
                navigation.navigate("Drawer",{userData});
                handleMessage(null);
                resetValues(credentials);
                }
                else{
                    // navigation.navigate("Signup");
                    // navigation.navigate("AdminHomeScreen",{userData});
                    // navigation.navigate("SearchReports");
                    navigation.navigate("Drawer",{userData});
                    handleMessage(null);
                    resetValues(credentials);
                }
            }
            else{
                handleMessage(message,status);
            }
            // if(status !=='SUCCESS'){
            //     handleMessage(message,status);
            // }else{
            //     navigation.navigate("AdminHomeScreen",{...data[0]});
            // }
            setSubmitting(false);
        }).catch(err=>{
            console.log(err.JSON);
            setSubmitting(false);
            handleMessage("خطا در اتصال به سیستم.لطفاً مجدداً تلاش کنید")
        })
    }
    const handleMessage=(message,type='FAILED!')=>{
        setMessage(message);
        setMessageType(type);
    }
    const resetValues=(values)=>{
        values.email='';
        values.password='';
    }
  return (

        <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'flex-start'}}>
    <ScrollView automaticallyAdjustKeyboardInsets={true} bouncesZoom={true} endFillColor={{darkLight}} invertStickyHeaders={true} keyboardDismissMode='on-drag' style={{paddingTop:30}}>
        <StatusBar style="light" />
        <View style={{flex:1,paddingBottom:10}}>

   <StyledContainer style={{flex:1,paddingTop:10}}>
        <InnerContainer>
            <PageLogo resizeMode="cover" source={require('../assets/Fardatech.png')}/>
            <PageTitle>Fardatech</PageTitle>
            <SubTitle>ورود به سیستم</SubTitle>
            <Line/>
            <Formik
            initialValues={{email:'',password:''}}
            onSubmit={(values,{setSubmitting})=>{
                values.email=values.email.toLowerCase();
                if(values.email=="" || values.password==""){
                    handleMessage("ایمیل و گذرواژه خود را وارد نکردید");
                    setSubmitting(false);
                }else{
                    handleLogin(values,setSubmitting);
                }
            }}
            >{({handleChange,handleBlur,handleSubmit,values,isSubmitting})=>
                <StyledFormArea>
                    <MyTextInput 
                    label="ایمیل"
                    icon="mail"
                    placeholder="exp:john.doe@gmail.com"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    keyboardAppearance='dark'
                    returnKeyType='done'
                    textContentType='emailAddress'
                    autoComplete="email"
                    underlineColorAndroid={primary}
                    />
                    {/* <Line/> */}
                    <MyTextInput 
                    label="گذرواژه"
                    icon="lock"
                    placeholder="* * * * * * * * * * * * * * *"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    keyboardAppearance='dark'
                    returnKeyType='go'
                    textContentType='password'
                    underlineColorAndroid={primary}
                    />
                    
                    <Msgbox type={messageType}>{message}</Msgbox>
                    {!isSubmitting && <StyledButton onPress={handleSubmit}  >
                        <ButtonText>
                            ورود
                        </ButtonText>
                    </StyledButton>}
                    {isSubmitting && <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={secondary}/>
                    </StyledButton>}
                    <Line/>
                    <ExtraView>
                        <ExtraText>حساب کاربری ندارید؟</ExtraText>
                    </ExtraView>
                    <StyledSignupButton onPress={()=>{navigation.navigate('Signup');resetValues(values);}}>
                        <ButtonText>
                            ثبت‌نام
                        </ButtonText>
                    </StyledSignupButton>
                </StyledFormArea>
            

            }

            </Formik>
        </InnerContainer>
   </StyledContainer>
        </View>
    </ScrollView>
        </ImageBackground>
  )
}
const MyTextInput=({label,icon,isPassword,hidePassword,setHidePassword,...props})=>{
    return(
        <View style={{top:10}}>
            <LeftIcon>
                <Octicons name={icon} size={30} color={primary} />
            </LeftIcon>
            <StyledInputLabel>
                {label}
            </StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                        <Ionicons name={hidePassword? 'md-eye-off' : 'md-eye'} size={30} color={tertiary}  />
                </RightIcon>
            )}
        </View>
    )
}
export default Login;

const styles = StyleSheet.create({})