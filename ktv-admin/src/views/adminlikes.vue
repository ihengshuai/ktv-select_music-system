<template>
    <div class="adminlikes">
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="20">
                <Input prefix="ios-musical-notes" clearable v-model="searchName" @keypress.enter.native="searchSong()" placeholder="按 歌名, 歌手 搜索歌曲..." style="width: auto" />
            </Col>
            <Col :span="4" style="text-align:right;">
                <Button type="primary" @click="getAdminLikes">所有歌曲</Button>
            </Col>
        </Row>
        <!-- 歌曲数据表 -->
        <div style="width:100%;background-color:#f40;">
            <el-table
                :data="adminLikes"
                class="song-table"
                style="width: 100%"
                border
            >
                <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="60">
                </el-table-column>
                <el-table-column
                    prop="_id"
                    label="歌曲 ID"
                    align="center"
                    width="240">
                </el-table-column>
                <el-table-column
                    label="歌曲名"
                    prop="songName"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="artist"
                    label="歌手"
                    align="center"
                    width="170">
                </el-table-column>
                <el-table-column
                    prop="src"
                    align="center"
                    width="200"
                    label="歌曲地址">
                </el-table-column>
                <el-table-column
                    align="center"
                    width="120"
                    label="歌曲封面">
                    <template slot-scope='scope'>
                        <Avatar :src="'http://localhost:8633/api/music/poster?img=' + scope.row.poster" size="large" />
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="language"
                    width="120"
                    label="语种">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="style"
                    width="120"
                    label="风格">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="playcount"
                    width="80"
                    label="播放次数">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="date"
                    width="200"
                    label="最近更新时间">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    min-width="100">
                    <template slot-scope='scope'>
                        <el-button 
                            type="danger" 
                            icon='el-icon-delete' 
                            size="small"
                            circle
                            @click='onDeleteSong(scope.row,scope.$index)'
                        ></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <Row>
            <Col span="24" style="text-align:right;padding:10px;">
                <el-pagination
                    v-if='paginations.total > 0'
                    :page-sizes="paginations.page_sizes"
                    :page-size="paginations.page_size"
                    :layout="paginations.layout"
                    :total="paginations.total"
                    :current-page.sync='paginations.page_index'
                    @current-change='handleCurrentChange'
                    @size-change='handleSizeChange'>
                </el-pagination>
            </Col>
        </Row>
        <!-- 验证密码 -->
        <Modal draggable v-model="isCheckPassword" :mask-closable="false" width="360">
            <p slot="header" style="color:#f60;">
                <Icon type="ios-information-circle"></Icon>
                <span>验证密码</span>
            </p>
            <div style="text-align:left;font-size:14px;">
                <Row>
                    <Col span="18">
                        <Input v-model="inputPassword" type="password" icon="ios-key" @keyup.enter.native="checkPwd()"  placeholder="请输入管理员密码..." style="width: 200px" />
                    </Col>
                    <Col span="6">
                        <Button type="primary" size="large" @click="checkPwd()">验证</Button>
                    </Col>
                </Row>
            </div>
            <div slot="footer">
            </div>
        </Modal>
    </div>
</template>
<script>
import wsmLoading from "@/plugins/wsmLoading"
export default {
    name:"adminlikes",
    data(){
        return{
            isCheckPassword:false,
            inputPassword:"",
            searchName:"",
            adminLikes:[],
            allTableData:[],
            paginations: {  // 分页属性
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            delRow:""
        }
    },
    created(){
        this.getAdminLikes();
    },
    methods:{
        // 搜索歌曲
        searchSong(){
            if(this.searchName.trim().length){
                // console.log(this.searchName)
                this.$axios.post("http://localhost:8633/api/admin/adminlike/search", {
                    searchName:this.searchName
                }).then(res => {
                    this.adminLikes = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
            }else{
                this.$Message.warning("搜索内容不能为空");
            }
        },
        checkPwd(){
            if(this.inputPassword.trim().length){
                this.isCheckPassword = false;
                wsmLoading.start("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:8633/api/admin/islegal",{
                        password:this.inputPassword,
                        email:this.$store.getters.adminInfo.email
                    }).then(res => {
                        if(res.data == true){
                            this.$axios.post("http://localhost:8633/api/admin/adminlike/del", this.delRow)
                                    .then(res => {
                                        this.$nextTick(() => {
                                            this.getAdminLikes();
                                            wsmLoading.end();
                                            this.inputPassword = "";
                                            this.$Message.success("移除成功");
                                        })
                                        
                                    }).catch(err => console.error(err))
                        }
                    }).catch(() => this.isCheckPassword = true)
                }, 300)
            }else{
                this.isCheckPassword = false;
                this.$Modal.warning({
                    title:"提示",
                    content:"密码不能为空,请输入管理员口令...",
                    onOk:()=>{
                        this.isCheckPassword = true;
                    }
                })
            }
        },
        // 获取所有喜欢歌曲
        getAdminLikes(){
            this.$axios.get("http://localhost:8633/api/admin/adminlike/all")
                    .then(res => {
                        this.adminLikes = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    })
        },
        // 移除歌曲
        onDeleteSong(song){
            console.log(song)
            this.$confirm(`你确定要移除 ${song.songName} (${song.artist}) 吗?不可恢复是否继续?`, '提示', {
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).then(() => {
                this.delRow = song;
                this.isCheckPassword = true;
            }).catch(() => {})
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.adminLikes = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.adminLikes = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.adminLikes = this.allTableData.filter((item, index) => {
                return index < page_size;
            });
        },
        // 设置的分页
        setPaginations() {
            // 总页数
            this.paginations.total = this.allTableData.length;
            this.paginations.page_index = 1;
            this.paginations.page_size = 8;
            // 设置默认分页数据
            this.adminLikes = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.adminlikes{
    width: 100%;
    height: 100%;
    padding: 20px 60px;
}
</style>