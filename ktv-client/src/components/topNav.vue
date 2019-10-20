<template>
    <div class="topNav">
        <Col :span="3">
            <div class="logo"></div>
        </Col>
        <Col :span="7">
            <div class="playing-name" v-if="currentSong._id != 0 && isLogin">正在播放:{{currentSong.songName}}</div>
        </Col>
        <Col :span="7">
            <div class="next-name" v-if="currentSong._id != 0 && isLogin">下一首:{{nextSong.songName}}</div>
        </Col>
        <Col :span="7" style="position:absolute;right:30px;">
            <div class="selected-sum" v-if="allSongList.length && isLogin">已选:{{allSongList.length}}首</div>
        </Col>
    </div>
</template>
<script>
import nextSong from "@/config/nextSong"
export default {
    name:"topNav",
    data(){
        return{
            nextSong:"",
        }
    },
    created(){
        
    },
    methods:{
        
    },
    computed:{
        allSongList(){
            return this.$store.getters.songList;
        },
        currentSong:{
            get(){
                this.nextSong = nextSong();
                return this.$store.getters.currentSong;
            },
            set(val){
                this.$store.dispatch("setCurrentSong", val);
            }
        },
        playModle(){
            this.nextSong = nextSong();
            return this.$store.getters.playModle;
        },
        isLogin(){
            return this.$store.getters.isAuthorizated;
        }
    },
    watch:{
        currentSong(){
            this.nextSong = nextSong();
        },
        playModle(){
            this.nextSong = nextSong();
            return this.$store.getters.playModle;
        }
    },
    mounted(){
        setTimeout(() => {this.currentSong = JSON.parse(localStorage.currentSong)[0] ? JSON.parse(localStorage.currentSong)[0] : {_id:0};}, 200)
        var that = this;
        var orignalSetItem = localStorage.setItem;
        localStorage.setItem = function(key,newValue){
            var setItemEvent = new Event("setItemEvent");
            setItemEvent.newValue = newValue;
            window.dispatchEvent(setItemEvent);
            orignalSetItem.apply(this,arguments);
        }
        window.addEventListener("setItemEvent", function (e) {
            setTimeout(() => {
                that.nextSong = nextSong();
            }, 10)
        });
    }
}
</script>
<style lang="less" scoped>
.topNav{
    width: 100%;
    height: 100%;
    background-image: linear-gradient(141deg,rgb(199, 56, 104) 20%,rgb(189, 67, 138) 50%, rgb(145, 42, 102) 75%);
    .search-input{
        height: 80px;
        line-height: 75px;
        text-align: center;
        font-size: 22px;
    }
    .selected-sum{
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 22px;
        color: aliceblue;
        font-weight: 700;
    }
    .next-name{
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 22px;
        color: aliceblue;
        font-weight: 700;
    }
    .playing-name{
        height: 80px;
        line-height: 80px;
        text-align: center;
        font-size: 22px;
        color: aliceblue;
        font-weight: 700;
    }
    .logo{
        width: 80px;
        height: 80px;
        background-image: url(../assets/image/website-logo.png);
        background-size: 100% 100%;
        margin-left: 80px;
    }

}
</style>