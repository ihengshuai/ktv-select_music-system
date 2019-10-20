<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
  name:"App",
  data(){
      return{

      }
  },
  created(){
      this.isLogin();
  },
  methods:{
      // 判断是否登录
      isLogin(){
          if(localStorage.adminToken){
              const decoded = jwt_decode(localStorage.adminToken);
              this.$store.dispatch("setAdminInfo", decoded);
              this.$store.commit("isAdminAuthorization", true);
          }
      }
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100vw;
  height: 100vh;
}

/* 滚动槽 */
/* 谷歌  */
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
