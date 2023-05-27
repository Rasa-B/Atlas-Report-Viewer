const mongoose=require('mongoose');
const Joi=require('joi');
const Schema=mongoose.Schema;
const persianDate=require('persian-date');
const WeeklyReportSchema=new Schema({
    name:{
        type:String,
        required:[true,"Uploded file must have a name"]
    },
    week:{
        type:String,
        required:true,
        minLength:8,
        maxLength:11
    },
    month:{
        type:String,
        required:true,
        minLength:2,
        maxLength:14
    },
    year:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:String
    },
    weeklyReportFile:{
        type:String
    }

});
async function validateWeeklyReport(report){
    const schema=Joi.object().keys({
        name: Joi.string().required(),
        week: Joi.string().min(8).max(11).required(),
        month: Joi.string().min(2).max(14).required(),
        year:Joi.number().integer().min(1300).required(),
        createdAt: Joi.string(),
        weeklyReportFile: Joi.string()
});
    return await schema.validateAsync(report);
}
const WeeklyReport=mongoose.model('WeeklyReport',WeeklyReportSchema);
exports.WeeklyReport=WeeklyReport;
exports.validateWeeklyReport=validateWeeklyReport;