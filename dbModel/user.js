/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 配置上机用户模型
*  @Date: 2019/10/17 10:45
*
*/ 
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userModel = mongoose.Schema({
    order_id:{
        require:true,
        type:String
    },
    startTime:{
        require:true,
        type:String
    },
    endTime:{
        require:true,
        type:String
    },
    money:{
        require:true,
        type:String
    },
    account:{
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
    publicpwd:{  // 明文, 防止忘记密码
        require:true,
        type:String
    }
})

module.exports = mongoose.model("user_and_orders", userModel);