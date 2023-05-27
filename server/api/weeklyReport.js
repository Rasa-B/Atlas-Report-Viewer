const express=require('express');
const bodyparser = require('body-parser');
const jsonparser = bodyparser.json()
const router=express.Router();
// const storageWeek=require('../Middlewares/Upload');
const {WeeklyReport,validateWeeklyReport}=require('../models/WeeklyReports');
const persianDate=require('persian-date');
const multer = require("multer");
const path=require('path');
// const { response } = require('express');
const _=require('loadsh');
const fs = require('fs');
const auth=require("../Middlewares/auth");
var storageWeek=multer.diskStorage({
    destination: function(req,file,cb){
            cb(null,'uploads/weeklyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        let  now=new persianDate().toLocale('en').format("LLLL")
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})
var upload=multer({
    storage:storageWeek,
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
const weeks=[
    {key:'first',value:'هفته اول'},
    {key:'second',value:'هفته دوم'},
    {key:'third',value:'هفته سوم'},
    {key:'fourth',value:'هفته چهارم'}
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
    {key:'12' , value:'اسفند'}
];
// const { report } = require('./user');
// const upload=multer({dest:"uploads/weeklyreports"});
//new persianDate().toLocale('en').format()

//POST & PUT
router.post('/upload',upload.single("weeklyReportFile"),async (req,res)=>{
    try {
        const {error}=validateWeeklyReport(req.body);
        if(error){
            await fs.unlinkSync(req.file.path);
            res.status(422).json({
                status:"FAILED!",
                message:"اطلاعات را درست وارد کنید"
            })
        }
        const now=new persianDate().format("LLLL")
        let report=await WeeklyReport.findOne({ week:req.body.week , month:req.body.month , year:req.body.year});
        if(report){
            const oldFilePath=report.weeklyReportFile;
            
            // await fs.unlinkSync(req.file.path);
            if(oldFilePath!==req.file.path)
            await fs.unlinkSync(oldFilePath);
            // report.set({name:req.body.name,createdAt:now,weeklyReportFile:req.file.path})
            report.weeklyReportFile=req.file.path;
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
        report=new WeeklyReport(_.pick(req.body,['name','week','month','year','createdAt','weeklyReportFile']));
        
        report.createdAt=now;
        if(req.file){
            // fs.rename(req.file.path, `${report.name}.pdf`, function (err) {
            //     if (err) throw err;
            //     console.log('File Renamed.');
            //   });
            report.weeklyReportFile=req.file.path;
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
    WeeklyReport.find().sort({year:-1}).then((result)=>{
        res.send(result);
    }).catch((err)=>{
        res.json({
            status:"FAILED!",
            message:"خطا در ارتباط"
        })
    })
});

router.get('/findreport',auth,jsonparser,(req,res)=>{
    let repWeek,repMonth,repYear;
     repWeek=req.body.week;
     repMonth=req.body.month;
     repYear=req.body.year;
    let report=WeeklyReport.findOne({week:repWeek , month:repMonth , year:repYear}).then((result)=>{
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
router.get('/findreport/:week/:month/:year',(req,res)=>{
    let fetchweek=req.params.week;
    let fetchmonth=req.params.month;
    let fetchyear=req.params.year;
    let reqweek=weeks.find(object=> object.key===fetchweek);
    let reqmonth=months.find(object=> object.key===fetchmonth);
    // reqweek=reqweek.value;
    // reqmonth=reqmonth.value;

    let report=WeeklyReport.findOne({week:reqweek.value , month:reqmonth.value , year:fetchyear}).then((result)=>{
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
    await WeeklyReport.findById(fetchRepId).then(async (result)=>{
        if(result){
            let filepath=result.weeklyReportFile;
            await WeeklyReport.deleteOne({_id:fetchRepId});
           
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