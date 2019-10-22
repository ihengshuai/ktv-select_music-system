/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 管理员管理歌曲
*  @Date: 2019/10/13 23:05
*
*/ 

const router = require("express").Router();
const bcrypt = require("bcrypt"); // 加密解密
const jwt = require("jsonwebtoken");
const jwt_key = require("../secret/jwtkey").KEYORSECRET;
const passport = require("passport");
const fs = require("fs");
const path = require("path");

const uploadMusic = require("../config/uploadMusic");
const uploadImg = require('../config/uploadImg');
const delNoUse = require("../config/delNoUse");
const newAccount = require("../config/newaccount");
require("../config/Date");



// 数据库模型
const Admin = require("../dbModel/admin");
const Music = require("../dbModel/music");
const AdminLike = require("../dbModel/adminlike");
const UserAndOrders = require("../dbModel/user");


// 上传歌曲到服务器文件夹下
router.post("/upload/music", async(req, res) => {
    console.log("歌曲上传成功");
    await uploadMusic(req, res);
})

// 上传歌曲海报到服务器文件下
router.post("/upload/poster",  async (req, res) => {
    console.log("歌曲海报上传成功")
    await uploadImg(req, res);
})

// 添加歌曲
router.post("/music/add", passport.authenticate("jwt", {session:false}), (req, res) => {
    let flag = false;
    Music.findOne({songName:req.body.songName})
            .then(hasOne => {
                // hasOne == true && hasOne.artist == req.body.artist ? flag = true : flag = false;
                if(hasOne){
                    hasOne.artist == req.body.artist ? flag = true : flag = false;
                    if(flag){
                        res.status(422).json({status:"422", result:"歌曲存在,请勿重复添加~"})
                    }else{
                        const song = {
                            songName:req.body.songName,
                            artist:req.body.artist,
                            poster:req.body.poster,
                            src:req.body.src,
                            language:req.body.language ? req.body.language : null,
                            style:req.body.style ? req.body.style : null,
                            playcount:"0",
                            date:new Date().format("yyyy/MM/dd HH:mm:ss")
                        };
                        const newSong = new Music(song);
                        newSong.save()
                                .then(() => {
                                    res.json({status:"200", result:"添加成功"})
                                    delNoUse.delAll();
                                }).catch(err => {
                                    console.log(err);
                                    res.status(500).json({status:"500", result:"未知错误,添加失败"})
                                })
                    }
                }else{
                    const song = {
                        songName:req.body.songName,
                        artist:req.body.artist,
                        poster:req.body.poster,
                        src:req.body.src,
                        language:req.body.language ? req.body.language : null,
                        style:req.body.style ? req.body.style : null,
                        playcount:"0",
                        date:new Date().format("yyyy/MM/dd HH:mm:ss")
                    };
                    const newSong = new Music(song);
                    newSong.save()
                        .then(() => {
                            res.json({status:"200", result:"添加成功"})
                            delNoUse.delAll();
                            
                        }).catch(err => {
                            console.log(err);
                            res.status(500).json({status:"500", result:"未知错误,添加失败"})
                        })
                }
            })
})

// 编辑歌曲
router.post("/music/edit", passport.authenticate("jwt", {session:false}), async(req, res) => {
    const _id = req.body._id;
    const nowSong = {};
    nowSong.songName = req.body.songName;
    nowSong.artist = req.body.artist;
    nowSong.src = req.body.src;
    nowSong.poster = req.body.poster;
    nowSong.language = req.body.language;
    nowSong.style = req.body.style;
    await Music.findOneAndUpdate(
                {_id:_id},
                {$set:nowSong},
                {new:true}
            ).then(newSong => {
                newSong.save()
                    .then(() => {
                        console.log("歌曲更新成功");
                        res.status(200).json({status:"200", result:"歌曲更新成功"});
                        delNoUse.delAll();
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({status:"500", result:"更新失败,未知错误"});
                    })
            })
})

// 删除歌曲
router.post("/music/delete", passport.authenticate("jwt",{session:false}), async(req, res) => {
    const _id = req.body._id;
    await Music.findOneAndRemove({_id})
                .then(musics => {
                    musics.save()
                            .then(() => {
                                console.log("歌曲删除成功");
                                res.json({status:"200", result:"删除成功"});
                                delNoUse.delAll();
                                AdminLike.findOneAndRemove({s_id:_id})
                                    .then(like => {
                                        if(like){
                                            like.save()
                                            .then(() => {
                                                console.log("同时移除喜欢歌曲");
                                            })
                                        }
                                    })
                            })
                })
})

// admin收藏歌曲
router.post("/adminlike/add", passport.authenticate("jwt", {session:false}), async(req, res) => {
    const s_id = req.body.s_id;
    await AdminLike.findOne({s_id})
            .then(song => {
                if(song){
                    return res.status(416).json({status:"416", result:"歌曲已存在,请勿重复收藏"});
                }else{
                    const newLike = new AdminLike({s_id});
                    newLike.save()
                            .then(() => {
                                console.log("收藏成功");
                                res.json({status:"200", result:"收藏成功"});
                            })
                }
            })
})

