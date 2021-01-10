<template>
    <div class="ktvlikes">
        <Row class="search-box">
            <Col :span="20">
                <Input v-model="searchSong" @keypress.enter.native="fetchSongs" placeholder="搜索歌曲(按歌名或歌手搜索)..." clearable style="width: 300px" />
            </Col>
            <Col :span="4">
                <Icon @click="getAllSongs" type="md-refresh" style="font-size:35px;cursor:pointer;" />
            </Col>
        </Row>
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
            <Row class="row-song" style="padding:20px 150px;" v-for="(item, index) in allSongs" :key="index">
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
                <Col :span="3" @click.native="addSong(item)" style="text-align:center;cursor:pointer;">
                    添加
                </Col>
            </Row>
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
        </div>
    </div>
</template>
<script>
import isExit from '@/config/addSong'
export default {
    name:"abc",
    data(){
        return{
            searchSong:"",
            allSongs:[],
            allTableData:[],
            paginations: {
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
        }
    },
    created(){
        this.getAllSongs();
    },
    methods:{
         // 添加歌曲
        addSong(song){
            isExit(song);
        },
        // 搜索歌曲
        fetchSongs(){
            if(this.searchSong.trim().length){
                this.$axios.post("http://localhost:8633/api/music/search", {
                    searchName:this.searchSong
                }).then(res => {
                    console.log(res.data)
                    this.allSongs = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
            }else{
                this.$confirm("输入内容不能为空,请重新输入~", "提示", {
                    confirmButtonText:"确定",
                    cancleButtonText:"取消",
                    type:"warning"
                }).then(() => {

                }).catch(() => {})
            }
        },
        // 获取歌曲
        getAllSongs(){
            this.searchSong = "";
            this.$axios.post("http://localhost:8633/api/music/all")
                .then(res => {
                    this.allSongs = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allSongs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allSongs = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allSongs = this.allTableData.filter((item, index) => {
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
            this.allSongs = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
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
    .search-box{
        position: absolute;
        padding: 15px 250px;
        width: 100%;
        z-index: 999;
        background-image: linear-gradient(141deg, #8B4726 0%, #8B2323 51%, #8B1A1A 75%);
    }

    .wrapper{
        position: absolute;
        z-index: 100;
        top: 0px;
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 50px 100px;
        z-index: 100;

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