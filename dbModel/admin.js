/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 管理员模型
*  @Date: 2019/10/16 11:05
*
*/ 

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const adminModel = mongoose.Schema({
    email:{
        require:true,
        type:String
    },
    username:{
        require:true,
        type:String
    },
    password:{
        require:true,
        type:String,
        set(val){
            return bcrypt.hashSync(val, 10)
        }
    },
    identity:{
        // require:true,
        type:String
    },
    date:{
        require:true,
        type:String
    }
})

module.exports = mongoose.model("Admin", adminModel)