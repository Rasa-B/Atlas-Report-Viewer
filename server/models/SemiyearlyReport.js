const mongoose=require('mongoose');
const Joi=require('joi');
const Schema=mongoose.Schema;
const persianDate=require('persian-date');
const SemiyearlyReportSchema=new Schema({
    name:{
        type:String,
        required:[true,"Uploded file must have a name"]
    },
    semester:{
        type:String,
        required:true,
        minLength:10,
        maxLength:10
    },
    year:{
        type:Number,
        required:true,
    },
    createdAt:{
        type:String
    },
    semiyearlyReportFile:{
        type:String
    }

});
async function validateSemiyearlyReport(report){
    const schema=Joi.object().keys({
        name: Joi.string().required(),
        semester: Joi.string().min(10).max(10).required(),
        year:Joi.number().integer().min(1300).required(),
        createdAt: Joi.string(),
        semiyearlyReportFile: Joi.string()
});
    return await schema.validateAsync(report);
}
const SemiyearlyReport=mongoose.model('SemiyearlyReport',SemiyearlyReportSchema);
exports.SemiyearlyReport=SemiyearlyReport;
exports.validateSemiyearlyReport=validateSemiyearlyReport;