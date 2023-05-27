const mongoose=require('mongoose');
const Joi=require('joi');
const Schema=mongoose.Schema;
const  charRange = [
    '[\u06A9\u06AF\u06C0\u06CC\u060C',
    '\u062A\u062B\u062C\u062D\u062E\u062F',
    '\u063A\u064A\u064B\u064C\u064D\u064E',
    '\u064F\u067E\u0670\u0686\u0698\u200C',
    '\u0621-\u0629\u0630-\u0639\u0641-\u0654]'
    ].join('');
const persianFullName= new RegExp(`^(\\s)*${charRange}+((\\s)*${charRange}(\\s)*)*$`);
const englishFullName=new RegExp(/^([\w]{3,})+\s+([\w\s]{3,})+$/,"i");
const Role={
    Admin:'admin',
    Basic:'basic'
}
// const bcrypt=require('bcrypt');
const UserSchema=new Schema({
    fullName:{
        type:String,
        minlength:5,
        maxlength:50,
         required: true
        },
    phoneNumber: {
        type:String,
        required: true,
    },
    email: {
        type:String,
        minlength:5,
        maxlength:255,
        required: true,
        unique: true
    },
    dateOfBirth: {
        type:String,
        minlength:10,
        maxlength:10
    },
    password:{
        type:String,
        minlength:8,
        maxlength:1024,
        required: true
    },
    role:{
        type:String,
        minlength:5,
        maxlength:5,
        required: true
    },
    token :{
        type:String
    }
});

const User=mongoose.model('User',UserSchema);

async function validateUser(user){
    const schema=Joi.object().keys({
        fullName: Joi.string().pattern(persianFullName).min(5).max(50).required("نام و نام‌خانوادگی خود را وارد نکردید"),
        phoneNumber: Joi.string().pattern(new RegExp('^09[0|1|2|3][0-9]{8}$')).required("شماره موبایل خود را وارد نکردید"),
        email: Joi.string().pattern(new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,"i")).min(5).max(255).required().email(),
        dateOfBirth: Joi.string().pattern(new RegExp(/^((0?[13578]|10|12)(-|\/)((0[0-9])|([12])([0-9]?)|(3[01]?))(-|\/)((\d{4})|(\d{2}))|(0?[2469]|11)(-|\/)((0[0-9])|([12])([0-9]?)|(3[0]?))(-|\/)((\d{4}|\d{2})))/)).min(10).max(10),
        password: Joi.string().min(8).max(1024).required("گذرواژه خود را وارد نکردید"),
        role:Joi.string().min(5).max(5),
});
    return await schema.validateAsync(user);
}
// const schema=Joi.object().keys({
//         fullName: Joi.string().pattern(new RegExp('^[a-zA-z]*$')).min(5).max(50).required(),
//         phoneNumber: Joi.string().pattern(new RegExp('^09[0|1|2|3][0-9]{8}$')).required(),
//         email: Joi.string().pattern(new RegExp('^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$')).min(5).max(255).required().email(),
//         dateOfBirth: Joi.date().iso(),
//         password: Joi.string().min(8).max(1024).required()
// });
// module.exports=User;
exports.User=User;
exports.validateUser=validateUser;
exports.Role=Role;