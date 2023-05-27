const path=require('path');
const multer=require('multer');

//weekly report storage
var storageWeek=multer.diskStorage({
    destination: function(req,file,cb){
        // if(reptype==='monthly'){
        // cb(null,'uploads/monthlyreports')
        // }else if(reptype==='semiyearly'){
        //     cb(null,'uploads/semiyearlyreports')
        // }
        // else
            cb(null,'uploads/weeklyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})

var uploadWeek=multer({
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
//monthly report storage
var storageMonth=multer.diskStorage({
    destination: function(req,file,cb){
        // if(reptype==='monthly'){
        // cb(null,'uploads/monthlyreports')
        // }else if(reptype==='semiyearly'){
        //     cb(null,'uploads/semiyearlyreports')
        // }
        // else
            cb(null,'uploads/monthlyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})

var uploadMonth=multer({
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
//semiyearly reports storage
var storageBiannual=multer.diskStorage({
    destination: function(req,file,cb){
        // if(reptype==='monthly'){
        // cb(null,'uploads/monthlyreports')
        // }else if(reptype==='semiyearly'){
        //     cb(null,'uploads/semiyearlyreports')
        // }
        // else
            cb(null,'uploads/semiyearlyreports')
    },
    filename:function(req,file,cb){
        let ext=path.extname(file.originalname)
        let name=path.basename(file.originalname)
        name.replace(".pdf","");
        cb(null,file.originalname.replace(/\s/g,"_"))
    }
})

var uploadBiannual=multer({
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
})
exports.uploadWeek=uploadWeek
exports.uploadMonth=uploadMonth
exports.uploadBiannual=uploadBiannual
exports.storageWeek=storageWeek
exports.storageMonth=storageMonth