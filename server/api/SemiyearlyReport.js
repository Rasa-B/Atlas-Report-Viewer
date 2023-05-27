const express=require('express');
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json()
const router=express.Router();
// const storageMonth=require('../Middlewares/Upload');
const {SemiyearlyReport,validateSemiyearlyReport}=require('../models/SemiyearlyReport');
const persianDate=require('persian-date');
const multer = require("multer");
const path=require('path');
const auth=require("../Middlewares/auth");
// const { response } = require('express');
const _=require('loadsh');
const fs = require('fs');
var storageBiannual=multer.diskStorage({
    destination: function(req,file,cb){
            cb(null,'uploads/semiyearlyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})
var upload=multer({
    storage:storageBiannual,
    fileFilter:function(req,file,callback){
        if(
            file.mimetype=="application/pdf" 
        ){
            callback(null,true)
        }else{
            console.log("فقط فایل pdf قابل قبول است");
            callback(null,false);
        }
    },
    limits:{
        fileSize:1024*1024*20
    }
});
const biannuals=[
    {key:'1', value:'شش ماه اول'},
    {key:'2', value:'شش ماه دوم'}
];
// const { report } = require('./user');
// const upload=multer({dest:"uploads/weeklyreports"});
//new persianDate().toLocale('en').format()
router.post('/upload',upload.single("semiyearlyReportFile"),async (req,res)=>{
    try {
        const {error}=validateSemiyearlyReport(req.body);
        if(error){
            await fs.unlinkSync(req.file.path);
            res.status(422).json({
                status:"FAILED!",
                message:"اطلاعات را درست وارد کنید"
            })
        }
        const now=new persianDate().format("LLLL");
        let report=await SemiyearlyReport.findOne({semester:req.body.semester , year:req.body.year});
        if(report){
            const oldFilePath=report.semiyearlyReportFile;
            
            // await fs.unlinkSync(req.file.path);
            if(oldFilePath!==req.file.path)
            await fs.unlinkSync(oldFilePath);
            // report.set({name:req.body.name,createdAt:now,weeklyReportFile:req.file.path})
            report.semiyearlyReportFile=req.file.path;
            report.name=req.body.name;
            report.createdAt=now;
            await report.save();
            res.json({
            status:"SUCCESS!",
            message:"گزارش با موفقیت بروزرسانی شد",
            data:report
        })
        }
        else {
        report=new SemiyearlyReport(_.pick(req.body,['name','semester','year','createdAt','semiyearlyReportFile']));
        
        report.createdAt=now;
        if(req.file){
            // fs.rename(req.file.path, `${report.name}.pdf`, function (err) {
            //     if (err) throw err;
            //     console.log('File Renamed.');
            //   });
            report.semiyearlyReportFile=req.file.path;
        }
        await report.save();
        res.json({
            status:"SUCCESS!",
            message:"گزارش با موفقیت آپلود‌شد",
            data:report
        })}
        
    } catch (err) {
        await fs.unlinkSync(req.file.path);
        res.json({
            status:"FAILED!",
            message:"خطا در آپلود گزارش",
        })
    }
});
//FETCH
router.get('/all',(req,res)=>{
    SemiyearlyReport.find().sort({year:-1}).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در ارتباط"
        })
    })
});
//FIND
router.get('/findreport',jsonparser,(req,res)=>{
    let repSemester=req.body.semester;
    let repYear=req.body.year;
    let report=SemiyearlyReport.findOne({semester:repSemester, year:repYear}).then((result)=>{
        if(result){
        res.json({
            status:"SUCCESS!",
            message:"گزارش با موفقیت یافت‌شد",
            data:result
        })
        }
        else{
            res.json({
                status:"FAILED!",
                message:"گزارشی یافت نشد!"
            })
        }
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در جستجو"
        })
    })
});
//search via url
router.get('/findreport/:bianual/:year',(req,res)=>{
    let fetchBiannual=req.params.bianual;
    let fetchyear=req.params.year;
    let reqBiannual=biannuals.find(object=> object.key===fetchBiannual);


    let report=SemiyearlyReport.findOne({semester:reqBiannual.value , year:fetchyear}).then((result)=>{
        if(result){
        res.json({
            status:"SUCCESS!",
            message:"گزارش با موفقیت یافت‌شد",
            data:result
        })
        }
        else{
            res.json({
                status:"FAILED!",
                message:"گزارشی یافت نشد!"
            })
        }
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در جستجو"
        })
    })

});
///DELETE
router.delete('/delete/:id',async (req,res)=>{
    let fetchRepId=req.params.id;
    // let report=WeeklyReport.findById(fetchRepId);
    // WeeklyReport.deleteOne(report)
    // WeeklyReport.findByIdAndRemove(fetchRepId)
    await SemiyearlyReport.findById(fetchRepId).then(async (result)=>{
        if(result){
            let filepath=result.semiyearlyReportFile;
           await  SemiyearlyReport.deleteOne({_id:fetchRepId});
           if (fs.existsSync(filepath))
            await fs.unlinkSync(filepath);
            res.json({
                status:"SUCCESS!",
                message:"گزارش با موفقیت حذف‌شد",
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