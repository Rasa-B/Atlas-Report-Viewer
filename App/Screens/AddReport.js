import { StyleSheet, Text, View ,ImageBackground,Image,Platform,StatusBar,ScrollView,Button,TouchableHighlight} from 'react-native';
import {React,useState,useCallback,Component} from 'react';
import { Colors,StyledContainer,InnerContainer, PageLogo, PageTitle ,SubTitle,StyledFormArea,LeftIcon,StyledInputLabel,StyledTextInput,RightIcon,StyledButton,ButtonText,Msgbox,Line,StyledSignupButton,ExtraText,ExtraView,TextLink,TextLinkContent} from '../../Components/styles';
import { Formik } from 'formik';
// import {DocumentPicker,types} from 'react-native-document-picker';
import { SelectList } from 'react-native-dropdown-select-list';
import { Octicons, Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Progress from 'react-native-progress';
import { TextInput } from 'react-native-gesture-handler';
import { FontAwesome,AntDesign } from '@expo/vector-icons';
const {brand,darkLight,secondary,primary,tertiary}=Colors;
import * as yup from 'yup';
import ShakeText from "react-native-shake-text";
import AnimatedProgressWheel from 'react-native-progress-wheel';
// import { StyledButton,ButtonText ,PageTitle,SubTitle} from '../../Components/styles';
const AddReport = ({navigation}) => {
    // const [fileResponse, setFileResponse] = useState([]);
    // const handleDocumentSelection = useCallback(async () => {
    //     try {
    //       const response = await DocumentPicker.pick({
    //         presentationStyle: 'fullScreen',
    //         type: [types.pdf],
    //       });
    //       setFileResponse(response);
    //     } catch (err) {
    //       console.warn(err);
    //     }
    //   }, []);
        const[docReady,setDocReady]=useState(false);
        const [ doc, setDoc ] = useState();
        const types=["application/pdf","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet","application/vnd.ms-excel"]
        const [uploadProgress,setUploadProgress]=useState(0);
        const [message,setMessage]=useState('');
        const [validationmessage,setValidationMessage]=useState('');
        const [messageType,setMessageType]=useState();
        const [isSubmitting,setSubmitting]=useState(false);
        const [isValid,setValid]=useState(false);
        const [resColor,setResColor]=useState('red')
        const schema=yup.object().shape({
            reportName:yup.string().trim().required("نام گزارش را وارد نکردید"),
            reportType:yup.string().trim().required("نوع گزارش را وارد نکردید"),
            reportYear:yup.number().positive().integer().min(1300).required("سال گزارش را وارد نکردید")
        })
        const handleSubmit=()=>{
            if(reportName=="" || reportType=="" || reportYear==""){
                handleMessage("همه ی فیلدها را وارد کنید");
                setSubmitting(false);
            }else{
                setSubmitting(true);
                postDocument();
            }
        }
        const  transferCanceled=(evt)=>{
            console.log("آپلود گزارش لغو گردید");
          };
        const handleProgress=(evt)=>{
            setUploadProgress(Math.round((evt.loaded)/(evt.total)));
        }
        const handleMessage=(message,type='FAILED!')=>{
            setMessage(message);
            setMessageType(type);
        }
        const pickDocument = async () => {
            // schema.isVaild({reportName,reportType,reportYear}).then((valid)=>{
            //     setValid(valid);
            // })
            setMessage('')
            setSubmitting(false)
            let result = await DocumentPicker.getDocumentAsync({ type: types, copyToCacheDirectory: true }).then(response => {
                if (response.type == 'success') {          
                  let { name, size, uri } = response;
                  let nameParts = name.split('.');
                  let fileType = nameParts[nameParts.length - 1];
                  var fileToUpload = {
                    name: name,
                    size: size,
                    uri: uri,
                    type: fileType,
                  };
                  console.log(fileToUpload, '...............file')
                  setDoc(fileToUpload);
                  setDocReady(false);
                } 
              });
            // console.log(result);
            // schema.isVaild({reportName:reportName,reportType:reportType,reportYear:reportYear}).then((valid)=>{
            //     setValid(true);
            // })
            // if (reportType=='weekly' && (reportWeek=='' || reportMonth=='')){
            //     setValid(false);
            //     setValidationMessage("ماه و هفته گزارش را وارد نکردید")
            // }

            if(reportName==""){
                setValid(false);
                setValidationMessage("نام گزارش را وارد نکردید")
            }
            else if(reportType==""){
                setValid(false);
                setValidationMessage("نوع گزارش را وارد نکردید")
            }
            else if(reportYear<1300 ){
                setValid(false);
                setValidationMessage("سال گزارش را وارد نکردید")
            }
            else{
                setValid(true);
                setValidationMessage("اطلاعات به درستی وارد شدند")
            }
            console.log("Doc: " + doc.uri);
            console.log("fuck::: " + isValid);
            // schema.isVaild({reportName,reportType,reportYear}).then((valid)=>{
            //     setValid(valid);
            // }).catch(console.log("you fucked up"))
        }
        const pickExcelDocument = async () => {
            let result = await DocumentPicker.getDocumentAsync({ type: "application/vnd.ms-excel", copyToCacheDirectory: true }).then(response => {
                if (response.type == 'success') {          
                  let { name, size, uri } = response;
                  let nameParts = name.split('.');
                  let fileType = nameParts[nameParts.length - 1];
                  var fileToUpload = {
                    name: name,
                    size: size,
                    uri: uri,
                    type: "application/vnd.ms-excel"
                  };
                  console.log(fileToUpload, '...............file')
                  setDoc(fileToUpload);
                  setDocReady(false);
                } 
              });
            // console.log(result);
            console.log("Doc: " + doc.uri);
        }
        const postDocument = () => {
            setUploadProgress(0);
           if(isValid) {
            setSubmitting(true)
            setMessage('در حال آپلود...');
            setMessageType('FAILED!')
            // handleMessage(null);
            let url='';
            if(reportType==='weekly'){
                    if(reportWeek=='' || reportMonth==""){
                        setMessage("ماه و هفته گزارش را وارد نکردید")
                        setMessageType('FAILED!')
                        setSubmitting(false)
                    }
                    else{
                url = "http://192.168.8.102:3000/api/weeklyreport/upload";
               const fileUri = doc.uri;
               const formData = new FormData();
               formData.append('name',`${reportName}`)
               formData.append('week',`${reportWeek}`)
               formData.append('month',`${reportMonth}`)
               formData.append('year',`${reportYear}`)
               formData.append('weeklyReportFile', doc);
               const options = {
                   method: 'POST',
                   body: formData,
                   headers: {
                     Accept: 'application/json',
                     'Content-Type': 'multipart/form-data',
                   },
                };
                //    onUploadProgress: ({loaded,total})=> setProgress(loaded/total)
            //    console.log(formData);
               var xhr = new XMLHttpRequest();
            //    function updateProgress(event) {
            //     if (event.lengthComputable) {
            //       const percentComplete = (event.loaded / event.total) * 100;
            //       // ...
            //     } else {
            //       // Unable to compute progress information since the total size is unknown
            //     }
            //   }
            //   function transferCanceled(evt) {
            //     console.log("آپلود گزارش لغو گردید");
            //   }
               xhr.upload.addEventListener("progress", handleProgress);
               xhr.addEventListener("abort", transferCanceled);
            //    xhr.addEventListener("load",()=>{
            //     setUploadProgress(100);
            //     handleMessage(xhr.response.message,xhr.response.status);
            //    });
               xhr.open('POST',url,true);
               xhr.setRequestHeader("Content-Type: multipart/form-data;");
               xhr.send(formData);
               xhr.onreadystatechange = function() {
                if (xhr.readyState == XMLHttpRequest.DONE) {
                    setUploadProgress(100);
                    let {status,message}=xhr.response;
                    setMessage(JSON.parse(xhr.responseText).message);
                    setResColor('green');
                    setMessageType('SUCCESS!')
                    // handleMessage(xhr.response.message,xhr.response.status);
                    let res = JSON.parse(xhr.responseText);
                    setTimeout(()=>{
                        setSubmitting(false);
                        
                        },2000)
                    // resolve({status: data.main.status, message: });
                    // console.log(res.status);
                }
            }
        }
            //    fetch(url, options).catch((error) => console.log(error));
            }
            else if(reportType==="monthly"){
                if(monthlyReportType==''){
                    setMessage("نوع گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                }
                else if(reportWeek==""){
                    setMessage("ماه گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                }
               else if(monthlyReportType!=='Financial') {
                if(reportMonth==""){
                    setMessage("ماه گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                }
                else{
                url = "http://192.168.8.102:3000/api/monthlyreport/upload";
                const fileUri = doc.uri;
                const formData = new FormData();
                formData.append('name',`${reportName}`)
                formData.append('month',`${reportWeek}`)
                formData.append('year',`${reportYear}`)
                formData.append('monthlyReportFile', doc);
                const options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                    },
                 };
                 //    onUploadProgress: ({loaded,total})=> setProgress(loaded/total)
                // console.log(formData);
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", handleProgress);
                xhr.addEventListener("abort", transferCanceled);
                xhr.open('POST',url,true);
                xhr.setRequestHeader("Content-Type: multipart/form-data;");
                xhr.send(formData);
                xhr.onreadystatechange = function() {
                 if (xhr.readyState == XMLHttpRequest.DONE) {
                    setUploadProgress(100);
                    setMessage(JSON.parse(xhr.responseText).message);
                    setResColor('green');
                    setMessageType('SUCCESS!');
                    // handleMessage(xhr.response.message,xhr.response.status);
                     let res = JSON.parse(xhr.responseText);
                     setTimeout(()=>{
                        setSubmitting(false);
                        
                        },2000)
                     // resolve({status: data.main.status, message: });
                     console.log(res.status);
                 }
             }}}
             else{
                url = "http://192.168.8.102:3000/api/financialreports/upload";
                const fileUri = doc.uri;
                const formData = new FormData();
                formData.append('name',`${reportName}`)
                formData.append('month',`${reportWeek}`)
                formData.append('year',`${reportYear}`)
                formData.append('financialReportFile', doc);
                const options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                    },
                 };
                 //    onUploadProgress: ({loaded,total})=> setProgress(loaded/total)
                // console.log(formData);
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", handleProgress);
                xhr.addEventListener("abort", transferCanceled);
                xhr.open('POST',url,true);
                xhr.setRequestHeader("Content-Type: multipart/form-data;");
                xhr.send(formData);
                xhr.onreadystatechange = function() {
                 if (xhr.readyState == XMLHttpRequest.DONE) {
                    setUploadProgress(100);
                    setMessage(JSON.parse(xhr.responseText).message);
                    setResColor('green');
                    setMessageType('SUCCESS!');
                    // handleMessage(xhr.response.message,xhr.response.status);
                     let res = JSON.parse(xhr.responseText);
                     setTimeout(()=>{
                        setSubmitting(false);
                        
                        },2000)
                     // resolve({status: data.main.status, message: });
                     console.log(res.status);
                 }
             }
                // fetch(url, options).catch((error) => console.log(error));
            }
        }
            else{
                if(reportWeek==''){
                    setMessage("نیمه سال مربوط به گزارش را وارد نکردید")
                    setMessageType('FAILED!')
                    setSubmitting(false)
                }
                else{
                url = "http://192.168.8.102:3000/api/semiyearlyreports/upload";
                const fileUri = doc.uri;
                const formData = new FormData();
                formData.append('name',`${reportName}`)
                formData.append('semester',`${reportWeek}`)
                formData.append('year',`${reportYear}`)
                formData.append('semiyearlyReportFile', doc);
                const options = {
                    method: 'POST',
                    body: formData,
                    headers: {
                      Accept: 'application/json',
                      'Content-Type': 'multipart/form-data',
                    },
                 };
                 //    onUploadProgress: ({loaded,total})=> setProgress(loaded/total)
                //console.log(formData);
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener("progress", handleProgress);
                xhr.addEventListener("abort", transferCanceled);
                xhr.open('POST',url,true);
                xhr.setRequestHeader("Content-Type: multipart/form-data;");
                xhr.send(formData);
                xhr.onreadystatechange = function() {
                 if (xhr.readyState == XMLHttpRequest.DONE) {
                    setUploadProgress(100);
                    setMessage(JSON.parse(xhr.responseText).message);
                    setResColor('green');
                    setMessageType('SUCCESS!');
                    // handleMessage(xhr.response.message,xhr.response.status);
                     let res = JSON.parse(xhr.responseText);
                     setTimeout(()=>setSubmitting(false),2000)
                     // resolve({status: data.main.status, message: });
                     console.log(res.status);
                 }
             }
            }
                //fetch(url, options).catch((error) => console.log(error));
            }
        }
        else{
            setSubmitting(false)
            setMessage("اطلاعات را به درستی وارد نکردید")
            setResColor('red');
            setMessageType('FAILED!')
        }
        }
        
    const [reportType,setReportType]=useState('weekly');
    const [monthlyReportType,setMonthlyReportType]=useState('Analytical');
    const[reportWeek,setReportWeek]=useState("");
    const [reportMonth,setReportMonth]=useState("");
    const [reportHalfYear,setReportHalfYear]=useState("");
    const [reportYear,setReportYear]=useState(1401);
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
  return (
    <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'flex-start'}}>
    <ScrollView automaticallyAdjustKeyboardInsets={true} bouncesZoom={true} endFillColor={{darkLight}} invertStickyHeaders={true} keyboardDismissMode='on-drag' style={{paddingTop:30}}>
        <StatusBar style="light" />
        <View style={{flex:1,paddingBottom:10}}>

   <StyledContainer style={{flex:1,paddingTop:10}}>
        <InnerContainer>
            <PageLogo resizeMode="cover" source={require('../assets/icons/contractIcon.png')}/>
            <PageTitle>ایجاد گزارش</PageTitle>
            <Line/>
            <View style={{marginTop:30}}><Text style={{fontWeight:'bold',fontSize:25,color:'#1f2937'}}>اطلاعات گزارش را وارد کنید:</Text></View>
           <View style={{flex:1,flexDirection:'column',justifyContent:'flex-start',alignItems:'flex-end',borderColor:'white',borderRadius:10,marginTop:30,width:'90%',height:70}}>

                <Text style={{fontWeight:'bold',paddingBottom:8}}>
                 نام گزارش:
                </Text>
                <TextInput
                    style={{
                        width:'100%',
                        height:'60%', 
                        borderWidth: 1,
                        borderRadius:5,
                        borderColor:'black',
                        backgroundColor:'#9ca3af',
                        fontStyle:'italic',
                        textAlign:'right',
                        fontWeight:'bold',
                        }}
                    onChangeText={setReportName}
                    value={reportName}
                    placeholder="گزارش هفته اول اسفند 1401"
                    placeholderTextColor={'white'}
                    keyboardAppearance='dark'
                    returnKeyType='done'
                    selectTextOnFocus={true}
                    textAlign='right'
                    textContentType='name'
                    underlineColorAndroid={primary}
                />
            </View>
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
            boxStyles={{backgroundColor:'#9ca3af',width:'62%',borderColor:'#9ca3af',borderRadius:5,marginTop:10}}
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
            boxStyles={{backgroundColor:'#9ca3af',width:'62%',marginTop:20,borderColor:'#9ca3af',borderRadius:5}}
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
            console.log(reportMonth)
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
        boxStyles={{backgroundColor:'#9ca3af',width:'62%',marginTop:20,borderColor:'#9ca3af',borderRadius:5}}
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
     boxStyles={{backgroundColor:'#9ca3af',width:'62%',borderColor:'#9ca3af',marginTop:20,borderRadius:5}}
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
/>{isValid?<ShakeText style={{marginRight:5,marginTop:2}}><Text style={{color:'green',textAlign:'center',marginRight:15,fontWeight:'bold'}}>{validationmessage}</Text></ShakeText>:<ShakeText style={{marginRight:5}}><Text style={{color:'red',textAlign:'center',marginRight:15,fontWeight:'bold'}}>{message}</Text></ShakeText>}
</View>
   
<Line/>
</InnerContainer>

<View style={{flexDirection:'column',alignItems:'center',flex:1,justifyContent:'space-between'}}>
<StyledButton style={{width:'90%',flexDirection:'row-reverse',backgroundColor:'#1f2937',}} onPress={pickDocument}  >
<AntDesign name="addfile" size={30} color="green" />
    <ButtonText style={{marginRight:15}}>
         انتخاب فایل
    </ButtonText>
</StyledButton>
         {(doc != null ) ?monthlyReportType!='Financial'? (
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderColor:'red',borderRadius:5,width:'90%',alignContent:'center',borderWidth:1,backgroundColor:'#EB9696',paddingTop:5,paddingBottom:10,flexWrap:'wrap',maxHeight:80,justifyContent:'space-between',marginTop:15}}>

                <AntDesign name="pdffile1" size={24} color="red" />
                <View style={{flexDirection:'row'}}>

                    <Text style={{color:'#1f2937',fontSize:9,flexWrap:'wrap',flexShrink:1,fontWeight:'bold'}} >
                        {doc.name && (("."+doc.type)===".pdf") ? doc.name : 'لطفاً فایل پی‌دی‌اف آپلود کنید'}
                        {console.log((("."+doc.type)===".pdf"))}
                    </Text>
                </View>

          <TouchableHighlight onPress={()=>{setSubmitting(false);setMessage('');setValid(false);setDoc(null)}}>

                <View>

          <AntDesign name="delete" size={24} color="black" />
                </View>
          </TouchableHighlight>
          
            </View>
          ):(
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',borderColor:'green',borderRadius:5,width:'90%',alignContent:'center',borderWidth:1,backgroundColor:'#74DD91',paddingTop:5,paddingBottom:10,flexWrap:'wrap',maxHeight:80,justifyContent:'space-between',marginTop:15}}>

                <AntDesign name="exclefile1" size={24} color="#1D6F42" />
                <View style={{flexDirection:'row'}}>

                    <Text style={{color:'#1f2937',fontSize:9,flexWrap:'wrap',flexShrink:1,fontWeight:'bold'}} >
                        {doc.name && (("."+doc.type)===".xls") ? doc.name : 'لطفاً فایل اکسل آپلود کنید'}
                    </Text>
                </View>

          <TouchableHighlight onPress={()=>setDoc(null)}>

                <View>

          <AntDesign name="delete" size={24} color="black" />
                </View>
          </TouchableHighlight>
          
            </View>
          ):<View style={{marginTop:15}}><Text style={{color:'red',fontWeight:'bold',textAlign:'auto'}}>فایلی انتخاب نکردید</Text></View>
          }
          <ShakeText style={{marginTop:10}}>
          <Msgbox type={messageType} style={{marginTop:20,marginBottom:30,fontWeight:'bold'}}>{message}</Msgbox>
          </ShakeText>
          {/* <Progress.Circle size={70} progress={uploadProgress} color='green' unfilledColor='blue' thickness={5} showsText={true} fill='red' /> */}
          {isSubmitting && <View style={{marginTop:10}}><AnimatedProgressWheel size={70} width={10} color={'green'} backgroundColor={'#1f2937'} progress={uploadProgress} fullColor={'green'} duration={5000}/></View>}
<StyledButton style={{width:'90%',flexDirection:'row-reverse',marginTop:40}} onPress={postDocument} disabled={!isValid}>
<Octicons name="upload" size={30} color={'black'} />
    <ButtonText style={{marginRight:10}}>
        آپلود گزارش
    </ButtonText>
</StyledButton>
<Line/>
{/* <View style={{marginTop:20}}/> */}
</View>
</StyledContainer>
        
       
   
        </View>
    </ScrollView>
        </ImageBackground>
  )
}

export default AddReport;

