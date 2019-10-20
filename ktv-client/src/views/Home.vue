<template>
  <div class="home">
    <div class="wrapper">
      <div class="topBar">
        <top-nav></top-nav>
      </div>
      <div class="center">
          <router-view></router-view>
      </div>
      <div class="bottomBar">
        <bottom-nav></bottom-nav>
      </div>
    </div>
  </div>
</template>

<script>
import topNav from "@/components/topNav";
import bottomNav from "@/components/bottomNav";
export default {
  name: 'home',
  components:{
    topNav,
    bottomNav
  }
}
</script>
<style lang="less" scoped>
.home{
  width: 100%;
  height: 100%;
  

  .wrapper{
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-image: linear-gradient(141deg,#8B4726 0%,#8B2323 51%,#8B1A1A 75%);

    .topBar{
      width: 100%;
      height: 80px;
    }
    .bottomBar{
      width: 100%;
      height: 130px;
    }

    .center{
      width: 100%;
      flex: 1;
      background: transparent;
    }
  }
}
</style>
