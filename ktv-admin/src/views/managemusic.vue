<template>
    <div class="managemusic">
        <audio ref="musicPlayer" :src="toListenSrc" @ended="ended" autoplay preload="load"></audio>
        <Row style="padding:20px 60px 20px 40px;">
            <Col :span="5">
                <Input prefix="ios-musical-notes" clearable v-model="searchName" @keypress.enter.native="searchSong()" placeholder="按 歌名, 歌手 搜索歌曲..." style="width: auto" />
            </Col>
            <Col :span="3">
                <Button type="primary" style="margin-left:5px;" @click="getAllSong()">所有歌曲</Button>
            </Col>
            <Col :span="4">
                <Button type="success" style="margin-left:5px;" @click="toListen = true">试听歌曲</Button>
            </Col>
            <Col :span="12" style="text-align:right;">
                <Avatar id="musicPoster" @click.native="operaMusic" class="listen-poster" v-if="toListenPoster" :src="toListenPoster" size="large" style="margin-right:40px;" />
                <Button type="primary" @click="showAddSongBtn()">添加</Button>
            </Col>
        </Row>
        <!-- 歌曲数据表 -->
        <div style="width:100%;background-color:#f40;">
            <el-table
                :data="allSongs"
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
                    min-width="150">
                    <template slot-scope='scope'>
                        <el-button 
                            type="warning"
                            size="small"
                            circle
                            icon="el-icon-star-off"
                            @click='likeSongs(scope.row)'
                        ></el-button>
                        <el-button 
                            type="primary" 
                            icon="el-icon-edit" 
                            size="small"
                            circle
                            @click='onEditSong(scope.row)'
                        ></el-button>
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

        <!-- 添加歌曲 -->
        <el-dialog 
            :title="addDialog.title" 
            :visible.sync="addDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="addForm" 
                    :model="addForm"
                    :rules="addForm_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">
                    <el-form-item prop='songName' label="歌曲名:">
                        <el-input type="songName" v-model="addForm.songName"></el-input>
                    </el-form-item>
                    <el-form-item prop='artist'  label="歌手:">
                        <el-input type="artist" v-model="addForm.artist"></el-input>
                    </el-form-item>
                    <el-form-item prop='src' label="歌曲地址:">
                        <Upload action="http://localhost:8633/api/admin/upload/music"
                            :on-success="handleAddSongSuccess"
                            ref="uploadmusic"
                            :format="['mp3']">
                            <Button icon="ios-cloud-upload-outline" @click.native="clearFiles">上传歌曲</Button>
                        </Upload>
                    </el-form-item>
                    <el-form-item label="歌曲封面:" prop="poster">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','png']"
                            :max-size="10000"
                            multiple
                            type="drag"
                            :on-success="handleAddPosterSuccess"
                            action="http://localhost:8633/api/admin/upload/poster"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="'http://localhost:8633/api/music/poster?img=' + addForm.poster" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>
                    <el-form-item prop='language'  label="语种:">
                        <Select v-model="addForm.language" clearable style="width:200px">
                            <Option v-for="item in Languages" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </el-form-item>
                    <el-form-item prop='style'  label="风格:">
                        <Select v-model="addForm.style" clearable style="width:200px">
                            <Option v-for="item in SongStyle" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </el-form-item>
                    <el-form-item  class="text_right">
                        <el-button @click="addDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='addSong("addForm")'>提  交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>

        <!-- 编辑歌曲 -->
        <el-dialog 
            :title="editDialog.title" 
            :visible.sync="editDialog.show"
            :close-on-click-modal='false'
            :close-on-press-escape='false'
            :modal-append-to-body="false">
            <div class="form">
                <el-form 
                    ref="editForm" 
                    :model="editForm"
                    :rules="addForm_rules"
                    label-width="120px" 
                    style="margin:10px;width:auto;">
                    <el-form-item prop='_id' label="歌曲ID:">
                        <el-input type="id" disabled v-model="editForm._id"></el-input>
                    </el-form-item>
                    <el-form-item prop='songName' label="歌曲:">
                        <el-input type="songName" v-model="editForm.songName"></el-input>
                    </el-form-item>
                    <el-form-item prop='artist'  label="歌手:">
                        <el-input type="artist" v-model="editForm.artist"></el-input>
                    </el-form-item>
                    <el-form-item prop='src' label="歌曲地址:">
                        <Upload action="http://localhost:8633/api/admin/upload/music"
                            :on-success="handleEditSongSuccess"
                            ref="editmusic"
                            :format="['mp3']">
                            <Button icon="ios-cloud-upload-outline">重新选择</Button>
                        </Upload>
                        <!-- <el-input type="src" v-model="form.src"></el-input> -->
                    </el-form-item>
                    <el-form-item label="歌曲封面:" prop="pic">
                        <Upload
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="50000"
                            multiple
                            type="drag"
                            :on-success="handleEditPosterSuccess"
                            action="http://localhost:8633/api/admin/upload/poster"
                            style="display:block;width:44px;">
                            <span style="float:left;">
                                <Avatar :src="'http://localhost:8633/api/music/poster?img='+ editForm.poster" size="large" />
                            </span>
                        </Upload>
                    </el-form-item>
                    <el-form-item prop='language'  label="语种:">
                        <Select v-model="editForm.language" clearable style="width:200px">
                            <Option v-for="item in Languages" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </el-form-item>
                    <el-form-item prop='style'  label="风格:">
                        <Select v-model="editForm.style" clearable style="width:200px">
                            <Option v-for="item in SongStyle" :value="item" :key="item">{{ item }}</Option>
                        </Select>
                    </el-form-item>

                    <el-form-item  class="text_right">
                        <el-button @click="editDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='okEditBtn("editForm")'>提  交</el-button>
                    </el-form-item>

                </el-form>
            </div>
        </el-dialog>

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

        <!-- 音乐试听 -->
        <Modal v-model="toListen" width="700">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-musical-notes" />
                <span> 点击试听</span>
            </p>
            <div v-if="toListen">
                <div style="width:100%;">
                    <el-table
                    :data="allSongs"
                    height="300"
                    style="width: 100%">
                        <el-table-column
                            prop="songName"
                            align="center"
                            width="200"
                            label="歌名">
                        </el-table-column>
                        <el-table-column
                            prop="artist"
                            align="center"
                            width="200"
                            label="歌手">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            width="200"
                            label="试听">
                            <template slot-scope="scope">
                                <span class="toListen-link" @click="listenMusic(scope.row)">播放</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div slot="footer" v-if="toListen" style="height:30px;">
                <Col span="24" style="text-align:right;padding:0px 10px;">
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
            </div>
        </Modal>
    </div>
