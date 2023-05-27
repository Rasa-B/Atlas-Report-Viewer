import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "../Screens/Login";
import Signup from "../Screens/Signup";
import AdminHomeScreen from "../Screens/AdminHomeScreen";
import AddReport from "../Screens/AddReport";
import ViewReports from "../Screens/ViewReports";
import SearchReports from "../Screens/SearchReports";
import AdminContactScreen from "../Screens/AdminContactScreen";
import Drawer from "./Drawer";
import { Colors } from "../../Components/styles";
const {primary,secondary,tertiary}=Colors;
const stack=createStackNavigator();
const RootStack=()=>{
    return(
        <NavigationContainer  >
            <stack.Navigator id='root' screenOptions={{
                headerStyle:{
                    backgroundColor:'transparent',
                },
                headerShown:false,
                headerTintColor:primary,
                headerTransparent:true,
                headerTitle:'',
                headerLeftContainerStyle:{
                    padding:20,
                }
            }} initialRouteName="Login" >
                <stack.Screen name="Login" component={Login}/>
                <stack.Screen name="Signup" component={Signup}/>
                <stack.Screen options={{headerTintColor:tertiary}} name="AdminHomeScreen" component={AdminHomeScreen}/>
                <stack.Screen options={{headerStyle:{backgroundColor:'#EE2E18'}}} name="AdminContactScreen" component={AdminContactScreen} independent={true}/>
                <stack.Screen options={{headerStyle:{backgroundColor:'#EE2E18'}}} name="Drawer" component={Drawer} independent={true}/>
                {/* <stack.Screen options={{headerTintColor:tertiary}} name="AddReport" component={AddReport}/>
                <stack.Screen options={{headerTintColor:tertiary}} name="ViewReports" component={ViewReports}/>
                <stack.Screen options={{headerTintColor:tertiary}} name="SearchReports" component={SearchReports}/> */}
            </stack.Navigator>
        </NavigationContainer>
    )
}
export default RootStack;