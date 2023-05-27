const mongoose=require('mongoose');
const Joi=require('joi');
const Schema=mongoose.Schema;
const persianDate=require('persian-date');
const FinancialReportSchema=new Schema({
    name:{
        type:String,
        required:[true,"Uploded file must have a name"]
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
    financialReportFile:{
        type:String
    }

});
async function validateFinancialReport(report){
    const schema=Joi.object().keys({
        name: Joi.string().required(),
        month: Joi.string().min(2).max(14).required(),
        year:Joi.number().integer().min(1300).required(),
        createdAt: Joi.string(),
        financialReportFile: Joi.string()
});
    return await schema.validateAsync(report);
}
const FinancialReport=mongoose.model('FinancialReport',FinancialReportSchema);
exports.FinancialReport=FinancialReport;
exports.validateFinancialReport=validateFinancialReport;