// 获取所有admin收藏歌曲
router.get("/adminlike/all", passport.authenticate("jwt", {session:false}), async(req, res) => {
    await Music.find()
        .then(allsongs => {
            AdminLike.find()
                .then(adminlikes => {
                    var result = [];
                    allsongs.forEach(item => {
                        adminlikes.forEach(al => {
                            if(item._id == al.s_id){
                                result.push(item)
                            }
                        })
                    })
                    res.send(result);
                })
        })
})

// 通过id删除admin收藏歌曲
router.post("/adminlike/del", passport.authenticate("jwt", {session:false}), async(req, res) => {
    await AdminLike.findOneAndRemove({s_id:req.body._id})
            .then(songs => {
                songs.save()
                        .then(() => {
                            console.log("歌曲移除成功");
                            res.json({status:"200", result:"删除成功"});
                        })
            })
})

// 搜索admin收藏歌曲
router.post("/adminlike/search", passport.authenticate("jwt", {session:false}), async(req, res) => {
    const songName = req.body.searchName.toLowerCase().trim();
    await Music.find()
        .then(allsongs => {
            AdminLike.find()
                .then(adminlikes => {
                    var result = [];
                    allsongs.forEach(item => {
                        var flag = false;
                        adminlikes.forEach(al => {
                            if(item._id == al.s_id){
                                item.songName.toLowerCase().indexOf(songName) == -1 ? flag = true : result.push(item)
                                if(flag){
                                    item.artist.indexOf(songName) == -1 ? "" : result.push(item)
                                }
                            }
                        })
                    })
                    res.send(result)
                })
        })
})

// 创建ktv账号和密码
router.post("/account/new", passport.authenticate("jwt", {session:false}), async(req, res) => { 
    const orderInfo = {
        account:newAccount(req.body.order_id).account,
        password:newAccount(req.body.order_id).password,
        order_id:req.body.order_id,
        money:req.body.totalMoney
    }
    const user = {
        order_id: req.body.order_id,
        startTime:req.body.startTime,
        endTime:req.body.endTime,
        money:req.body.totalMoney,
        account:orderInfo.account,
        password:orderInfo.password,
        publicpwd:orderInfo.password
    }

    const newUser = new UserAndOrders(user);
    await newUser.save(() => {
        res.send(orderInfo)
        console.log("开户成功");
    })
})

// 获取所有订单
router.get("/orders/all", passport.authenticate("jwt", {session:false}), async(req, res) => {
    UserAndOrders.find()
                .then(orders => {
                    res.send(orders);
                })
})

// 以订单编号删除订单
router.post("/orders/del", passport.authenticate("jwt", {session:false}), async(req, res) => {
    const order_id = req.body.order_id;
    await UserAndOrders.findOneAndRemove({order_id})
            .then(orders => {
                orders.save()
                        .then(() => {
                            console.log("订单删除成功");
                            res.json({status:"200", result:"删除成功"});
                        })
            })
})




// 管理员注册
router.post("/account/register", (req, res) => {
    const email = req.body.email;
    Admin.findOne({email})
        .then(hasOne => {
            if(hasOne){
                return res.status(422).json({status:"422", result:"邮箱被占用"});
            }else{
                const username = req.body.username;
                const password = req.body.password;
                const identity = req.body.identity ? req.body.identity : null;
                const date = new Date().format("yyyy/MM/dd HH:mm:ss");
                const newAdmin = new Admin({
                    email,
                    username,
                    password,
                    identity,
                    date
                });
                newAdmin.save()
                    .then(() => {
                        res.json({status:"200", result:"注册成功"})
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({status:"500", result:"未知错误,注册失败"})
                    })
            }
        })
})

// 管理员登录
router.post("/account/login", (req, res) => {
    const email = req.body.email;
    Admin.findOne({email})
        .then(admin => {
            if(!admin){
                return res.status(406).json({status:"406",result:"用户名或密码错误"})
            }else{
                const password = req.body.password;
                const isValidPassword = bcrypt.compareSync(password, admin.password);
                if(!isValidPassword){
                    return res.status(406).json({status:"406",result:"用户名或密码错误"})
                }else{
                    // 设置token
                    const rule = {
                        id:String(admin._id),
                        email:admin.email,
                        username:admin.username,
                        date:admin.date,
                        identity:admin.identity
                    };  
                    // 签证
                    jwt.sign(rule, jwt_key, {expiresIn:36000}, (err, token) => {
                        if(err){
                            console.log(err);
                            return res.status(500).json({status:"500",result:"未知错误"});
                        }else{
                            res.status(200).json({status:"200", result:"登录成功", token:"Bearer " + token})
                        }
                    })
                }
            }
        })
});

// 验证身份
router.post("/islegal" , passport.authenticate("jwt" , {session:false}), async(req, res) => {
    const email = req.body.email;
    await Admin.findOne({email})
        .then(islegal => {
            if(!islegal){
                return res.status(416).json({status:"416", result:"未知错误"});
            }else{
                const password = req.body.password;
                const isValidPassword = bcrypt.compareSync(password, islegal.password);
                if(!isValidPassword){
                    return res.status(416).json({status:"416",result:"用户名或密码错误"});
                }else{
                    res.send("true");
                }
            }
        })
})




module.exports = router
