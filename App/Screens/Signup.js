import { StyleSheet, Text, View ,Image,ScrollView,Platform,StatusBar, ImageBackground,TouchableOpacity,ActivityIndicator} from 'react-native'
import React, {useState} from 'react'
import { Colors,StyledContainer,InnerContainer, PageLogo, PageTitle ,SubTitle,StyledFormArea,LeftIcon,StyledInputLabel,StyledTextInput,RightIcon,StyledButton,ButtonText,Msgbox,Line,StyledSignupButton,ExtraText,ExtraView,TextLink,TextLinkContent} from '../../Components/styles';
import { Formik } from 'formik';
import { Octicons, Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as yup from 'yup';
import * as Progress from 'react-native-progress';
import {StackActions } from '@react-navigation/native';
const {brand,darkLight,secondary,primary,tertiary,red,green}=Colors;
const  charRange = [
    '[\u06A9\u06AF\u06C0\u06CC\u060C',
    '\u062A\u062B\u062C\u062D\u062E\u062F',
    '\u063A\u064A\u064B\u064C\u064D\u064E',
    '\u064F\u067E\u0670\u0686\u0698\u200C',
    '\u0621-\u0629\u0630-\u0639\u0641-\u0654]'
    ].join('');
const persianFullName= new RegExp(`^(\\s)*${charRange}+((\\s)*${charRange}(\\s)*)*$`);
const extraWhiteSpace=/\s+/g;
const signupValidation=yup.object().shape({
    fullName:yup.string().trim().matches(persianFullName,"نام و نام‌خانوادگی خود را به صورت فارسی وارد کنید").min(5,'نام و نام‌خانوادگی خود را کامل وارد نکردید').max(50).required('نام و نام‌خانوادگی خود را وارد نکردید'),
    phoneNumber: yup.string().matches(new RegExp('^09[0|1|2|3][0-9]{8}$'),"شماره موبایل نامعتبر است").length(11).required("شماره موبایل خود را وارد نکردید"),
    email:yup.string().email("ایمیل وارد شده نامعتبر می‌باشد").required("ایمیل خود را وارد نکردید"),
    password: yup.string().min(8,()=>`طول گذرواژه باید حداقل 8 کاراکتر باشد`).max(1024).required("گذرواژه خود را وارد نکردید"),
    confirmPassword:yup.string().min(8,()=>`طول گذرواژه باید حداقل 8 کاراکتر باشد`).max(1024).required("گذرواژه خود را تکرار نکردید")
})
const Signup = ({navigation}) => {
    const [hidePassword,setHidePassword]=useState(true);
    const [show,setShow]=useState(false);
    const [date,setDate]=useState(new Date(2000,1,1));
    const [dob,setDob]=useState();
    const [mode, setMode] = useState('date');
    const [message,setMessage]=useState();
    const [messageType,setMessageType]=useState();
    
    
    const onChange=(event,selectedDate)=>{
        const currentDate=selectedDate || date;
        setShow(false);
        setDate(currentDate);
        setDob(currentDate);

    }
    const showMode = (currentMode) => {
      if (Platform.OS === 'android') {
        setShow(false);
        // for iOS, add a button that closes the picker
      }
      setMode(currentMode);
    };
const showDatePicker=()=>{
  showMode('date');
  setShow(true);

}

const handleSignup=(credentials,setSubmitting)=>{
    handleMessage(null);
    const url='http://192.168.8.102:3000/api/user/signup';
    axios.post(url,credentials).then((response)=>{
        const result=response.data;
        const {message,status,data}=result;
        if(status=='SUCCESS!'){
            const userData={
                role:result.data._id,
                 fullName:result.data.fullName,
                // phoneNumber:result.data.phoneNumber,
                // email:result.data.email,
                // dateOfBirth:result.data.dateOfBirth, 
                role:result.data.role                   
            };
            handleMessage(message,status);                   
            navigation.navigate("AdminContactScreen",{userData});
            handleMessage(null);
            resetValues(credentials);
        }
        else{
            handleMessage(message,status);
        }
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
    values.fullName='';
    values.phoneNumber='';
    values.email='';
    values.dateOfBirth='';
    values.password='';
    values.confirmPassword='';
}
  return (
        <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'flex-start'}}>
    <ScrollView automaticallyAdjustKeyboardInsets={true} bouncesZoom={true} endFillColor={{darkLight}} invertStickyHeaders={true} keyboardDismissMode='on-drag' style={{paddingTop:30}}>
        <View style={{flex:1,paddingBottom:35}}>

   <StyledContainer style={{flex:1,paddingTop:10}}>
        <InnerContainer>
            <PageLogo resizeMode="cover" source={require('../assets/Fardatech.png')}/>
            <PageTitle>Fardatech</PageTitle>
            <SubTitle>ثبت‌نام در سیستم</SubTitle>
            <Line/>
            {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={date}
          is24Hour={true}
          onChange={onChange}
        />
      )}
            <Formik
            initialValues={{fullName:'',phoneNumber:'',email:'',dateOfBirth:'',password:'',confirmPassword:''}}
            onSubmit={(values,{setSubmitting})=>{
                values={...values,dateOfBirth:dob};
                values.email=values.email.toLowerCase();
                values.fullName.trim();
                if(values.fullName=="" ||values.phoneNumber=="" || values.email=="" || values.password==""){
                    handleMessage("فیلدهای ستاره‌دار را  پر نکردید");
                    setSubmitting(false);
                }else if(values.password !== values.confirmPassword){
                    handleMessage("گذرواژه ها یکسان نیستند");
                    setSubmitting(false);
                }
                else{
                    delete values.confirmPassword;
                    values.fullName=values.fullName.trim().replace(extraWhiteSpace,' ');
                    values.email.toLowerCase();
                    handleSignup(values,setSubmitting);
                    resetValues(values);
                }
            }}
            validationSchema={signupValidation}
            >{({handleChange,handleBlur,handleSubmit,values,touched,errors,isValid,isSubmitting})=>
                <StyledFormArea>
                    <MyTextInput 
                    label="نام و نام‌خانوادگی*"
                    icon="person"
                    autoCapitalize="words"
                    placeholder="علی صادقی"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                    autoComplete="name"
                    
                    keyboardAppearance='dark'
                    returnKeyType='done'
                    selectTextOnFocus={true}
                    textAlign='right'
                    textContentType='name'
                    underlineColorAndroid={primary}
                    />
                    {(errors.fullName && touched.fullName) &&
                    <Text style={styles.errorPromt}>{errors.fullName}</Text>
                    }
                    <MyTextInput 
                    label="تلفن همراه*"
                    icon="device-mobile"
                    placeholder="0912XXXXX"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('phoneNumber')}
                    onBlur={handleBlur('phoneNumber')}
                    value={values.phoneNumber}
                    keyboardType="number-pad"
                    autoComplete="cc-number"
                    keyboardAppearance='dark'
                    returnKeyType='done'
                    textContentType='telephoneNumber'
                    underlineColorAndroid={primary}
                    />
                     {(errors.phoneNumber && touched.phoneNumber) &&
                    <Text style={styles.errorPromt}>{errors.phoneNumber}</Text>
                    }
                    <MyTextInput 
                    label="ایمیل*"
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
                    underlineColorAndroid={primary}
                    />
                     {(errors.email && touched.email) &&
                    <Text style={styles.errorPromt}>{errors.email}</Text>
                    }
                    <MyTextInput 
                    label="تاریخ تولد"
                    icon="calendar"
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('dateOfBirth')}
                    onBlur={handleBlur('dateOfBirth')}
                    value={dob? dob.toLocaleDateString() : ''}
                    isDate={true}
                    editable={false}
                    showDatePicker={showDatePicker}
                    returnKeyType='done'
                    />
                    {/* <Line/> */}
                    <MyTextInput 
                    label="گذرواژه*"
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
                    returnKeyType='done'
                    textContentType='password'
                    underlineColorAndroid={primary}
                    />
                     {(errors.password && touched.password) &&
                    <Text style={styles.errorPromt}>{errors.password}</Text>
                    }
                    <MyTextInput 
                    label="تکرار گذرواژه*"
                    icon="check-circle"
                    placeholder="* * * * * * * * * * * * * * *"
                    placeholderTextColor={secondary}
                    placeholderColor={secondary}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={handleBlur('confirmPassword')}
                    value={values.confirmPassword}
                    secureTextEntry={hidePassword}
                    isPassword={true}
                    hidePassword={hidePassword}
                    setHidePassword={setHidePassword}
                    keyboardAppearance='dark'
                    textContentType='password'
                    returnKeyType='go'
                    underlineColorAndroid={primary}
                    />
                     {(errors.confirmPassword && touched.confirmPassword) &&
                    <Text style={styles.errorPromt}>{errors.confirmPassword}</Text>
                    }
                    
                    <Msgbox type={messageType}>{message}</Msgbox>
                    {!isSubmitting && (
                    <StyledButton onPress={handleSubmit} disabled={!isValid}>
                        <ButtonText>
                            ثبت‌نام
                        </ButtonText>
                    </StyledButton>
                    )}
                    {isSubmitting && <StyledButton disabled={true}>
                        <ActivityIndicator size="large" color={secondary}/>
                    </StyledButton>}

                    <Line/>
                    <ExtraView>
                        <ExtraText>قبلاً ثبت‌نام کرده‌اید؟</ExtraText>
                    </ExtraView>
                    <StyledSignupButton onPress={()=>navigation.navigate('Login')}>
                        <ButtonText>
                            ورود
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
const MyTextInput=({label,icon,isPassword,hidePassword,setHidePassword,isDate,showDatePicker,...props})=>{
    return(
        <View style={{top:10}}>
            <LeftIcon>
                <Octicons name={icon} size={30} color={primary} />
            </LeftIcon>
            <StyledInputLabel>
                {label}
            </StyledInputLabel>
            {/* <StyledTextInput {...props}/> */}
            {! isDate && <StyledTextInput {...props} />}
            {isDate && (<TouchableOpacity onPress={showDatePicker}>
              {/* <DateTimePicker mode="date" display="spinner" value={showDatePicker} /> */}
              <StyledTextInput {...props}/>
              </TouchableOpacity> )}
            {isPassword && (
                <RightIcon onPress={()=> setHidePassword(!hidePassword)}>
                        <Ionicons name={hidePassword? 'md-eye-off' : 'md-eye'} size={30} color={tertiary}  />
                </RightIcon>
            )}
        </View>
    )
}
export default Signup;

const styles = StyleSheet.create({
    errorPromt:{
        textAlign:'center',
        fontSize:13,
        color:'#D92D2D',
        fontWeight:'bold',
        marginTop:5,
    }
})