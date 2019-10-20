/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 封装删除没有用到的资源函数
*  @Date: 2019/10/17 16:56
*
*/ 

const fs = require('fs');
const path = require('path');
const Music = require("../dbModel/music");

module.exports = {
    delAll:()=>{
        let musicFiles = fs.readdirSync(path.resolve(__dirname, "../static/music"));
        let posterFiles = fs.readdirSync(path.resolve(__dirname, "../static/poster"));
        Music.find()
            .then(allmusic => {
                // 删除图片
                posterFiles.forEach(item => {
                    var isexist = false;
                    allmusic.forEach(p => {
                        if(p.poster == item){
                            isexist = true;
                        }
                    })
                    if(!isexist){
                        fs.unlinkSync(path.resolve(__dirname, "../static/poster/" + item))
                        console.log("删除闲置图片资源:" + item);
                    }
                })

                // 删除歌曲
                musicFiles.forEach(item => {
                    var isexist = false;
                    allmusic.forEach(m => {
                        if(m.src == item){
                            isexist = true;
                        }
                    })
                    if(!isexist){
                        fs.unlinkSync(path.resolve(__dirname, "../static/music/" + item))
                        console.log("删除闲置歌曲资源:" + item);
                    }
                })
            })
    }
}