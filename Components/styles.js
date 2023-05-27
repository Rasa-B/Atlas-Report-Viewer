import styled from "styled-components";
import { View,Image,Text,StatusBar,TextInput ,TouchableOpacity} from "react-native";
import { Constants } from "expo-constants";
const StatusBarHeight=StatusBar.currentHeight;
export const Colors={
    primary:'#EE2E18',
    secondary:'#e5e7eb',
    tertiary:'#1f2937',
    darkLight:'#9ca3af',
    brand:'#262624',
    green:'#10b981',
    red:'#ef4444',
    crimson:'#9e0909',
    grey:'#bfbdbd',
};
const { primary,secondary,tertiary,darkLight,brand,green,red,crimson,grey}=Colors;
export const StyledContainer=styled.View`
    flex:1;
    padding:25px;
    paddingTop: ${StatusBarHeight+50};
    
`;
export const InnerContainer=styled.View`
    flex:1;
    width:100%;
    align-items:center;
    justifyContent:flex-start;

`;
export const PageLogo=styled.Image`
    width:150px;
    height:150px;
   
`;
export const PageTitle=styled.Text`
    
    font-size:30px;
    text-align:center;
    font-weight:bold;
    color:${brand};
    paddingTop:10px;
    ${(props)=>props.welcome && `
        font-size:35px;
    `}    
`;
export const SubTitle=styled.Text`
    font-size:18px;
    margin-top:2.5%;
    letter-spacing:1px;
    font-weight:bold;
    alignSelf:center;
    color:${tertiary}; 
    ${(props)=>props.welcome && `
    margin-bottom: 5px;
    font-weight:bold;
`}      
`;
export const StyledFormArea=styled.View`
    width:90%;
    margin-top:-15px;
`;
export const StyledTextInput=styled.TextInput`
    background-color:${darkLight};
    padding:15px;
    padding-left:55px;
    padding-right:55px;
    border-radius:5px;
    font-size:14px;
    font-weight:bold;
    height:60px;
    margin-vertical:5%;
    margin-bottom:5px;
    color:${brand};    
`;
export const StyledInputLabel=styled.Text`
    color:${brand};
    font-size:15px;
    font-weight:bold;
    text-align:right;
    margin-top:9%;
    textAlign:right;
`;
export const LeftIcon= styled.View`
    left:15px;
    top:58%;
    position:absolute;
    z-index:1;
`;
export const RightIcon= styled.TouchableOpacity`
    right:15px;
    top:58%;
    width:10%;
    position:absolute;
    z-index:1;
`;
export const StyledButton=styled.TouchableOpacity`
    padding:15px;
    background-color:${props=>props.disabled ? grey : primary};
    justify-content:center;
    align-items:center;
    border-radius:5px;
    margin-vertical:5px;
    height:60px;
`;
export const StyledSignupButton=styled.TouchableOpacity`
    padding:15px;
    background-color:${tertiary};
    justify-content:center;
    align-items:center;
    border-radius:5px;
    margin-vertical:5px;
    height:60px;
`;
export const ButtonText=styled.Text`
    color:${secondary};
    font-size:16px;
    font-weight:bold;
`;
export const Msgbox=styled.Text`
    margin-top:10;
    text-align:center;
    font-size:13px;
    color:${props=>props.type=='SUCCESS!' ? green : red};
`;
export const Line=styled.View`
    height:1px;
    width:100%;
    background-color:${darkLight};
    margin-vertical:15px;

`;
export const ExtraView=styled.View`
    justify-content:center;
    align-content:center;
    padding:10px;
    flex-direction:row-reverse;
`;
export const ExtraText=styled.Text`
    justify-content:center;
    align-content:center;
    color:${tertiary};
    font-size:15px;
    text-align:right;
`;
export const TextLink=styled.TouchableOpacity`
    justify-content:center;
    align-content:center;
`;
export const TextLinkContent=styled.Text`
    color:${primary};
    font-size:15px;
    text-align:right;
`;