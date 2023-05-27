import  express  from "express";
const router=express.Router();
const {Signup,Login}=require("../controllers/auth");
router.get("/",(req,res)=>{
    return res.json({
        data:"hello world from the API",
    });
});

router.post("/Signup",Signup);
router.post("/Login",Login);
export default router;