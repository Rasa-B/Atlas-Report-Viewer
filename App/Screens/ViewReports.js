import React, {useState,useEffect,useRef,useNativeDriver,nativeEvent,useSharedValue} from "react";
import { View, Text, StatusBar, Button,TouchableOpacity,ViewToken,contentOffset, TouchableHighlight,StyleSheet,ScrollView,TextInput,SafeAreaView,KeyboardAvoidingView,TouchableWithoutFeedback,Keyboard,Alert,ImageBackground} from "react-native";
import { FlashList } from "@shopify/flash-list";
import axios from 'axios';
import * as WebBrowser from 'expo-web-browser';
import { MaterialCommunityIcons, Ionicons ,AntDesign, FontAwesome5,Octicons,MaterialIcons} from '@expo/vector-icons';
import { DotIndicator } from 'react-native-indicators';
import HighlightText from "@sanar/react-native-highlight-text";
import KeyboardAvoidWrapper from "../../Components/KeyboardAvoidWrapper";
 import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Animated from "react-native-reanimated";
// import { response } from "express";
//  import persianDate from 'persian-date';
// import { set } from "mongoose";
// import { get } from "mongoose";
// const persianDate=require('persian-date');
const ViewReports = ({navigation,route}) => {
    // const {getDataReady}=route.params;
    const {userData}=route.params;
    const role=userData.role;
    const DATA = [
      {
        title: "First Item",
      },
      {
        title: "Second Item",
      },
      {
        title: "third Item",
      },
      {
        title: "fourth Item",
      },
      {
        title: "fifth Item",
      },
      {
        title: "sixth Item",
      },
      {
        title: "seventh Item",
      },
    ];
    const [masterWeeklyData,setMasterWeeklyData]=useState([]);
    const [filterWeeklyData,setFilterWeeklyData]=useState([]);
    const [masterMonthlyData,setMasterMonthlyData]=useState([]);
    const [filterMonthlyData,setFilterMonthlyData]=useState([]);
    const [masterFinancialData,setMasterFinancialData]=useState([]);
    const [filterFinancialData,setFilterFinancialData]=useState([]);
    const [masterSemiyearlyData,setMasterSemiYearlyData]=useState([]);
    const [filterSemiyearlyData,setFilterSemiYearlyData]=useState([]);
    const [weeklyReady,setWeeklyReady]=useState(false);
    const [monthlyReady,setMonthlyReady]=useState(false);
    const [semiyearlyReady,setSemiyearlyReady]=useState(false);
    const [financialReady,setFinancialReady]=useState(false);
    const [weeklySearch,setWeeklySearch]=useState('');
    const [monthlySearch,setMonthlySearch]=useState('');
    const [semiyearlySearch,setSemiyearlySearch]=useState('');
    const [financialSearch,setFinancialSearch]=useState('');
    const weeks=[
        {key:1,value:'هفته اول'},
        {key:2,value:'هفته دوم'},
        {key:3,value:'هفته سوم'},
        {key:4,value:'هفته چهارم'}
    ];
    const months=[
        {key:1 , value:'فروردین'},
        {key:2 , value:'اردیبهشت'},
        {key:3 , value:'خرداد'},
        {key:4 , value:'تیر'},
        {key:5 , value:'مرداد'},
        {key:6 , value:'شهریور'},
        {key:7 , value:'مهر'},
        {key:8 , value:'آبان'},
        {key:9 , value:'آذر'},
        {key:10 , value:'دی'},
        {key:11 , value:'بهمن'},
        {key:12 , value:'اسفند'}
    ];
    const semiyearly=[
        {key:1, value:'شش ماه اول'},
        {key:2, value:'شش ماه دوم'}
    ];
    const compareWeeklyReps=(a,b)=>{
        let a_month,b_month,a_week,b_week;
                    a_month=(months.find(obj=>obj.value===a.month)).key;
                    b_month=months.find(obj=>obj.value===b.month);
                    b_month=b_month.key;
                    a_week=weeks.find(obj=>obj.value===a.week);
                    a_week=a_week.key;
                    b_week=weeks.find(obj=>obj.value===b.week);
                    b_week=b_week.key;
                    if(a.year<b.year)
                        return 1;
                    else if(a.year==b.year){
                        if(a_month<b_month)
                          return 1;
                      else if(a_month==b_month){
                          if(a_week<b_week)
                          return 1;
                          else
                          return -1;
                      }
                      else
                      return -1;
                    }
                    else
                    return -1;
    }
    const compareMonthlyReps=(a,b)=>{
        let a_month,b_month;
        a_month=(months.find(obj=>obj.value===a.month)).key;
        b_month=months.find(obj=>obj.value===b.month);
        b_month=b_month.key;
        
        if(a.year<b.year){
           return 1
        }
        else if(a.year==b.year){
            if(a_month<b_month)
            return 1;
            else
            return -1;
        }
        else
        return -1;
          
      }
      const compareSemiYearlyReps=(a,b)=>{
        let a_semester,b_semester;
        a_semester=(semiyearly.find(obj=>obj.value===a.semester)).key;
        b_semester=(semiyearly.find(obj=>obj.value===b.semester)).key;
        if(a.year<b.year){
 return 1
}
else if(a.year==b.year){
  if(a_semester<b_semester)
  return 1;
  else
  return -1;
}
else
return -1;

    }
    const scrollY=useRef(new Animated.Value(0)).current;
   // const viewableItems=useSharedValue<ViewToken[]>([])
    const getMonthlyData=()=>{
        setMonthlyReady(false);
        axios.get('http://192.168.8.102:3000/api/monthlyreport/all').then((response)=>{
            setMasterMonthlyData(response.data.sort(compareMonthlyReps))
            setFilterMonthlyData(response.data.sort(compareMonthlyReps))
            setMonthlyReady(true);
    }).catch((err)=>console.log(err))
    }
    const getSemiYearlyData=()=>{
        setSemiyearlyReady(false);
        axios.get('http://192.168.8.102:3000/api/semiyearlyreports/all').then((response)=>{
            setMasterSemiYearlyData(response.data.sort(compareSemiYearlyReps))
            setFilterSemiYearlyData(response.data.sort(compareSemiYearlyReps))
            setSemiyearlyReady(true);
    }).catch((err)=>console.log(err))
    }
    const getFinancialData=()=>{
        setFinancialReady(false);
        axios.get('http://192.168.8.102:3000/api/financialreports/all').then((response)=>{
            setMasterFinancialData(response.data.sort(compareMonthlyReps))
            setFilterFinancialData(response.data.sort(compareMonthlyReps))
            setFinancialReady(true);
    }).catch((err)=>console.log(err))
    }
    const getWeeklyData= ()=>{
            setWeeklyReady(false);
            axios.get('http://192.168.8.102:3000/api/weeklyreport/all').then((response)=>{
                setMasterWeeklyData(response.data.filter((rep)=>{
                    if(rep.month=='undefined'){
                    return false;
                    }
                    return true;
                }).sort(compareWeeklyReps));
                setFilterWeeklyData(response.data.filter((rep)=>{
                    if(rep.month=='undefined'){
                    return false;
                    }
                    return true;
                }).sort(compareWeeklyReps));
                setWeeklyReady(true);
        }).catch((err)=>console.log(err))
            }
        const deleteWeeklyReport=(itemID,index)=>{
            let url="http://192.168.8.102:3000/api/weeklyreport/delete/";
            // ur=url+itemID;
            axios.delete(url+itemID).then((response)=>{
                if(response.data.status==="SUCCESS!"){
                    console.log(index)
                    console.log(response.data)
                   // setFilterWeeklyData(filterWeeklyData.splice(index,1))
                   filterWeeklyData.splice(index,1)

                   //test delete cmed line below
                   //setWeeklyReady(false);
            axios.get('http://192.168.8.102:3000/api/weeklyreport/all').then((response)=>{
                setMasterWeeklyData(response.data.filter((rep)=>{
                    if(rep.month=='undefined'){
                    return false;
                    }
                    return true;
                }).sort(compareWeeklyReps));
            //     setFilterWeeklyData(response.data.filter((rep)=>{
            //         if(rep.month=='undefined'){
            //         return false;
            //         }
            //         return true;
            //     }).sort(compareWeeklyReps));
            //    setWeeklyReady(true);
            //test delete cmed block above
        }).catch((err)=>console.log(err))
                }
            }).catch((err)=>console.log(err))
        }
        const deleteMonthlyReport=(itemID)=>{
            let url="http://192.168.8.102:3000/api/monthlyreport/delete/";
            // ur=url+itemID;
            axios.delete(url+itemID).then((response)=>{
                if(response.data.status==="SUCCESS!"){
                    console.log(response.data)
                    setMonthlyReady(false);
        axios.get('http://192.168.8.102:3000/api/monthlyreport/all').then((response)=>{
            setMasterMonthlyData(response.data.sort(compareMonthlyReps))
            setFilterMonthlyData(response.data.sort(compareMonthlyReps))
            setMonthlyReady(true);
    }).catch((err)=>console.log(err))
                }
            }).catch((err)=>console.log(err))
        }
    const deleteSemiyearlyReport=(itemID)=>{
        let url="http://192.168.8.102:3000/api/semiyearlyreports/delete/";
        // ur=url+itemID;
        axios.delete(url+itemID).then((response)=>{
            if(response.data.status==="SUCCESS!"){
                console.log(response.data)
                setSemiyearlyReady(false);
        axios.get('http://192.168.8.102:3000/api/semiyearlyreports/all').then((response)=>{
            setMasterSemiYearlyData(response.data.sort(compareSemiYearlyReps))
            setFilterSemiYearlyData(response.data.sort(compareSemiYearlyReps))
            setSemiyearlyReady(true);
    }).catch((err)=>console.log(err))
            }
        }).catch((err)=>console.log(err))
    }
    const deleteFinancialRep=(itemID)=>{
        let url="http://192.168.8.102:3000/api/financialreports/delete/";
        // ur=url+itemID;
        axios.delete(url+itemID).then((response)=>{
            if(response.data.status==="SUCCESS!"){
                console.log(response.data)
                setFinancialReady(false);
        axios.get('http://192.168.8.102:3000/api/financialreports/all').then((response)=>{
            setMasterFinancialData(response.data.sort(compareMonthlyReps))
            setFilterFinancialData(response.data.sort(compareMonthlyReps))
            setFinancialReady(true);
    }).catch((err)=>console.log(err))
            }
        }).catch((err)=>console.log(err))
    }
    // const scale=scrollY.interpolate({
    //     inputRange,
    //     outputRange:[1,1,1,0]
    // })
    const renderWeeklyItem=({item,index})=>{
            let url="http://192.168.8.102:3000/";
            // const inputRange=[
            //     -1,
            //     0,
            //     60*index,
            //     60*(index+2)
            // ]
            
            // let date=persianDate(item.createdAt).format("LLL")
            // let options = {
            //     weekday: "long",
            //     year: "numeric",
            //     month: "long",
            //     day: "numeric",
            //     hour: "numeric",
            //     minute: "numeric",
            //     second: "numeric",
                
            //     timeZoneName: "short",
            //   };
            // let date=new Intl.DateTimeFormat("fa-IR",options).format(item.createdAt);
            var fileUrl=item.weeklyReportFile;
            fileUrl= url+fileUrl.replace(/\\/g,`/`);
            let id=item._id;
            //<HighlightText highlightStyle={{backgroundColor:'yellow'}} searchWords={weeklySearch} textToHighlight=`گزارش ${item.week} ${item.month} ${item.year}` />
            return (
                
            <View  style={styles.lisItem}>
               <MaterialCommunityIcons name="file-chart-outline" size={20} color="#EE2E18" />
               <Text style={{textAlign:'center',fontWeight:'bold'}}>گزارش {item.week} {item.month} {item.year}</Text>
               <TouchableHighlight onPress={async ()=>await WebBrowser.openBrowserAsync(fileUrl)}>
            <MaterialCommunityIcons name="file-eye-outline" size={22} color="#1f2937" />
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>Alert.alert('آپلود‌شده در تاریخ',item.createdAt,[{text:'بستن پنجره'}])}>
            <AntDesign name="infocirlceo" size={20} color="red" />
            </TouchableHighlight>
            {role==="admin"?
             <TouchableHighlight onPress={()=>Alert.alert('آیا از حذف‌کردن این گزارش مطمئن هستید؟','',[{text:'بله',onPress:()=>deleteWeeklyReport(id,index)},{text:'خیر'}])}>

                 <AntDesign name="delete" size={20} color="black" />
             </TouchableHighlight>  :null}
                    </View>
                    )};
    const renderMonthlyItem=({item})=>{
            let url="http://192.168.8.102:3000/";
            const slash="/"
            // let date=persianDate(item.createdAt).format("LLL")
            var fileUrl=item.monthlyReportFile;
            let id=item._id;
            fileUrl= url+fileUrl.replace(/\\/g,`/`);
            return (
                
            <View  style={styles.lisItem}>
               <MaterialCommunityIcons name="file-chart-outline" size={20} color="#EE2E18" />
               <Text style={{textAlign:'center',fontWeight:'bold'}}>گزارش تحلیلی {item.month} {item.year}</Text>
               <TouchableHighlight onPress={async ()=>await WebBrowser.openBrowserAsync(fileUrl)}>
            <MaterialCommunityIcons name="file-eye-outline" size={22} color="#1f2937" />
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>Alert.alert('آپلود‌شده در تاریخ',item.createdAt,[{text:'بستن پنجره'}])}>
            <AntDesign name="infocirlceo" size={20} color="red" />
            </TouchableHighlight>
            {role==="admin"?
             <TouchableHighlight onPress={()=>Alert.alert('آیا از حذف‌کردن این گزارش مطمئن هستید؟','',[{text:'بله',onPress:()=>deleteMonthlyReport(id)},{text:'خیر'}])}>

                 <AntDesign name="delete" size={20} color="black" />
             </TouchableHighlight>  :null}
                    </View>
                    )};
    const renderSemiYearlyItem=({item})=>{
            let url="http://192.168.8.102:3000/";
            const slash="/"
            let id=item._id;
            // let date=persianDate(item.createdAt).format("LLL")
            var fileUrl=item.semiyearlyReportFile;
            fileUrl= url+fileUrl.replace(/\\/g,`/`);
            return (
                
            <View  style={styles.lisItem}>
               <MaterialCommunityIcons name="file-chart-outline" size={20} color="#EE2E18" />
               <Text style={{textAlign:'center',fontWeight:'bold'}}>گزارش تحلیلی {item.semester} {item.year}</Text>
               <TouchableHighlight onPress={async ()=>await WebBrowser.openBrowserAsync(fileUrl)}>
            <MaterialCommunityIcons name="file-eye-outline" size={22} color="#1f2937" />
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>Alert.alert('آپلود‌شده در تاریخ',item.createdAt,[{text:'بستن پنجره'}])}>
            <AntDesign name="infocirlceo" size={20} color="red" />
            </TouchableHighlight>
            {role==="admin"?
             <TouchableHighlight onPress={()=>Alert.alert('آیا از حذف‌کردن این گزارش مطمئن هستید؟','',[{text:'بله',onPress:()=>deleteSemiyearlyReport(id)},{text:'خیر'}])}>

                 <AntDesign name="delete" size={20} color="black" />
             </TouchableHighlight>  :null}
                    </View>
                    )};
    const renderFinancialItem=({item})=>{
            let url="http://192.168.8.102:3000/";
            const slash="/"
            let id=item._id;
            // let date=persianDate(item.createdAt).format("LLL")
            var fileUrl=item.financialReportFile;
            fileUrl= url+fileUrl.replace(/\\/g,`/`);
            return (
                
            <View  style={styles.financialItem}>
               <FontAwesome5 name="file-invoice-dollar" size={20} color="#1D6F42" />
               <Text style={{textAlign:'center',fontWeight:'bold'}}>گزارش مالی {item.month} {item.year}</Text>
               <TouchableHighlight onPress={async ()=>await WebBrowser.openBrowserAsync(fileUrl)}>
            <MaterialCommunityIcons name="file-eye-outline" size={22} color="#1f2937" />
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>Alert.alert('آپلود‌شده در تاریخ',item.createdAt,[{text:'بستن پنجره'}])}>
            <AntDesign name="infocirlceo" size={20} color="#1D6F42" />
            </TouchableHighlight>
            {role==="admin"?
             <TouchableHighlight onPress={()=>Alert.alert('آیا از حذف‌کردن این گزارش مطمئن هستید؟','',[{text:'بله',onPress:()=>deleteFinancialRep(id)},{text:'خیر'}])}>

                 <AntDesign name="delete" size={20} color="black" />
             </TouchableHighlight>  :null}
                    </View>
                    )};
    const getData=()=>{
        getWeeklyData();
        getMonthlyData();
        getSemiYearlyData();
        getFinancialData();
    }
    useEffect(() => {
        getData();
        return () => {
        
        };
    }, []);
    const searchWeekReps=(text)=>{
        if(text){
            const newData=masterWeeklyData.filter((item)=>{
                const itemWeek=item.week;
                const itemMonth=item.month;
                const itemYear=item.year.toString();
                return (itemWeek.includes(text) || itemMonth.includes(text) || itemYear.includes(text))
            })
            setFilterWeeklyData(newData);
            setWeeklySearch(text);
        }
        else{
            setFilterWeeklyData(masterWeeklyData);
            setWeeklySearch(text);
        }
    }
    const searchMonthReps=(text)=>{
        if(text){
            const newData=masterMonthlyData.filter((item)=>{
                const itemMonth=item.month;
                const itemYear=item.year.toString();
                return (itemMonth.includes(text) || itemYear.includes(text))
            })
            setFilterMonthlyData(newData);
            setMonthlySearch(text);
        }
        else{
            setFilterMonthlyData(masterMonthlyData);
            setMonthlySearch(text);
        }
    }
    const searchAnnualReps=(text)=>{
        if(text){
            const newData=masterSemiyearlyData.filter((item)=>{
                const itemMonth=item.semester;
                const itemYear=item.year.toString();
                return (itemMonth.includes(text) || itemYear.includes(text))
            })
            setFilterSemiYearlyData(newData);
            setSemiyearlySearch(text);
        }
        else{
            setFilterSemiYearlyData(masterSemiyearlyData);
            setSemiyearlySearch(text);
        }
    }
    
    const searchFinanciallReps=(text)=>{
        if(text){
           
            const newData=masterFinancialData.filter((item)=>{
                const itemMonth=item.month;
                const itemYear=item.year.toString();
                return (itemMonth.includes(text) || itemYear.includes(text))
            })
            setFilterFinancialData(newData);
            setFinancialSearch(text);
        }
        else{
            setFilterFinancialData(masterFinancialData);
            setFinancialSearch(text);
          
        }
    }
  return (
    <ImageBackground source={require('../assets/background.jpg')} resizeMode="cover" style={{ flex:1,justifyContent: 'center'}}>
    <View style={{flex:1}}>
       
    <View style={{flex:1,alignItems:'center',justifyContent:'space-evenly',paddingBottom:20}}>
        
    <View style={styles.listContainer}>
        <View style={styles.listHeader}>
            
            <Text style={{color:'white',textAlign:'center',fontWeight:'bold'}}>گزارش‌های تحلیلی هفتگی</Text>
            
        </View>
        <View style={{flexDirection:'row-reverse',alignItems:'center',height:30,backgroundColor:'grey',justifyContent:'space-evenly',paddingHorizontal:5}}>
        <Octicons name="search" size={17.5} color="black" />
        
        <TextInput style={styles.searchBar}
        value={weeklySearch}
        onChangeText={(text)=>searchWeekReps(text)}
        textAlign='right'
        placeholder="جستجو..."
        placeholderTextColor={'white'}
        keyboardAppearance='dark'
        returnKeyType='search'
        cursorColor='red'
        blurOnSubmit={true}
        
        />
        <TouchableHighlight onPress={()=>{if(weeklySearch=='') return;setWeeklySearch("");getWeeklyData();}}>
        <MaterialIcons name="cancel" size={17.5} color="black" />
        </TouchableHighlight>
        </View>
        {weeklyReady?<FlashList
            
          data={filterWeeklyData}
          renderItem={renderWeeklyItem}
          estimatedItemSize={5}
          nestedScrollEnabled={true}
          
        />:
        <DotIndicator color='red' />}
    </View>
    <View style={styles.listContainer}>
        <View style={styles.listHeader}><Text style={{color:'white',textAlign:'center',fontWeight:'bold'}}>گزارش‌های تحلیلی ماهانه</Text>
        </View>
        <View style={{flexDirection:'row-reverse',alignItems:'center',height:30,backgroundColor:'grey',justifyContent:'space-evenly',paddingHorizontal:5}}>
        <Octicons name="search" size={17.5} color="black" />
        <TextInput style={styles.searchBar}
        value={monthlySearch}
        onChangeText={(text)=>searchMonthReps(text)}
        textAlign='right'
        placeholder="جستجو..."
        placeholderTextColor={'white'}
        keyboardAppearance='dark'
        returnKeyType='search'
        cursorColor='red'
        blurOnSubmit={true}
        
        />
        <TouchableHighlight onPress={()=>{if(monthlySearch=='') return;setMonthlySearch("");getMonthlyData();}}>
        <MaterialIcons name="cancel" size={17.5} color="black" />
        </TouchableHighlight>
        </View>
        {monthlyReady?<FlashList
          data={filterMonthlyData}
          renderItem={renderMonthlyItem}
          estimatedItemSize={5}
          nestedScrollEnabled={true}
        />:
        <DotIndicator color='red' />}
    </View>
    <View style={styles.listContainer}>
        <View style={styles.listHeader}><Text style={{color:'white',textAlign:'center',fontWeight:'bold'}}>گزارش‌های تحلیلی شش ماهه</Text></View>
        <View style={{flexDirection:'row-reverse',alignItems:'center',height:30,backgroundColor:'grey',justifyContent:'space-evenly',paddingHorizontal:5}}>
        <Octicons name="search" size={20} color="black" />
        <TextInput style={styles.searchBar}
        value={semiyearlySearch}
        onChangeText={(text)=>searchAnnualReps(text)}
        textAlign='right'
        placeholder="جستجو..."
        placeholderTextColor={'white'}
        keyboardAppearance='dark'
        returnKeyType='search'
        cursorColor='red'
        blurOnSubmit={true}
        
        />
        <TouchableHighlight onPress={()=>{if(semiyearlySearch=='') return;setSemiyearlySearch('');getSemiYearlyData();}}>
        <MaterialIcons name="cancel" size={20} color="black" />
        </TouchableHighlight>
        </View>
        {semiyearlyReady?<FlashList
          data={filterSemiyearlyData}
          renderItem={renderSemiYearlyItem}
          estimatedItemSize={5}
          nestedScrollEnabled={true}
        />:
        <DotIndicator color='red' />}
    </View>
    <View style={styles.financialListContainer}>
        <KeyboardAvoidingView behavior="padding" style={{flex:1}}>
        
        <View style={styles.financialListHeadr}><Text style={{color:'white',textAlign:'center',fontWeight:'bold'}}>گزارش‌های مالی ماهانه</Text></View>
        <View style={{flexDirection:'row-reverse',alignItems:'center',height:30,backgroundColor:'grey',justifyContent:'space-evenly',paddingHorizontal:5}}>
        <Octicons name="search" size={20} color="black" />
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{flex:1}}> 
        <TextInput style={styles.searchBar}
        value={financialSearch}
        onChangeText={(text)=>searchFinanciallReps(text)}
        textAlign='right'
        placeholder="جستجو..."
        placeholderTextColor={'white'}
        keyboardAppearance='dark'
        returnKeyType='search'
        cursorColor='red'
        blurOnSubmit={true}
        
        />
        </View>
        </TouchableWithoutFeedback>
        
        
        <TouchableHighlight onPress={()=>{if(financialSearch=='') return;setFinancialSearch("");getFinancialData();}}>
        <MaterialIcons name="cancel" size={20} color="black" />
        </TouchableHighlight>
        </View>
        {financialReady?<FlashList
          data={filterFinancialData}
          renderItem={renderFinancialItem}
          estimatedItemSize={5}
          nestedScrollEnabled={true}
        />:
        <DotIndicator color='green' />}
        
    </KeyboardAvoidingView>
    </View>
    
    </View>
    
    </View>
    </ImageBackground>
  );
};
export default ViewReports;
const styles = StyleSheet.create({
    listContainer:{
        flex:0.25,
        borderColor:'#EE2E18',
        borderRadius:8,
        marginTop:40,
        backgroundColor:'#9ca3af',
        width:'85%',
        borderWidth:2,
    },
    financialListContainer:{
        flex:0.25,
        borderColor:'#1D6F42',
        borderRadius:8,
        marginTop:40,
        backgroundColor:'white',
        width:'85%',
        borderWidth:2,
    },
    listHeader:{
        flexDirection:'row-reverse',
        justifyContent:'space-between',
        alignItems:'center',
        backgroundColor:'#EE2E18',
        height:'30%',
        borderTopEndRadius:5,
        borderTopLeftRadius:5,
        justifyContent:'center',
        borderTopLeftRadius:5,
        borderBottomColor:'#262624',
        borderBottomWidth:2,
        paddingTop:3,
    },
    financialListHeadr:{
        backgroundColor:'#1D6F42',
        height:'30%',
        borderTopEndRadius:5,
        justifyContent:'center',
        borderTopLeftRadius:5,
        borderBottomColor:'#262624',
        borderBottomWidth:3,
    },
    lisItem:{
        flexDirection:'row-reverse',
        flexWrap:'wrap',
        borderColor:'#EE2E18',
        borderBottomWidth:2,
        borderTopWidth:2,
        alignItems:'center',
        justifyContent:'space-evenly',
        height:60,
        backgroundColor:'#fdd06c',
        alignContent:'center',
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:10
        },
        shadowOpacity: .3,
        shadowRadius:20,
        
    },
    financialItem:{
        flexDirection:'row-reverse',
        flexWrap:'wrap',
        borderColor:'#1D6F42',
        borderBottomWidth:2,
        alignItems:'center',
        justifyContent:'space-evenly',
        height:60,
        backgroundColor:'white',
        alignContent:'center',
    },
    searchBar:{
        width:'90%',
        height:30,
        backgroundColor:'grey',
        borderRadius:5,
        marginRight:5,
        
       
    }
})