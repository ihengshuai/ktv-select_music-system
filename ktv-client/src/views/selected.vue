<template>
    <div class="ktvlikes">
        <div class="wrapper">
            <Row style="padding:20px 150px;color:#fff;font-size:18px;font-weight:700;">
                <Col :span="3" style="cursor:default;">
                    封面
                </Col>
                <Col :span="6" style="cursor:default;padding-right:20px;">
                    歌曲
                </Col>
                <Col :span="6" style="cursor:default;">
                    歌手
                </Col>
                <Col :span="4" style="cursor:default;">
                    点播次数
                </Col>
                <Col :span="3" style="text-align:center;cursor:pointer;">
                    播放列表
                </Col>
            </Row>
            <Row class="row-song" style="padding:20px 150px;" v-for="(item, index) in songList" :key="index">
                <Col :span="3" style="cursor:default;">
                    <Avatar :src="'http://localhost:8633/api/music/poster?img=' + item.poster" />
                </Col>
                <Col :span="6" style="cursor:default;padding-right:20px;">
                    {{item.songName}}
                </Col>
                <Col :span="6" style="cursor:default;">
                    {{item.artist}}
                </Col>
                <Col :span="4" style="cursor:default;">
                    被点{{item.playcount}}次
                </Col>
                <Col :span="3" @click.native="playSong(item)" style="text-align:center;cursor:pointer;">
                    播放
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
import isExit from '@/config/addSong'
import nextSong from "@/config/nextSong"
export default {
    name:"ktvlikes",
    data(){
        return{

        }
    },
    created(){
        this.songList = JSON.parse(localStorage.songList)
    },
    methods:{
       playSong(song){
           const obj = [song]
           localStorage.setItem("currentSong", JSON.stringify(obj));
           this.$store.dispatch("setCurrentSong", song);
           nextSong();
       }
    },
    computed:{
        songList:{
           get(){
                // this.allTableData = this.$store.getters.songList;
                // this.setPaginations();
                return this.$store.getters.songList;
           },
           set(val){
               this.$store.dispatch("setAllSong", val);
           }
        }
    }
}
</script>
<style lang="less" scoped>
.ktvlikes{
    width: 100%;
    height: 100%;
    // background-image: url(../assets/image/bg1.jpg);
    // background-size: 100% 100%;
    color: rgb(219, 217, 217);
    position: relative;
    overflow: hidden;
    .wrapper{
        position: absolute;
        z-index: 100;
        top: 0px;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 0px 100px;

        .row-song{
            border-radius: 30px;
            &:hover{
                background-color: rgba(0, 0, 0, .1);
            }
        }
    }
}
::-webkit-scrollbar {
      width: 6px;
      height: 6px;
  }
  ::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.06);
      -webkit-box-shadow: inset 0 0 3px rgba(0,0,0,0.08);
  }
  /* 滚动条滑块 */
  ::-webkit-scrollbar-thumb {
      border-radius: 3px;
      background: rgba(236, 233, 233, 0.1);
      -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.2);
  }
</style>