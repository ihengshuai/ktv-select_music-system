/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 用户登录, 听歌操作
*  @Date: 2019/10/13 22:59
*
*/ 

const express = require("express");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");

const UserOrOrders = require("../dbModel/user");
const jwt_key = require("../secret/jwtkey").KEYORSECRET;
const isBadAccount = require("../config/isBadAccount");

const Music = require("../dbModel/music");
const AdminLike = require("../dbModel/adminlike");


// 测试创建文件夹
router.post("/add", (req, res) => {
    const user = req.body.username;
    fs.mkdir(path.resolve(__dirname, "../static/avatar/" + user), (error) => {
        if(error){  // 如果存在
            console.log("已存在");
            res.send("已存在");
            return;
        }else{
            res.send("创建成功");
        }
    })
})
// 用户登录
router.post("/login", async(req, res) => {
    const account = req.body.account;
    const flag = await isBadAccount(req.body)
    UserOrOrders.findOne({account})
            .then(user => {
                if(!user){
                    return res.status(406).json({status:"406", result:"账号或密码错误"})
                }else{
                    if(flag){
                        const password = req.body.password;
                        const isValidPassword = bcrypt.compareSync(password, user.password);
                        if(!isValidPassword){
                            return res.status(406).json({status:"406",result:"账号或密码错误"})
                        }else{
                            // 设置token
                            const rule = {
                                id:String(user._id),
                                account:user.account,
                                startTime:user.startTime,
                                endTime:user.endTime,
                                order_id:user.order_id,
                                money:user.money
                            };  
                            // 签证
                            jwt.sign(rule, jwt_key, (err, token) => {
                                if(err){
                                    console.log(err);
                                    return res.status(500).json({status:"500",result:"未知错误"});
                                }else{
                                    res.status(200).json({status:"200", result:"登录成功", token:"Bearer " + token})
                                }
                            })
                        }
                    }else{
                        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
                    }
                }
            })
})



// 测试  isBadAccount(params)方法
router.post("/test", passport.authenticate("jwt", {session:false}), async (req, res) => {
    // console.log(req.user)
    if(await isBadAccount(req.user)){
        // do something
        res.send("OK");
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})






module.exports = router;
