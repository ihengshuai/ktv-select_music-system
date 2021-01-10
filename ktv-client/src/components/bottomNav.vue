<template>
    <div class="topNav">
        <div class="container"></div>
        <div class="inner-box">
            <div class="left">
                <div class="home" @click="goHome">
                    <Icon type="ios-home" />
                    <div>首页</div>
                </div>
                <div class="selected" @click="selected">
                    <Icon type="ios-musical-notes" />
                    <div>已选</div>
                </div>
                <div class="addvolume" @click="addvolume">
                    <Icon type="ios-volume-up" />
                    <div>音量+</div>
                </div>
                <div class="reducevolume" @click="reducevolume">
                    <Icon type="ios-volume-mute" />
                    <div>音量-</div>
                </div>
            </div>
            <div class="middle">
                <img :src="currentPoster" alt="">
                <div class="control-btn">
                    <div class="prev-btn" @click="playPrev">
                        <Icon type="ios-rewind" />
                    </div>
                    <div class="play" @click="playOrpause">
                        <Icon type="ios-play" id="ios-play" />
                        <Icon type="ios-pause" id="ios-pause" />
                    </div>
                    <div class="next-btn" @click="playNext">
                        <Icon type="ios-fastforward" />
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="minormax" @click="minOrmax">
                    <Icon type="md-volume-off" />
                    <div>静音</div>
                </div>
                <div class="single-cycle" @click="singleCycle">
                    <Icon type="md-sync" />
                    <div>单曲</div>
                </div>
                <div class="order-cycle" @click="orderCycle">
                    <Icon type="md-swap" />
                    <div>顺序</div>
                </div>
                <div class="login">
                    <span v-if="!isLogin" @click="loginModal = true">
                        <Icon type="md-log-in" />
                        <div>登录</div>
                    </span>
                    <span v-if="isLogin" @click="logout">
                        <Icon type="md-log-out" />
                        <div>下机</div>
                    </span>
                </div>
            </div>
        </div>

        <Modal v-model="loginModal" width="450">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="logo-pinterest" />
                <span> 请登录</span>
            </p>
            <div v-if="loginModal">
                <div class="ranklistbox" style="width:100%;padding:0px 2px;">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="55px">
                        <el-form-item label="账号:" prop="account" >
                            <el-input type="account" v-model="ruleForm.account"></el-input>
                        </el-form-item>
                        <el-form-item label="密码:" prop="password">
                            <el-input type="password" @keypress.enter.native="submit('ruleForm')" v-model="ruleForm.password"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div slot="footer" v-if="loginModal">
                <Row>
                    <Button type="success" long @click="submit('ruleForm')">登录</Button>
                </Row>
            </div>
        </Modal>

        <audio autoplay id="musicPlayer" ref="musicPlayer" @ended="end" :src="'http://localhost:8633/api/music/nowmusic?id=' + currentSong._id" preload="auto"></audio>
    </div>
