const mysql=require("mysql2");
const db=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"kalyani@2712",
    database:"blog_db",

});
db.connect((err)=>{
    if(err){
        console.log("the is error",err);
    }
    else{
        console.log("mysql coonect");
    }

});
module.exports=db;//"Make this db connection available to other JavaScript files."