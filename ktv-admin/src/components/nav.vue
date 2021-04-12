<template>
    <div class="wsmnav">
        
        <Menu mode="horizontal" :theme="theme">
            <Row>
                <i-col :span="7">
                    <div class="nav-logo">后台管理系统</div>
                </i-col>
                <i-col :span="13">
                    <div class="current-time">{{nowTime}}</div>
                </i-col>
                <MenuItem class="opera-btn" name="1">
                    <Dropdown trigger="click">
                        <a href="javascript:void(0)">
                            <Avatar :src="avatar" />
                            <Icon type="ios-arrow-down" style="margin-left:5px;color:#bbb;"></Icon>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem @click.native="goIndex">你好,{{adminInfo.username}}</DropdownItem>
                            <DropdownItem @click.native="goManageMusic">歌曲管理</DropdownItem>
                            <DropdownItem @click.native="goAdminLikes">推荐歌曲</DropdownItem>
                            <DropdownItem @click.native="goUser_service">开机服务</DropdownItem>
                            <DropdownItem @click.native="allorders">订单查询</DropdownItem>
                            <DropdownItem @click.native="logout">退出登录</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </MenuItem>
            </Row>
        </Menu>
        
    </div>
</template>
<script>
import "@/plugins/Date"
export default {
    name:"wsmnav",
    data(){
        return{
            theme:"dark",
            avatar:require("../assets/avatar/admin.jpg"),
            adminInfo:"",
            nowTime:"",
        }
    },
    created(){
        this.getAdminInfo();
        this.currentTime();
    },
    methods:{
        goIndex(){
            this.$router.push("/admin/index");
        },
        allorders(){
            this.$router.push("/admin/allorders");
        },
        goUser_service(){
            this.$router.push("/admin/user_service");
        },
        goManageMusic(){
            this.$router.push("/admin/manage/music");
        },
        goAdminLikes(){
            this.$router.push("/admin/music/likes");
        },
        // 刷新时间
        currentTime(){
            setInterval(() => {
                this.nowTime = new Date().format("yyyy/MM/dd HH:mm:ss")
            }, 1000)
        },
        // 退出
        logout(){
            this.$confirm('确定退出吗？每一片贫瘠的土地都需要坚定的挖掘者！', '退出提示', {
                confirmButtonText: '退出',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$store.dispatch("clearAdminAuthorization");
                this.$router.push("/login");
            }).catch(() => {})
            
        },
        // 获取管理员信息
        getAdminInfo(){
            this.adminInfo = this.$store.getters.adminInfo;
        }
    }
}
</script>
<style lang="less" scoped>
.wsmnav{
    .opera-btn{
        position: absolute;
        right:120px;
    }
    .current-time{
        font-size: 16px;
        color: rgb(173, 166, 166);
        text-align: right;
    }

    .nav-logo{
        height: 60px;
        line-height: 60px;
        color: rgb(192, 190, 190);
        font-size: 40px;
        width: 100%;
        text-align: center;
        font-family: "隶书";
    }
}
</style>