</template>
<script>
import nextSong from "@/config/nextSong"
import prevSong from "@/config/prevSong"
import hasLogin from '@/config/isLogin'
import jwt_decode from "jwt-decode"
import wsmLoading from "@/plugins/wsmLoading"
export default {
    name:"bottomNav",
    data(){
        return{
            loginModal:false,
            ruleForm:{
                account:"",
                password:""
            },
            rules:{
                account:[
                    {required:true, message:"账号不能为空", trigger:"change"}
                ],
                password:[
                    {required:true, message:"密码不能为空", trigger:"change"}
                ]
            },
        }
    },
    mounted(){
        setTimeout(() => {
            this.currentSong = JSON.parse(localStorage.currentSong)[0] ? JSON.parse(localStorage.currentSong)[0] : {_id:0};
            if(localStorage.play == "0"){
                this.$refs.musicPlayer.pause();
                $("#ios-play").fadeIn();
                $("#ios-pause").fadeOut();
                
            }else{
                $("#ios-play").fadeOut();
                $("#ios-pause").fadeIn();
                this.$refs.musicPlayer.play();
            }
        }, 200)
    },
    created(){
        // this.currentSong = JSON.parse(localStorage.currentSong)[0] ? JSON.parse(localStorage.currentSong)[0] : {_id:0};
    },
    methods:{
        end(){
            if(localStorage.playModle == 1){
                const song = nextSong();
                this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                const obj = [song];
                localStorage.setItem("currentSong", JSON.stringify(obj))
                this.currentSong = song;
            }else{
                this.$refs.musicPlayer.play();
            }
        },
        // 播放上一首
        playPrev(){
            if(hasLogin()){
                if(localStorage.play == "0"){
                    if(this.$refs.musicPlayer.src.split("?")[1] == "id=0"){
                        this.$confirm("请先添加歌曲", "提示", {
                            confirmButtonText:"确定",
                            cancelButtonText:"取消",
                            type:"warning"
                        }).then(() => {}).catch(() => {})
                        
                    }else{
                        const song = prevSong();
                        this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                        const obj = [song];
                        localStorage.setItem("currentSong", JSON.stringify(obj))
                        this.currentSong = song;
                        setTimeout(() => {
                            $("#ios-play").fadeIn();
                            $("#ios-pause").fadeOut();
                            this.$refs.musicPlayer.pause();
                        }, 10)
                    }
                }else{
                    if(this.$refs.musicPlayer.src.split("?")[1] == "id=0"){
                        this.$confirm("请先添加歌曲", "提示", {
                            confirmButtonText:"确定",
                            cancelButtonText:"取消",
                            type:"warning"
                        }).then(() => {}).catch(() => {})
                        
                    }else{
                        const song = prevSong();
                        this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                        const obj = [song];
                        localStorage.setItem("currentSong", JSON.stringify(obj))
                        this.currentSong = song;
                        setTimeout(() => {
                            $("#ios-play").fadeOut();
                            $("#ios-pause").fadeIn();
                            this.$refs.musicPlayer.play();
                        }, 10)
                    }
                }
            }else{
                this.loginModal = true;
            }
        },
        // 播放或暂停
        playOrpause(){
            if(hasLogin()){
                if(this.$refs.musicPlayer.src.split("?")[1] == "id=0"){
                    this.$confirm("请先添加歌曲", "提示", {
                        confirmButtonText:"确定",
                        cancelButtonText:"取消",
                        type:"warning"
                    }).then(() => {}).catch(() => {})
                }else if(this.$store.getters.songList.length == 1){
                    console.log(111)
                    const song = nextSong();
                    this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                    const obj = [song];
                    localStorage.setItem("currentSong", JSON.stringify(obj))
                    this.currentSong = song;
                    if(localStorage.play == "0"){
                        this.$refs.musicPlayer.play();
                        $("#ios-play").fadeOut();
                        $("#ios-pause").fadeIn();
                        localStorage.play = 1;
                    }else{
                        this.$refs.musicPlayer.pause();
                        $("#ios-play").fadeIn();
                        $("#ios-pause").fadeOut();
                        localStorage.play = 0;
                    }
                }else{
                    if(this.$refs.musicPlayer.paused){
                        this.$refs.musicPlayer.play();
                        $("#ios-play").fadeOut();
                        $("#ios-pause").fadeIn();
                        localStorage.play = 1;
                    }else{
                        this.$refs.musicPlayer.pause();
                        $("#ios-play").fadeIn();
                        $("#ios-pause").fadeOut();
                        localStorage.play = 0;
                    }
                }
            }else{
                this.loginModal = true;
            }
        },
        // 播放下一首
        playNext(){
            if(hasLogin()){
                if(localStorage.play == '0'){
                    console.log(11)
                    if(this.$refs.musicPlayer.src.split("?")[1] == "id=0"){
                        this.$confirm("请先添加歌曲", "提示", {
                            confirmButtonText:"确定",
                            cancelButtonText:"取消",
                            type:"warning"
                        }).then(() => {}).catch(() => {})
                        
                    }else{
                        const song = nextSong();
                        this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                        const obj = [song];
                        localStorage.setItem("currentSong", JSON.stringify(obj))
                        this.currentSong = song;
                        
                        setTimeout(() => {
                            $("#ios-play").fadeIn();
                            $("#ios-pause").fadeOut();
                            this.$refs.musicPlayer.pause();
                        }, 10)
                    }
                }else{
                    if(this.$refs.musicPlayer.src.split("?")[1] == "id=0"){
                        this.$confirm("请先添加歌曲", "提示", {
                            confirmButtonText:"确定",
                            cancelButtonText:"取消",
                            type:"warning"
                        }).then(() => {}).catch(() => {})
                        
                    }else{
                        const song = nextSong();
                        this.$refs.musicPlayer.src = "http://localhost:8633/api/music/nowmusic?id=" + song._id
                        const obj = [song];
                        localStorage.setItem("currentSong", JSON.stringify(obj))
                        this.currentSong = song;
                        
                        setTimeout(() => {
                            $("#ios-play").fadeOut();
                            $("#ios-pause").fadeIn();
                            this.$refs.musicPlayer.play();
                        }, 10)
                    }
                }
            }else{
                this.loginModal = true;
            }
        },
        // 顺序播放
        orderCycle(){
            if(hasLogin()){
                $(".order-cycle").css("color","rgb(196, 196, 26)");
                $(".single-cycle").css("color","rgb(219, 217, 217)");
                this.$store.setPlayModle = 1;
                nextSong();
                localStorage.setItem("playModle", 1);
            }else{
                this.loginModal = true;
            }
        },
        // 单曲循环
        singleCycle(){
            if(hasLogin()){
                $(".single-cycle").css("color","rgb(196, 196, 26)");
                $(".order-cycle").css("color","rgb(219, 217, 217)");
                this.$store.setPlayModle = -1;
                nextSong();
                localStorage.setItem("playModle", -1);
            }else{
                this.loginModal = true;
            }
        },
        // 静音或最大
        minOrmax(){
            if(hasLogin()){
                if(this.$refs.musicPlayer.volume == 0){
                    this.$refs.musicPlayer.volume = 1;
                    $(".minormax").css("color","rgb(219, 217, 217)")
                }else{
                    this.$refs.musicPlayer.volume = 0
                    $(".minormax").css("color","rgb(196, 196, 26)")
                }
            }else{
                this.loginModal = true;
            }
        },
        // 减小音量
        reducevolume(){
            if(hasLogin()){
                $(".minormax").css("color","rgb(219, 217, 217)")
                if(this.$refs.musicPlayer.volume > 0.05){
                    this.$refs.musicPlayer.volume -= 0.05;
                }else{
                    this.$refs.musicPlayer.volume = 0;
                }
            }else{
                this.loginModal = true;
            }
        },
        // 增加音量
        addvolume(){
            if(hasLogin()){
                $(".minormax").css("color","rgb(219, 217, 217)")
                if(this.$refs.musicPlayer.volume < 0.95){
                    this.$refs.musicPlayer.volume += 0.05;
                }else{
                    this.$refs.musicPlayer.volume = 1;
                }
            }else{
                this.loginModal = true;
            }
        },
        // 回首页
        goHome(){
            this.$route.path == "/home/index" ? console.log("不能前进了") : this.$router.push("/")
        },
        // 去已选界面
        selected(){
            if(hasLogin()){
                this.$router.push("/home/selected");
            }else{
                this.loginModal = true;
            }
        },
        // 登录
        submit(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    wsmLoading.start();
                    this.loginModal = false;
                    setTimeout(() => {
                        this.$axios.post("http://localhost:8633/api/user/login", this.ruleForm)
                            .then(res => {
                                this.$nextTick(() => {
                                    console.log(res);
                                    this.$Message.success(res.data.result);
                                    localStorage.setItem("userToken", res.data.token);
                                    const decoded = jwt_decode(res.data.token);
                                    this.$store.dispatch("setAuthorizated", true);
                                    this.$store.dispatch("setUser", decoded);
                                    wsmLoading.end();
                                    this.ruleForm.account = "";
                                    this.ruleForm.password = "";
                                })
                            }).catch(err => {
                                this.loginModal = true;
                                console.error(err.response)
                            })
                    }, 300)
                }else{
                    console.log(111)
                }
            })
        },
        // 下机
        logout(){
            this.$confirm("你确定要提前下机吗", "提示", {
                confirmButtonText:"确定",
                cancleButtonText:"取消",
                type:"warning"
            }).then(() => {
                wsmLoading.start("正在处理...");
                setTimeout(() => {
                    this.$nextTick(() => {
                        this.$store.dispatch("clearState");
                        this.$store.dispatch("setCurrentSong", {id:0});
                        this.$store.dispatch("songList", []);
                        this.$store.dispatch("playModle", 1);
                        this.$route.path == "/home/index" ? null : this.$router.push("/home/index")
                        this.$router.go(0);
                        wsmLoading.end();
                    })
                }, 1000)
            }).catch(() => {})
        }
    },
    computed:{
        isLogin(){
            return this.$store.getters.isAuthorizated;
        },
        currentPoster(){
            if(this.$store.getters.currentSong.poster){
                return "http://localhost:8633/api/music/poster?img=" + this.$store.getters.currentSong.poster;
            }else{
                return  require("../assets/image/default-song-bg.jpg");
            }
        },
        currentSong:{
            get(){
                if(this.$store.getters.songList.length == 1){
                    console.log("一首歌")
                    
                    if(localStorage.play == "0"){
                        $("#ios-play").fadeIn();
                        $("#ios-pause").fadeOut();
                    }else{
                        $("#ios-play").fadeOut();
                        $("#ios-pause").fadeIn();
                    }
                }else{
                    if(localStorage.play == "0"){
                        setTimeout(() => {
                            document.getElementById("musicPlayer").pause();
                        }, 10)
                        $("#ios-play").fadeIn();
                        $("#ios-pause").fadeOut();
                    }else{
                        setTimeout(() => {
                            document.getElementById("musicPlayer").play();
                        }, 10)
                        $("#ios-play").fadeOut();
                        $("#ios-pause").fadeIn();
                    }
                }
                this.nextSong = nextSong();
                return this.$store.getters.currentSong;
            },
            set(val){
                this.$store.dispatch("setCurrentSong", val);
            }
        }
    }
}
</script>
<style lang="less" scoped>
.topNav{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    perspective:1200px;

    .container{
        width: 80%;
        height: 100%;
        border-top-right-radius: 20px;
        border-top-left-radius: 20px;
        padding: 0px 40px;
        background-image: linear-gradient(141deg,rgb(173, 38, 38) 0%,rgb(204, 30, 30) 75%);
        transform: rotateX(30deg);
        perspective:1200px;
        z-index: 2;
    }
    .inner-box{
        height: 90%;
        width: 75%;
        position: absolute;
        z-index: 4;
        background-color: transparent;
        display: flex;

        .left{
            flex: 1;
            height: 100%;
            width: 100%;
            display: flex;

            .home,.selected,.addvolume,.reducevolume{
                height: 100%;
                flex: 1;
                font-size: 50px;
                text-align: center;
                color: rgb(196, 196, 26);
                div{
                    font-size: 20px;
                }
                cursor: pointer;
            }

            .selected,.selected,.addvolume,.reducevolume{
                color: rgb(219, 217, 217);
                &:hover{
                    color: rgb(196, 196, 26);
                }
            }
        }
        .middle{
            flex: 1;
            height: 100%;
            width: 100%;
            display: flex;
            padding: 3px 50px;
            align-items: center;
            justify-content: center;
            position: relative;
            img{
                width: 100%;
                height: 100%;
                border-radius: 5px;
                filter: blur(1px);
                z-index: 2;
            }
            &:hover{
                .control-btn{
                    display: flex;
                }
            }

            .control-btn{
                position: absolute;
                width: 78%;
                height: 100%;
                z-index: 20;
                background-color: rgba(0, 0, 0, .3);
                display: none;

                .prev-btn, .play, .next-btn{
                    flex: 1;
                    text-align: center;
                    line-height: 110px;
                    font-size: 60px;
                    color: rgb(220, 225, 228);
                    cursor: pointer;

                    &:hover{
                        transform: scale(1.02);
                        color: rgb(120, 129, 138);
                    }
                }
                .prev-btn{
                    text-align: left;
                    padding-left: 10px;
                }
                .next-btn{
                    text-align: right;
                    padding-right: 10px;
                }
            }
        }
        .right{
            flex: 1;
            height: 100%;
            width: 100%;
            display: flex;

            .minormax,.single-cycle, .order-cycle, .login{
                height: 100%;
                flex: 1;
                font-size: 50px;
                text-align: center;
                color: rgb(35, 14, 153);
                div{
                    font-size: 20px;
                }
                cursor: pointer;
            }
            .single-cycle, .order-cycle, .minormax{
                color: rgb(221, 222, 223);
                &:hover{
                    color: rgb(196, 196, 26);
                }
            }
        }

    }
}
</style>
