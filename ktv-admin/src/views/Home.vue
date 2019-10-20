<template>
  <div class="home">
    <div class="nav">
        <wsmnav></wsmnav>
    </div>
    <div class="content">
        <router-view></router-view>
    </div>
  </div>
</template>

<script>
import wsmnav from "@/components/nav"
export default {
  name: 'home',
  components: {
      wsmnav,
  }
}
</script>
<style lang="less" scoped>
.home{
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .nav{
        width:100%;
    }

    .content{
        flex: 1;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
    }
}
</style>
