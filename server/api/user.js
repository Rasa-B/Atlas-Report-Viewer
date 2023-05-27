require('dotenv').config();
const express=require('express');
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json()
const router=express.Router();
const {User,validateUser,Role}=require('../models/User');
const bcrypt=require('bcrypt');
const _=require('loadsh');
const jwt=require('jsonwebtoken');
const auth=require("../Middlewares/auth");
//POST & PUT
router.post('/signup',jsonparser, async (req,res)=>{
        const {error}=validateUser(req.body);
        if(error){
            res.status(422).json({
                status:"FAILED!",
                message:"فیلدها را مطابق نمونه داده‌شده پرکنید"
            })
        }
        // console.log(value);
        //check if this user already exists
        let user=await User.findOne({ email:req.body.email});
        if(user){
            res.json({
            status:"FAILED!",
            message:" قبلاً ثبت‌نام کرده‌اید!"
        })
        }
        else{
            user=new User(_.pick(req.body,['fullName','phoneNumber','email','dateOfBirth','password']));
            const salt=await bcrypt.genSalt(10);
            user.password=await bcrypt.hash(user.password,salt);
            user.email=user.email.toLowerCase();
            if(req.body.role)
                user.role=req.body.role;
            else
                user.role=Role.Basic;
            
            //create token
            const token=jwt.sign({
                user_id:user._id, email:req.body.email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "3h",
            });
            user.token=token;

            await user.save();
            // res.send(_.pick(user,['_id','fullName','phoneNumber','email','dateOfBirth','password','role']));
            res.json({
                status:"SUCCESS!",
                message:"ثبت‌نام با موفقیت انجام‌شد",
                data: user
            })
        }
        
    


    // const {error}=validate(req.body);
    // if(error){
    //     return res.status(400).send(error.details[0].message);
    // }


    // fullName=fullName.trim();
    // phoneNumber=phoneNumber.trim();
    // email=email.trim();
    // dateOfBirth=dateOfBirth.trim();
    // password=password.trim();


    // else if(!(/^[a-zA-z]*$/.test(fullName))){
    //     res.json({
    //         status: "FAILED",
    //         message:"نام و نام خانوادگی را به درستی وارد کنید"
    //     });
    // }else if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
    //     res.json({
    //         status: "FAILED",
    //         message:"ایمیل نامعتبر"
    //     });
    // }
    // else if(!/^09[0|1|2|3][0-9]{8}$/.test(phoneNumber)){
    //     res.json({
    //         status: "FAILED",
    //         message:"شماره موبایل نامعتبر"
    //     });
    // }
    // else if(password.length<8){
    //     res.json({
    //         status: "FAILED",
    //         message:"طول گذرواژه باید حداقل شامل 8 کاراکتر باشد"
    //     });
    // }
    // else{
    //     //chechking if user already exist
    //     User.find({fullName,phoneNumber,email,dateOfBirth,password}).then(result=>{
    //         if(result.length){
    //             //user already exists
    //             res.json({
    //                 status: "FAILED",
    //             message:"شما قبلاً ثبت‌نام کرده‌اید!"
    //             })
    //         }else{
    //             //try to create new user
    //             //password handling
    //             const saltRounds=10;
    //             const salt=bcrypt.genSalt(saltRounds);
    //             bcrypt.hash(password,salt).then(hashedPassword=>{
    //                 const newUser=new User({
    //                     fullName, 
    //                     phoneNumber,
    //                     email,
    //                     dateOfBirth,
    //                     password: hashedPassword
    //                 });
    //                 newUser.save().then(result=>{
    //                     res.json({
    //                         status: "SUCCESS",
    //                         message:"User successfully created!" 
    //                     });
    //                 }).catch(err=>{
    //                     res.json({
    //                         status: "FAILED",
    //                         message:"An error occured while creating user!"
    //                     });
    //                 })
    //             }).catch(err=>{
    //                 res.json({
    //                     status: "FAILED",
    //                     message:"error occured while hashing password!"
    //                 });
    //             })
    //         }
    //     }).catch(err=>{
    //         console.log(err);
    //         res.json({
    //             status: "FAILED",
    //             message:"خط در بررسی وضعیت"
    //         })
    //     })
    // }
    
        
    
});
router.post('/login',(req,res)=>{
    let {email,password}=req.body;
    email=email.trim();
    password=password.trim();
    if(email=="" || password==""){
        res.json({
            status:"FAILED!",
            message:" ایمیل یا گذرواژه خود را وارد نکردید"
        })
    }else{
        //check if user exists
        User.find({email}).then(data=>{
            if(data.length){
                //user exists
                const hashedPassword=data[0].password;
                const role=data[0].role;
                bcrypt.compare(password,hashedPassword).then(result=>{
                    if(result){
                        //create token
                        const token=jwt.sign(
                            {user_id:data[0]._id ,email:data[0].email},
                            process.env.TOKEN_KEY,
                            {
                                expiresIn: "3h",
                            }
                        );
                        //save user token
                        data[0].token=token;
                        if(role==='admin'){
                        res.json({
                            status:"SUCCESS!",
                            message:"خوش‌آمدید ادمین!",
                            data:data[0]
                        })}else{
                            res.json({
                                status:"SUCCESS!",
                                message:"ورود به سیستم با موفقیت انجام‌شد",
                                data:data[0]
                            })
                        }

                    }else{
                        res.json({
                            status:"FAILED!",
                            message:"گذرواژه نادرست می‌باشد"
                        })
                    }
                }).catch(err=>{
                    res.json({
                    status:"FAILED!",
                    message:"خطا در بررسی گذرواژه"})
                })
            }else{
                res.json({
                    status:"FAILED!",
                    message:"ایمیل یا گذرواژه اشتباه است"
                })
            }
        }).catch(err=>{
            res.json({
                status:"FAILED!",
                message:"ایمیل یا گذرواژه اشتباه است"
            })
        })
    }
});

