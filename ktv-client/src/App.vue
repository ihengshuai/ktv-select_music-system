<template>
  <div id="app">
      <router-view/>
  </div>
</template>
<script>
import hasLogin from "@/config/isLogin"
import hasBad from "@/config/isBadAccount"
import jwt_decode from "jwt-decode";
export default {
  name:"App",
  components:{
    // Home
  },
  data(){
    return{
      
    }
  },
  created(){
      this.isLogin();
  },
  methods:{
    isLogin(){
        if(hasLogin()){
            const decode = jwt_decode(localStorage.userToken);
            this.$store.dispatch("setAuthorizated", true);
            this.$store.dispatch("setUser", decode);

            if(localStorage.songList){
                const list = JSON.parse(localStorage.songList);
                this.$store.dispatch("setAllSong", list);
            }else{
                localStorage.setItem("songList", JSON.stringify([]));
            }
            if(!localStorage.playModle){
                localStorage.setItem("playModle", 1);
            }
            if(!localStorage.currentSong){
                localStorage.setItem("currentSong", JSON.stringify([]));
            }
            console.log("已登录")
        }
        setInterval(() => {
            if(hasLogin()){
                hasBad();
            }else{
                this.$store.dispatch("clearState");
            }
        }, 2000)
    }
  }

}
</script>
<style lang="less" scoped>
#app{
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100vw;
  height: 100vh;
}


/* 滚动槽 */
  // 谷歌
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
