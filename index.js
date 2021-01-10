/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: KTV点歌系统入口
*  @Date: 2019/10/14 16:03
*
*/ 

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();


// 配置
require("./config/http")(app);   // 跨域
require("./mongodb/mongodb");  // 数据库
require("./config/passport")(passport);  // 验证token


// 中间件
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());


// 路由
const music = require("./api/music");
const user = require("./api/user");
const safecode = require("./api/safecode");
const admin = require("./api/admin");
app.use("/api/music", music);  // 音乐相关路由
app.use("/api/user", user);   // 用户相关路由
app.use("/api/safecode", safecode);  // 验证码
app.use("/api/admin", admin);  // 管理员操作


// 404
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "static/view/404.html"));
})


// 创建服务器
const port = process.env.PORT || 8633;
app.listen(port, err => {
    if(err) throw err;
    console.log(`Server is running on port [${port}].`);
})
