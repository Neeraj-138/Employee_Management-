import express from "express";
import cors from "cors";
import { adminRouter } from "./Routes/AdminRoute.js";
import { EmployeeRouter } from "./Routes/EmployeeRoute.js";
// import bodyParser from 'body-parser';
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";


const app=express();


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Allow any origin
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",['GET','POST','PUT','DELETE']);
    res.header("Access-Control-Allow-Credentials", "true");
      next();
  });

app.use(cookieParser());
app.use(express.json());
app.use('/auth',adminRouter);
app.use('/employee',EmployeeRouter)
app.use(express.static('Public'))

const verifyUser=(req,res,next)=>{
    const token=req.cookies.token;
    if(token){
        jwt.verify(token,"jwt_secret_key",(err,decoded)=>{
            if(err)
            {
                return res.json({Status:false,Error:"Wrong Token"})
                req.id=decoded.id;
                req.roll=decoded.roll;
                next();
            }
        })
    }
    else{
        return res.json({Status:false,Error:"Not Authenticated"})
    }

}


app.get('/verify',verifyUser,(req,res)=>{
    return res.json({Status:true,roll:req.roll,id:req.id})
})

app.listen(8000,()=>{
    console.log("server is running at port 8000")
})