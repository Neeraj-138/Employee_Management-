import mysql from 'mysql';


const conn=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        password:"root123",
        database:"employeems",
    }
)
conn.connect((err)=>{
    if(err){
        console.log(" connection error")
 
    }else{
        console.log("connnected");
    }
})

export default conn;