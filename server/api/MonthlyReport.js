const express=require('express');
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json()
const router=express.Router();
// const storageMonth=require('../Middlewares/Upload');
const {MonthlyReport,validateMonthlyReport}=require('../models/MonthlyReport');
const persianDate=require('persian-date');
const multer = require("multer");
const path=require('path');
// const { response } = require('express');
const _=require('loadsh');
const fs = require('fs');
const auth=require("../Middlewares/auth");
var storageMonth=multer.diskStorage({
    destination: function(req,file,cb){
            cb(null,'uploads/monthlyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})
var upload=multer({
    storage:storageMonth,
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
    {key:'12' , value:'اسفند'}
];
// const { report } = require('./user');
// const upload=multer({dest:"uploads/weeklyreports"});
//new persianDate().toLocale('en').format()
router.post('/upload',upload.single("monthlyReportFile"),async (req,res)=>{
    try {
        const {error}=validateMonthlyReport(req.body);
        if(error){
            await fs.unlinkSync(req.file.path);
            res.status(422).json({
                status:"FAILED!",
                message:"اطلاعات را درست وارد کنید"
            })
        }
        const now=new persianDate().format("LLLL");
        let report=await MonthlyReport.findOne({month:req.body.month , year:req.body.year});
        if(report){
            const oldFilePath=report.monthlyReportFile;
            
            // await fs.unlinkSync(req.file.path);
            if(oldFilePath!==req.file.path)
            await fs.unlinkSync(oldFilePath);
            // report.set({name:req.body.name,createdAt:now,weeklyReportFile:req.file.path})
            report.monthlyReportFile=req.file.path;
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
        report=new MonthlyReport(_.pick(req.body,['name','month','year','createdAt','monthlyReportFile']));
        
        report.createdAt=now;
        if(req.file){
            // fs.rename(req.file.path, `${report.name}.pdf`, function (err) {
            //     if (err) throw err;
            //     console.log('File Renamed.');
            //   });
            report.monthlyReportFile=req.file.path;
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
    MonthlyReport.find().sort({year:-1}).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در ارتباط"
        })
    })
});
//FIND
router.post('/findreport',jsonparser,(req,res)=>{
    let repMonth=req.body.month;
    let repYear=req.body.year;
    let report=MonthlyReport.findOne({month:repMonth , year:repYear}).then((result)=>{
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
router.get('/findreport/:month/:year',(req,res)=>{
    let fetchmonth=req.params.month;
    let fetchyear=req.params.year;
    let reqmonth=months.find(object=> object.key===fetchmonth);


    let report=MonthlyReport.findOne({month:reqmonth.value , year:fetchyear}).then((result)=>{
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
   await MonthlyReport.findById(fetchRepId).then(async (result)=>{
        if(result){
            let filepath=result.monthlyReportFile;
           await MonthlyReport.deleteOne({_id:fetchRepId});
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