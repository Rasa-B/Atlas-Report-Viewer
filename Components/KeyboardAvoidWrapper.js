import React from "react";
import { KeyboardAvoidingView,ScrollView,Keyboard,TouchableWithoutFeedback } from "react-native";
const KeyboardAvoidWrapper=({children})=>{
    return(
        <KeyboardAvoidingView style={{flex:1}}> 
            
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    {children}
                </TouchableWithoutFeedback>
           
        </KeyboardAvoidingView>
    )
}
export default KeyboardAvoidWrapper;