</template>
<script>
import wsmLoading from "@/plugins/wsmLoading"
import $ from "jquery";
export default {
    name:"managemusic",
    data(){
        return{
            isfirst:false,
            firstEdit:true,
            isCheckPassword:false,
            inputPassword:"",
            searchName:"",
            flag:"",  // 用来判断是 添加, 编辑或删除
            noChangeSongs:[],
            toListen:false,
            toListenSrc:"",
            toListenPoster:"",
            allSongs:[],
            allTableData:[],
            paginations: {  // 分页属性
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            delRow:"",
            editDialog:{
                title:"编辑歌曲",
                show:false
            },
            editForm:{   // 编辑歌曲的form
                _id:"",
                songName:"",
                src:"",
                artist:"",
                poster:"",
                language:"",
                style:""
            },
            addDialog:{
                title:"添加歌曲",
                show:false
            },
            addForm:{
                songName:"",
                artist:"",
                src:"",
                poster:"",
                language:"",
                style:""
            },
            addForm_rules: {  // 添加或者编辑歌曲规则 
                songName: [
                    { required: true, message: "歌曲名不能为空"}
                ],
                artist: [
                    { required: true, message: "歌手不能为空"}
                ],
                src:[
                    { required:true,message:"歌曲不能为空"}
                ],
                poster: [
                    { required: true, message: "歌曲封面不能为空"}
                ]
            },
            // 语种
            Languages:["汉语", "韩语", "日语", "英语", "粤语"],
            SongStyle:["传统", "民歌", "摇滚", "伴奏", "古风"],  // 歌曲风格
        }
    },
    created(){
        this.getAllSong();
    },
    methods:{
        // 验证密码
        checkPwd(){
            if(this.inputPassword.trim().length){
                this.isCheckPassword = false;
                wsmLoading.start("正在验证密码,请稍候...");
                setTimeout(() => {
                    this.$axios.post("http://localhost:8633/api/admin/islegal",{
                        password:this.inputPassword,
                        email:this.$store.getters.adminInfo.email
                    }).then(res => {
                        console.log(res)
                        if(res.data == true){
                            if(this.flag == 1){  // 添加歌曲
                                wsmLoading.start("密码正确, 正在添加歌曲");
                                this.$axios.post("http://localhost:8633/api/admin/music/add", this.addForm)
                                    .then(res => {
                                        this.getAllSong();
                                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                            wsmLoading.end();
                                            this.inputPassword = "";
                                            this.$Message.success("添加成功");
                                        });
                                    })
                            }else if(this.flag == 2){ // 编辑歌曲
                                wsmLoading.start("密码正确, 正在编辑歌曲歌曲");
                                this.$axios.post("http://localhost:8633/api/admin/music/edit", this.editForm)
                                    .then(res => {
                                        console.log(res.data)
                                        this.getAllSong();
                                        this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                                            wsmLoading.end();
                                            this.inputPassword = "";
                                            this.$Message.success("更新成功");
                                        });
                                    })
                            }else if(this.flag == 3){  // 删除歌曲
                                wsmLoading.start("密码正确, 正在删除歌曲..");
                                this.$axios.post("http://localhost:8633/api/admin/music/delete", this.delRow)
                                    .then(res => {
                                        console.log(res.data);
                                        this.getAllSong();
                                        this.$nextTick(() => {
                                            wsmLoading.end();
                                            this.inputPassword = "";
                                            this.$Message.success("删除成功");
                                        })
                                    })
                            }
                        }
                    }).catch(err => this.inputPassword = "")
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
        // 管理员收藏歌曲
        likeSongs(song){
            console.log(song)
            this.$confirm(`要添加 ${song.songName} (${song.artist}) 歌曲到KTV推荐歌曲里吗? `,'操作提示', {
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).then(() => {
                this.$axios.post("http://localhost:8633/api/admin/adminlike/add", {
                    s_id:song._id
                }).then(res => {
                    this.$Message.success("收藏成功");
                }).catch(err => console.error(err))
            }).catch(() => {
            })
        },
        // 删除歌曲
        onDeleteSong(song){
            this.$confirm(`确定删除 ${song.songName} (${song.artist}) 歌曲吗?不可撤销,是否继续? `,'风险提示', {
                confirmButtonText:"确定",
                cancelButtonText:"取消",
                type:"warning"
            }).then(() => {
                this.isCheckPassword = true;
                this.flag = 3;
                this.delRow = song;
            }).catch(() => {
            })
            
        },
        okEditBtn(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.isCheckPassword = true;
                    this.editDialog.show = false;
                    this.flag = 2;
                }
                // 不合法
            })
        },
        // 编辑歌曲
        onEditSong(song){
            console.log(song)
            this.editForm = {...song};
            this.editDialog.show = true;
            this.clearFiles();
        },
        // 成功上传歌曲
        handleEditSongSuccess(res){
            console.log(res)
            this.editForm.src = res.result.src;
            this.firstEdit = false;
        },
        // 成功上传图片
        handleEditPosterSuccess(res){
            console.log(res)
            this.editForm.poster = res.result.poster;
            console.log(this.editForm)
        },
        // 搜索歌曲
        searchSong(){
            if(this.searchName.trim().length){
                this.$axios.post("http://localhost:8633/api/music/search/byname",{
                    searchName:this.searchName
                }).then(res => {
                    this.allSongs = res.data;
                    this.allTableData = res.data;
                    this.setPaginations();
                })
            }else{
                this.$Message.warning("搜索内容不能为空..")
            }
        },
        // 添加音乐
        addSong(formName){
            this.$refs[formName].validate(valid => {
                if(valid){
                    this.isCheckPassword = true;
                    this.addDialog.show = false;
                    this.flag = 1;
                }
                // 不合法
            })
        },
        // 显示添加音乐模态框
        showAddSongBtn(){
            this.addDialog.show = true;
            this.addForm.songName = "";
            this.addForm.artist = "";
            this.addForm.src = "";
            this.addForm.poster = "";
            this.addForm.language = "";
            this.addForm.style = "";
            this.addForm.playcount = "";
            this.addForm.date = "";
            this.clearFiles();
        },
        // 成功添加歌曲回调
        handleAddSongSuccess(res){
            console.log(res)
            this.addForm.src = res.result.src;
        },
        // 成功添加歌曲海报回调
        handleAddPosterSuccess(res){
            this.isfirst = true;
            console.log(res)
            this.addForm.poster = res.result.poster;
        },
        clearFiles(){
            if(this.firstEdit == false){
                this.$refs.editmusic.clearFiles();
            }
            if(this.isfirst == true){
                this.$refs.uploadmusic.clearFiles();
            }
        },
        listenMusic(song){
            this.toListenSrc = `http://localhost:8633/api/music/nowmusic?id=${song._id}`
            this.toListenPoster = `http://localhost:8633/api/music/poster?img=${song.poster}`
            setTimeout(() => {
                console.log(this.$refs.musicPlayer.duration)
            }, 200)
        },
        // 操作音乐
        operaMusic(){
            if(this.$refs.musicPlayer.paused){
                $(".listen-poster").css("animation-play-state", "running");
                this.$refs.musicPlayer.play();
            }else{
                $(".listen-poster").css("animation-play-state", "paused");
                this.$refs.musicPlayer.pause();
            }
        },
        ended(){
            this.$refs.musicPlayer.play();
        },
        // 获取所有歌曲
        getAllSong(){
            this.$axios.get("http://localhost:8633/api/music/all")
                .then(res => {
                    if(res.data.length){
                        this.allSongs = res.data;
                        this.noChangeSongs = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    }else{
                        console.error(res);
                    }
                }).catch(err => console.log(err))
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
.managemusic{
    width: 100%;
    height: 100%;
    padding: 20px 60px;
    

    .listen-poster{
        cursor: pointer;
        animation: poster 15s linear infinite;
    }
    @keyframes poster {
        from{
            transform: rotate(0deg);
        }
        to{
            transform: rotate(360deg);
        }
    }
}
.toListen-link{
    cursor: pointer;
    &:hover{
        color: rgb(223, 107, 72);
    }
}
</style>