import  express  from 'express';
import conn from '../utils/db.js';
import  jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
const router=express.Router();

router.post("/adminlogin",(req,res)=>{
    console.log(req.body.email);
    const qu="SELECT * FROM admin WHERE email=? and password=?";

    conn.query(qu,[req.body.email,req.body.password] , (err,result)=>{
        if(err) return res.json({loginStatus:false,Error:"Query Error"})
        if(result.length >0)
        {
            const email=result[0].email;
            const token=jwt.sign({role:"admin",email:email,id:result[0].id},"jwt_secret_key",{expiresIn:"1m"});
            res.cookie('token',token);
            return res.json({loginStatus:true})
        }
        else{
            return res.json({loginStatus:false,Error:"Wrong email or password"})
        }
    })

})

router.get('/category',(req,res)=>{
    const qu="SELECT * FROM category ";
    conn.query(qu,(err,data)=>{
        if(err)
            return res.json({Status:false,Error:"Query Error"});
        return res.json({Status:true,Result:data});
    })
})

router.post('/add_category',(req,res)=>{
    const qu="INSERT INTO category (`name`) VALUES(?)"
    conn.query(qu,[req.body.category],(err,data)=>{
        if(err)
            return res.json({Status:false,Error:"Query Error"});
        return res.json({Status:true});
    })

})

//image upload
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'Public/Images');

    },
    filename:(req,file,cb)=>{
        cb(null,file.fieldname+"_"+ Date.now()+path.extname(file.originalname))
    }
})
const upload=multer({
    storage:storage
})
//end image upload





router.post('/add_employee',upload.single('image'),(req,res)=>{
    const qu=`INSERT INTO employee (name,email,password,address,salary,image,category_id) VALUES(?)`;
        bcrypt.hash(req.body.password,10,(err,hash)=>{
        // console.log(req.body.category_id);
        const values=[
            req.body.name,req.body.email,hash,req.body.address,req.body.salary,req.file.filename,req.body.category_id
        ];
        conn.query(qu,[values],(err,data)=>{
            console.log(values)
            if(err)
                return res.json({Status:false,Error:"Query Error"});
            return res.json({Status:true,Result:data});

        })

    })
})
router.get('/employee',(req,res)=>{
    const qu="SELECT * FROM employee ";
    conn.query(qu,(err,data)=>{
        if(err)
            return res.json({Status:false,Error:"Query Error"});
        return res.json({Status:true,Result:data});
    })
})

router.get('/employee/:id',(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    const qu="SELECT * FROM employee where id=?";
    conn.query(qu,[id],(err,data)=>{
        if(err)
            return res.json({Status:false,Error:"Query Error"});
        return res.json({Status:true,Result:data});
    })

})
router.put('/edit_employee/:id',(req,res)=>{
    const id=req.params.id;
    console.log(id);
    const qu="UPDATE employee SET name=?,email=?,salary=?,address=? WHERE id=?"
    const values=[
        req.body.name,
        req.body.email,
        req.body.salary,
        req.body.address,
        // req.body.category_id,
    ]
    conn.query(qu,[...values,id],(err,result)=>{
    if(err)
        return res.json({Status:false,Error:"Query Error"});
    return res.json({Status:true,Result:result});
    })

})
router.delete('/delete_employee/:id',(req,res)=>{
    const id=req.params.id;
    // console.log(id);
    const qu="delete from employee where id=?";
    conn.query(qu,[id],(err,result)=>{
        if(err) return res.json({Status:false,Error:"Query Error"})
        return res.json({Status:true,Result:result})
    })
})
router.get('/admin_count',(req,res)=>{
    const qu="Select count(id) as admin from admin";
    conn.query(qu,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Query Error"})
    return res.json({Status:true,Result:result})
    })
})
router.get('/employee_count',(req,res)=>{
    const qu="Select count(id) as employee from employee";
    conn.query(qu,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Query Error"})
    return res.json({Status:true,Result:result})
    })
})
router.get('/salary_count',(req,res)=>{
    const qu="Select sum(salary) as salary from employee";
    conn.query(qu,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Query Error"})
    return res.json({Status:true,Result:result})
    })
})

router.get('/admin_record',(req,res)=>{
    const qu="select * from admin";
    conn.query(qu,(err,result)=>{
    if(err) return res.json({Status:false,Error:"Query Error"})
    return res.json({Status:true,Result:result})
    })
})

router.get('/logout',(req,res)=>{
    res.clearCookie('token');
    return res.json({Status:true})
})



export {router as adminRouter};