//FETCH
router.get('/users/:id',(req,res)=>{
    let fetchid=req.params.id;
    User.find(({_id:fetchid}),(err,val)=>{
        if(err){
            res.json({
                status:"FAILED!",
                message:"خطا در ارتباط"
            })
        }
        else{
            if(val.length==0){
            res.json({
                status:"FAILED!",
                message:"کاربر یافت‌نشد"
            })
            }else{
            res.json({
                status:"SUCCESS!",
                message:"کاربر با موفقیت یافت‌شد",
                data: val
            })
            }
        }
    })
});
router.get('/users',(req,res)=>{
    User.find().then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در ارتباط"
        })
    })
});
///UPDATE
router.put('/amend/:id',jsonparser,async(req,res)=>{
    let fetchUserId=req.params.id;
   await User.find(({_id:fetchUserId})).then(async (user)=>{
    if(user.length==0){
                //user does not exist
            res.status(404).json({
                status:"FAILED!",
                message:"کاربر یافت‌نشد"
            })
            }else{
                //user found
                let mod_fullname=req.body.fullname || user.fullname ;
                let mod_phoneNumber=req.body.phoneNumber || user.phoneNumber;
                let mod_email=req.body.email || user.email;
                let mod_dob=req.body.dateOfBirth || user.dateOfBirth ;
                let new_password;
                if(req.body.password){
                    new_password=req.body.password;
                    const salt= await bcrypt.genSalt(10);
                    new_password= await bcrypt.hash(new_password,salt);
                }
                else
                    new_password=user.password;
                // user.set({fullName:mod_fullname,phoneNumber:mod_phoneNumber,email:mod_email,dateOfBirth:mod_dob,password:new_password});
                // user.save();
               let updated_user= await User.findOneAndUpdate({_id:fetchUserId},{fullName:mod_fullname,phoneNumber:mod_phoneNumber,email:mod_email,dateOfBirth:mod_dob,password:new_password},{new:true})
               const token=jwt.sign({
                user_id:user._id, email:updated_user.email
            },
            process.env.TOKEN_KEY,
            {
                expiresIn: "3h",
            });
            updated_user.token=token;

            await updated_user.save();
            res.json({
                status:"SUCCESS!",
                message:"اطلاعات با موفقیت بروزرسانی‌شد",
                data:updated_user
            })
        }
    }).catch((err)=>{
        res.status(404).json({
            status:"FAILED!",
            message:"کاربر یافت‌نشد"
        })
    })
})
///DELETE
router.delete('/delete/:id',auth,async(req,res)=>{
    let fetchRepId=req.params.id;
   await User.findByIdAndRemove(fetchRepId).then((result)=>{
        if(result){
            res.json({
                status:"SUCCESS!",
                message:"کاربر با موفقیت حذف‌شد",
            })
        }
        else{
            res.json({
                status:"FAILED!",
                message:"خطا در عملیات.مجدداً تلاش کنید"
            })
        }
    }).catch((err)=>{
            console.log(err);
            res.json({
                status:"FAILED!",
                message:"خطا در ارتباط!"
            })
    })         
})
module.exports=router;



  