import { StyleSheet, Text, View ,ImageBackground,Image,Platform,StatusBar,ScrollView,Button,TouchableHighlight} from 'react-native';
import {React,useState,useCallback,Component,useEffect} from 'react';
import { Colors,StyledContainer,InnerContainer, PageLogo, PageTitle ,StyledButton,ButtonText,Msgbox,Line} from '../../Components/styles';
import { SelectList } from 'react-native-dropdown-select-list';
import { Octicons, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { DotIndicator } from 'react-native-indicators';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
const {brand,darkLight,secondary,primary,tertiary}=Colors;
import ShakeText from "react-native-shake-text";
// import * as Linking from 'expo-linking';
import { A } from '@expo/html-elements';
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
const SearchReports = ({navigation}) => {
        const [isSearching,setSearching]=useState(false);
        const[docReady,setDocReady]=useState(false);
        const [ doc, setDoc ] = useState();
        const types=["application/pdf","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"]
        const [uploadProgress,setUploadProgress]=useState(0);
        const [message,setMessage]=useState('');
        const [validationmessage,setValidationMessage]=useState('');
        const [messageType,setMessageType]=useState();
        const [isSubmitting,setSubmitting]=useState(false);
        const [isValid,setValid]=useState(false);
        const [resColor,setResColor]=useState('red');
        var reqmonth="";
        const [repMonthKey,setRepMonthKey]=useState(0);
        var monthkey=1;
        let redirectUrl='';
        const [resReportUrl,setResReportUrl]=useState("");
        const [resReportWeek,setResReportWeek]=useState("");
        const [resReportMonth,setResReportMonth]=useState("");
        const [resReportYear,setResReportYear]=useState(0);
        const [resReportHalfYear,setResReportHalfYear]=useState("");
        const [resReport,setResReport]=useState("");
        const [dataReady,setDataReady]=useState(false);
        const [reportType,setReportType]=useState('weekly');
        const [monthlyReportType,setMonthlyReportType]=useState('Analytical');
        const[reportWeek,setReportWeek]=useState("");
        const [reportMonth,setReportMonth]=useState("");
        const [reportHalfYear,setReportHalfYear]=useState("");
        const [reportYear,setReportYear]=useState(0);
        const [reportName,setReportName]=useState("");
    
        const reportTypes=[
            {key:'weekly' , value:"هفتگی"},
            {key:'monthly', value:"ماهانه"},
            {key:'semiyearly', value:"شش ماهه"}
        ];
        const monthlyReportTypes=[
            {key:'Analytical',value:"تحلیلی"},
            {key:'Financial',value:"مالی"}    
        ]
        const variableFileds={
            'weekly':[
                {key:'first',value:'هفته اول'},
                {key:'second',value:'هفته دوم'},
                {key:'third',value:'هفته سوم'},
                {key:'fourth',value:'هفته چهارم'}
            ],
            'monthly':[
                {key:'1' , value:'فروردین'},
                {key:'2' , value:'اردیبهشت'},
                {key:'3' , value:'خرداد'},
                {key:'4' , value:'تیر'},
                {key:'5' , value:'مرداد'},
                {key:'6' , value:'شهریور'},
                {key:'7' , value:'مهر'},
                {key:'8' , value:'آبان'},
                {key:'9' , value:'آذر'},
                {key:'10' , value:'دی'},
                {key:'11' , value:'بهمن'},
                {key:'12' , value:'اسفند'}
            ],
            'semiyearly':[
                {key:'1', value:'شش ماه اول'},
                {key:'2', value:'شش ماه دوم'}
            ]
        }
        const weeks=[
            {key:'first',value:'هفته اول'},
            {key:'second',value:'هفته دوم'},
            {key:'third',value:'هفته سوم'},
            {key:'fourth',value:'هفته چهارم'},
        ];
        const months=[
            {key:'1' , value:'فروردین'},
            {key:'2' , value:'اردیبهشت'},
            {key:'3' , value:'خرداد'},
            {key:'4' , value:'تیر'},
            {key:'5' , value:'مرداد'},
            {key:'6' , value:'شهریور'},
            {key:'7' , value:'مهر'},
            {key:'8' , value:'آبان'},
            {key:'9' , value:'آذر'},
            {key:'10' , value:'دی'},
            {key:'11' , value:'بهمن'},
            {key:'12' , value:'اسفند'},
        ];
        const semiAnnuals=[
            {key:'1', value:'شش ماه اول'},
            {key:'2', value:'شش ماه دوم'},
        ];

        const searchDocument = () => {
            setSearching(true);
            setResReportUrl("");
            setDataReady(false);
            setSubmitting(true)
            setMessage('در حال جستجو...');
            setMessageType('FAILED!')
            let url='';
            if(reportType==='weekly'){
                    if(reportWeek=='' || reportMonth=="" || reportYear<1300){
                        setMessage("ماه ، هفته و سال گزارش را وارد‌کنید")
                        setMessageType('FAILED!')
                        setSubmitting(false)
                        setSearching(false);
                    }
                    else{
                url = "http://192.168.8.102:3000/api/weeklyreport/findreport";
                let credentials={}
                let reqWeek=(variableFileds['weekly'].find(object=> object.value===reportWeek)).key;
                credentials.year=reportYear*1;
                url=url+"/"+reqWeek+"/"+repMonthKey+"/"+credentials.year;
                console.log(url);
               axios.get(url).then((response)=>{
                const result=response.data;
                const {message,status,data}=result;
                if(status==="SUCCESS!"){
                    setResReportWeek(result.data.week);
                    setResReportMonth(result.data.month);
                    setResReportYear(result.data.year);
                    const slash="/"
                    var fileUrl=result.data.weeklyReportFile;
                    fileUrl= fileUrl.replace(/\\/g,`${slash}`);
                    setResReportUrl("http://192.168.8.102:3000/"+(fileUrl));
                    console.log(data.weeklyReportFile);
                    setDataReady(true)
                    setResReport(`گزارش ${reportWeek} ${reportMonth} ${reportYear}`);
                    setMessage(message)
                    setMessageType(status)
                    setSearching(false);
                }else{
                    setMessage(message);
                    setMessageType(status);
                    setSearching(false);
                }
               }).catch(err=>{
                console.log(err);
                setSubmitting(false);
                handleMessage("خطا در اتصال به سیستم.لطفاً مجدداً تلاش کنید")
                setSearching(false);
            })
                }
            }
            else if(reportType==="monthly"){
                console.log(reportType);
                if(monthlyReportType==''){
                    setMessage("نوع گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                    setSearching(false);
                }
                else if(reportWeek==""){
                    setMessage("ماه گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                    setSearching(false);
                }
               else if(monthlyReportType!=='Financial') {
                if(reportWeek==""){
                    setMessage("ماه گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSearching(false);
                }
                else{
                    url = "http://192.168.8.102:3000/api/monthlyreport/findreport";
                    let credentials={}
                    let reqmonth=(variableFileds['monthly'].find(object=> object.value===reportWeek)).key;
                    credentials.month=reqmonth;
                    credentials.year=reportYear*1;
                    url=url+"/"+reqmonth+"/"+credentials.year;
                    axios.get(url).then((response)=>{
                     const result=response.data;
                     const {message,status,data}=result;
                     if(status==="SUCCESS!"){
                         setResReportMonth(result.data.month);
                         setResReportYear(result.data.year);
                         const slash="/"
                         var fileUrl=result.data.monthlyReportFile;
                        fileUrl= fileUrl.replace(/\\/g,`${slash}`);
                         setResReportUrl("http://192.168.8.102:3000/"+(fileUrl));
                         console.log(resReportUrl);
                         setDataReady(true);
                         setResReport(`گزارش تحلیلی ${reportWeek} ${reportYear}`)
                         setMessage(message);
                         setMessageType(status);
                         setSearching(false);
                     }else{
                         setMessage(message);
                         setMessageType(status);
                         setSearching(false);
                     }
                    }).catch(err=>{
                     console.log(err);
                     setSubmitting(false);
                     handleMessage("خطا در اتصال به سیستم.لطفاً مجدداً تلاش کنید")
                     setSearching(false);
                 })
            }}
             else{
                url = "http://192.168.8.102:3000/api/financialreports/findreport";
                let credentials={}
                let reqmonth=(variableFileds['monthly'].find(object=> object.value===reportWeek)).key;
                credentials.month=reqmonth;
                credentials.year=reportYear*1;
                url=url+"/"+reqmonth+"/"+credentials.year;
                console.log(url);
                    axios.get(url).then((response)=>{
                     const result=response.data;
                     const {message,status,data}=result;
                     if(status=='SUCCESS!'){
                         setResReportMonth(result.data.month);
                         setResReportYear(result.data.year);
                         const slash="/"
                         var fileUrl=result.data.financialReportFile;
                        fileUrl= fileUrl.replace(/\\/g,`${slash}`);
                         setResReportUrl("http://192.168.8.102:3000/"+(fileUrl));
                         setDataReady(true);
                         setResReport(`گزارش مالی ${reportWeek} ${reportYear}`)
                         setMessage(message);
                         setMessageType(status);
                         console.log(resReportUrl);
                         setSearching(false);
                     }else{
                         setMessage(message);
                         setMessageType(status);
                         setSearching(false);
                     }
                    }).catch(err=>{
                     console.log(err);
                     setSubmitting(false);
                     handleMessage("خطا در اتصال به سیستم.لطفاً مجدداً تلاش کنید")
                     setSearching(false);
                 })
            }
        }
            else{
                if(reportWeek==''){
                    setMessage("نیمه سال مربوط به گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                    setSearching(false);
                }
                else{
                    url = "http://192.168.8.102:3000/api/semiyearlyreports/findreport";
                    let credentials={}
                    let reqSemester=(variableFileds['semiyearly'].find(object=> object.value===reportWeek)).key;
                    credentials.semester=reqSemester;
                    credentials.year=reportYear*1;
                    console.log(credentials)
                    url=url+"/"+reqSemester+"/"+credentials.year;
                    console.log(url);
                    axios.get(url).then((response)=>{
                     const result=response.data;
                     const {message,status,data}=result;
                     if(status=='SUCCESS!'){
                         setResReportHalfYear(result.data.semester);
                         setResReportYear(result.data.year);
                         const slash="/"
                         var fileUrl=result.data.semiyearlyReportFile;
                        fileUrl= fileUrl.replace(/\\/g,`${slash}`);
                         setResReportUrl("http://192.168.8.102:3000/"+(fileUrl));
                         console.log(resReportUrl)
                         setDataReady(true);
                         setResReport(`گزارش تحلیلی ${reportWeek} ${reportYear}`)
                         setMessage(message);
                         setMessageType(status);
                         setSearching(false);                         
                     }else{
                         setMessage(message);
                         setMessageType(status);
                         setSearching(false);
                     }
                    }).catch(err=>{
                     console.log(err);
                     setSubmitting(false);
                     handleMessage("خطا در اتصال به سیستم.لطفاً مجدداً تلاش کنید")
                     setSearching(false);
                 })
            }
            }
        }
        
    
  return (
    <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'flex-start'}}>
    <ScrollView automaticallyAdjustKeyboardInsets={true} bouncesZoom={true} endFillColor={{darkLight}} invertStickyHeaders={true} keyboardDismissMode='on-drag' style={{paddingTop:30}}>
        <StatusBar style="light" />
        <View style={{flex:1,paddingBottom:10}}>

   <StyledContainer style={{flex:1,paddingTop:10}}>
        <InnerContainer>
            <PageLogo resizeMode="cover" source={require('../assets/icons/searchdocument.png')}/>
            <PageTitle>جستجوی گزارش</PageTitle>
            <Line/>
            <View style={{marginTop:30}}><Text style={{fontWeight:'bold',fontSize:25,color:'#1f2937',marginBottom:30}}>اطلاعات گزارش را وارد کنید:</Text></View>
           
            <SelectList
            save='key'
            onSelect={(key)=>{
                // setReportMonth(key)
                console.log(reportType)
            }}
            setSelected={setReportType}
            data={reportTypes}
            placeholder={"نوع گزارش را انتخاب کنید"}
            defaultOption={null}
            maxHeight="120"
            notFoundText='نتیجه‌ای یافت‌نشد'
            boxStyles={{backgroundColor:'#9ca3af',width:'62%',borderColor:'#9ca3af',borderRadius:5,height:50}}
            arrowicon={<FontAwesome name="chevron-down" size={14} color={'red'} />}
            searchicon={<FontAwesome name="search" size={14} color={'red'} />} 
            closeicon={<FontAwesome name="close" size={14} color={'red'} />}
            dropdownStyles={{color:'red'}}
            />
            <SelectList
            save='value'
            onSelect={(value)=>{
                // setReportWeek(value);
                console.log(reportWeek);
            }}
            setSelected={setReportWeek}
            data={variableFileds[reportType]}
            placeholder={"زمان گزارش را انتخاب کنید"}
            defaultOption={variableFileds[reportType][0].value}
            maxHeight="50"
            boxStyles={{backgroundColor:'#9ca3af',width:'62%',marginTop:20,borderColor:'#9ca3af',borderRadius:5,height:50}}
            notFoundText='نتیجه‌ای یافت‌نشد'
            arrowicon={<FontAwesome name="chevron-down" size={14} color={'red'} />}
            searchicon={<FontAwesome name="search" size={14} color={'red'} />} 
            closeicon={<FontAwesome name="close" size={14} color={'red'} />}
            />
        {reportType==='weekly'?
        <SelectList
        save='value'
        onSelect={(value)=>{
            // setReportMonth(value)
            // reportMonth=setState(value)
            monthkey=(variableFileds['monthly'].find(object=> object.value===reportMonth)).key;
            setRepMonthKey(monthkey);
            // setRepMonthKey((variableFileds['monthly'].find(object=> object.value===value)).key);
            reqmonth+=reportMonth;
            console.log(reqmonth);
            console.log(reportMonth+" "+monthkey);
        }}
        setSelected={setReportMonth}
        data={months}
        placeholder={"ماه گزارش را انتخاب کنید"}
        defaultOption={null}
        maxHeight="120"
        notFoundText='نتیجه‌ای یافت‌نشد'
        arrowicon={<FontAwesome name="chevron-down" size={14} color={'red'} />}
        searchicon={<FontAwesome name="search" size={14} color={'red'} />} 
        closeicon={<FontAwesome name="close" size={14} color={'red'} />}
        boxStyles={{backgroundColor:'#9ca3af',width:'62%',marginTop:20,borderColor:'#9ca3af',borderRadius:5,height:50}}
        dropdownStyles={{color:'red'}}
        /> :null
    }
    {reportType=='monthly' ?
     <SelectList
     save='key'
     onSelect={(key)=>{
        //  setMonthlyReportType(key)
         console.log(monthlyReportType+",",reportType)
     }}
     setSelected={setMonthlyReportType}
     data={monthlyReportTypes}
     placeholder={"نوع گزارش را انتخاب کنید"}
     defaultOption={null}
     maxHeight="80"
     notFoundText='نتیجه‌ای یافت‌نشد'
     boxStyles={{backgroundColor:'#9ca3af',width:'62%',borderColor:'#9ca3af',marginTop:20,borderRadius:5,height:50}}
     arrowicon={<FontAwesome name="chevron-down" size={14} color={'red'} />}
     searchicon={<FontAwesome name="search" size={14} color={'red'} />} 
     closeicon={<FontAwesome name="close" size={14} color={'red'} />}
     /> : null
    }
    <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-end',borderColor:'white',borderRadius:10,marginTop:5,width:'90%',height:70}}>

<Text style={{fontWeight:'bold',marginBottom:5}}>
  سال:
</Text>
<TextInput
    style={{
        width:'15%',
        height:'60%', 
        borderWidth: 1,
        borderRadius:10,
        borderColor:'black',
        backgroundColor:'#9ca3af',
        fontStyle:'italic',
        textAlign:'center',
        fontWeight:'bold',
        borderRadius:5,
        height:40
        }}
    onChangeText={setReportYear}
    value={reportYear}
    placeholder="1401"
    placeholderTextColor={'white'}
    keyboardType='numeric'
    keyboardAppearance='dark'
    returnKeyType='done'
    selectTextOnFocus={true}
    textAlign='center'
    textContentType='name'
    underlineColorAndroid={primary}
/>
</View>
   
<Line/>
</InnerContainer>

<View style={{flexDirection:'column',alignItems:'center',flex:1,justifyContent:'space-between'}}>

         
          <ShakeText style={{marginTop:10,marginBottom:10}}>
          <Msgbox type={messageType} style={{marginTop:20,marginBottom:30,fontWeight:'bold'}}>{message}</Msgbox>
          </ShakeText>
          {isSearching?
          <DotIndicator color='red' />
           :null }
          {dataReady?
            <View style={{flexDirection:'row-reverse',justifyContent:'center',alignItems:'center',borderColor:'red',borderRadius:5,width:'90%',alignContent:'center',borderWidth:1,backgroundColor:'#fdd06c',paddingTop:5,paddingBottom:10,flexWrap:'wrap',maxHeight:80,justifyContent:'space-evenly',marginTop:15}}>
            <Ionicons name="ios-document-text-outline" size={24} color="red" />
            <View style={{flexDirection:'row'}}>
                <A href={resReportUrl}>

                <Text style={{color:'#1f2937',fontSize:9,flexWrap:'wrap',flexShrink:1,fontWeight:'bold',textDecorationLine:'underline'}} >
                   {resReport}
                </Text>
                </A>
            </View>
            <TouchableHighlight onPress={async ()=>await WebBrowser.openBrowserAsync(resReportUrl)}>
            <MaterialCommunityIcons name="file-eye-outline" size={20} color="#1f2937" />
            </TouchableHighlight>
      
        </View> 
       :null }

<StyledButton style={{width:'90%',flexDirection:'row-reverse',marginTop:40}} onPress={searchDocument} >
<MaterialCommunityIcons name="file-search-outline" size={30} color="white" />
    <ButtonText style={{marginRight:10}}>
        جستجوی گزارش
    </ButtonText>
</StyledButton>
<Line/>
</View>
</StyledContainer>
        </View>
    </ScrollView>
        </ImageBackground>
  )
}
export default SearchReports;

