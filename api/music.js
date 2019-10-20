/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 展示歌曲,播放列表,搜索歌曲
*  @Date: 2019/10/13 23:01
*
*/

const express = require("express");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const Music = require("../dbModel/music");
const AdminLike = require("../dbModel/adminlike");
const isBadAccount = require("../config/isBadAccount");


// 获取所有歌曲
router.get("/all", passport.authenticate("jwt", {session:false}), async(req, res) => {
    await Music.find()
            .then(musics => {
                musics.length ? res.send(musics) : res.json({status:200, result:"音乐为空"})
            })
})

// 通过歌曲id获取歌曲
router.get("/nowmusic", async (req, res) => {
    const _id = req.query.id;
    await Music.findOne({_id})
            .then(music => {
                if(music){
                    res.sendFile(path.resolve(__dirname, "../static/music/" + music.src))
                    const sum = parseInt(music.playcount) + 1;
                    const count = {
                        playcount:sum
                    };
                    Music.findOneAndUpdate(
                        {_id:_id},
                        {$set:count},
                        {new:true}
                    ).then(newCount => {
                        newCount.save()
                                .then(() => {
                                    // console.log("播放成功");
                                })
                    })
                }else{
                    res.sendFile(path.resolve(__dirname, "../static/view/404.html"));
                }
            }).catch(() => {
                res.sendFile(path.resolve(__dirname, "../static/view/404.html"));
            })
})

// 获取歌曲海报
router.get("/poster", (req, res) => {
    const exists = fs.existsSync(path.resolve(__dirname, "../static/poster/" + req.query.song));
    // console.log(exists)
    res.sendFile(path.resolve(__dirname, "../static/poster/" + req.query.img))
})

// 通过songName搜索歌曲
router.post("/search/byname", passport.authenticate("jwt", {session:false}), async(req, res) => {
    const songName = req.body.searchName.trim();
    await Music.find({songName: { $regex: songName, $options: 'i'}})
            .then(songs => {
                if(songs.length){
                    res.send(songs)
                }else{
                    Music.find({artist: { $regex : songName, $options: 'i'}})
                        .then(artists => {
                            res.send(artists)
                        })
                }
            })

})


// user操作

// 获取热歌
router.post("/hot", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        Music.find()
            .then(musics => {
                const musicList = musics;
                for(var i = 0; i < musicList.length - 1; i++){
                    for(var j = 0; j < musicList.length - 1 - i; j++){
                        if(parseInt(musicList[j].playcount) < parseInt(musicList[j+1].playcount)){
                            var temp = musicList[j];
                            musicList[j] = musicList[j+1];
                            musicList[j+1] = temp;
                        }
                    }
                }
                res.send(musicList);
            })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 获取所有admin收藏歌曲
router.post("/user/adminlike", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        Music.find()
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
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 语种点歌
router.post("/language", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        const language = req.body.language;
        Music.find({language})
            .then(musics => {
                res.send(musics);
            })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 风格点歌
router.post("/style", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        const style = req.body.style;
        Music.find({style})
            .then(musics => {
                res.send(musics);
            })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 明星点歌
router.post("/artist", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        const artist = req.body.artist;
        Music.find({artist})
                .then(musics => {
                    res.send(musics);
                })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 搜索歌曲
router.post("/search", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        const songName = req.body.searchName.trim();
        Music.find({songName: { $regex: songName, $options: 'i'}})
                .then(songs => {
                    if(songs.length){
                        res.send(songs)
                    }else{
                        Music.find({artist: { $regex : songName, $options: 'i'}})
                            .then(artists => {
                                res.send(artists)
                            })
                    }
                })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})

// 用户获取所有歌曲
router.post("/all", passport.authenticate("jwt", {session:false}), async(req, res) => {
    if(await isBadAccount(req.user)){
        Music.find()
            .then(musics => {
                res.send(musics);
            })
    }else{
        res.status(401).json({status:"401", result:"帐号过期,请联系管理员"})
    }
})





module.exports = router;

