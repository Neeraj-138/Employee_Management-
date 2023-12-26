import express from 'express';
import conn from '../utils/db.js';
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router=express.Router();

router.post("/employee_login",(req,res)=>{
    // console.log(req.body.email);
    const qu="SELECT * FROM employee WHERE email=? ";
    conn.query(qu,[req.body.email] , (err,result)=>{
        console.log(result[0]);
        // console.log(req.body.password)
        if(err) return res.json({loginStatus:false,Error:"Query Error"})
        if(result.length >0)
        {
            bcrypt.compare( req.body.password,result[0].password,(err,response)=>{
                if(err) return res.json({loginStatus:false,Error:"wrong password"})
                if(response)
                {
                    const email=result[0].email;
                    const token=jwt.sign({role:"employee",email:email},
                                    "jwt_secret_key",
                                    {expiresIn:"1m"}
                                    );
                                    res.cookie('token',token);
                                    return res.json({loginStatus:true,id:result[0].id})

                }
            });
        }
        else
        {
            return res.json({loginStatus:false,Error:"Wrong email and password"})
        }
    })

})

router.get('/detail/:id',(req,res)=>{
    const id=req.params.id;
    const qu="SELECT * FROM employee WHERE id=?"
    conn.query(qu,[id],(err,result)=>{
        if(err) return res.json({Status:false})
        return res.json({result})
    })
})

router.get("/logout",(req,res)=>{
    res.clearCookie('token');
    return res.json({Status:true}) 
})











export {router as EmployeeRouter};