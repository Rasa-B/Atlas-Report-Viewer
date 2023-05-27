// require("dotenv").config();
// import express from "express"
// import cors from "cors";
// import mongoose from "mongoose";
// import authRoutes from "./routes/auth";
// const morgan=require("morgan");
// const app=express();

// mongoose
//     .connect(process.env.DATABASE)
//     .then(()=>console.log("DB Connected"))
//     .catch((err)=>console.log("DB Connection error:",err));

// //middlewares
// app.use(express.json());
// app.use(express.urlencoded({extended: true}));
// app.use(cors());
// app.use(morgan("dev"));

// //route middlewares
// app.use("/api",authRoutes);

// app.listen(8000,()=>console.log("server running on port 8000"));
require('./config/db');
const Joi=require('joi');
Joi.objectId=require('joi-objectid')(Joi);
const express=require('express');
const app=express();
const persianDate=require('persian-date');
const port=process.env.PORT || 3000;

const UserRouter=require('./api/user');
const WeeklyReportRouter=require('./api/weeklyReport');
const MonthlyReportRouter=require('./api/MonthlyReport');
const SemiyearlyReportRouter=require('./api/SemiyearlyReport');
const FinancialReportRouter=require('./api/FinancialReport');
//for accepting post from data
// const bodyParser= require('express').json;
const bodyparser = require("body-parser");
var jsonparser = bodyparser.json();
// function postTrimmer(req, res, next) {
//     if (req.method === 'POST') {
//         for (const [key, value] of Object.entries(req.body)) {
//             if (typeof(value) === 'string')
//                 req.body[key] = value.trim();
//         }
//     }
//     next();
// }


// app.use(bodyParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(bodyparser.json());
// app.use(bodyparser.json());

// app.use((req, res, next)=>{
//     if (req.method === 'POST') {
//         for (const [key, value] of Object.entries(req.body)) {
//             if (typeof(value) === 'String')
//                 req.body[key] = value.trim();
//         }
//     }
//     next();
// });
app.use(function(err, req, res, next) {
    // 'SyntaxError: Unexpected token n in JSON at position 0'
    err.message;
    next(err);
  });
app.get('/', (req,res) => {
    res.json({
        success: true
    })
});
app.use('/api/user',UserRouter);
app.use('/api/weeklyreport',WeeklyReportRouter);
app.use('/api/monthlyreport',MonthlyReportRouter);
app.use('/api/semiyearlyreports',SemiyearlyReportRouter);
app.use('/api/financialreports',FinancialReportRouter);
app.use('/uploads',express.static('uploads'));
app.listen(port,()=>{
    console.log(`server running on port ${port}`);
});
