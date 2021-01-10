<template>
    <div class="allorders">
        <Row style="padding:20px 60px 20px 40px;">
            <Col style="padding:0px 0px 0px 40px;" span="20">
                <el-date-picker
                v-model="selectDate"
                size="small"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                format="yyyy/MM/dd HH:mm:ss"
                end-placeholder="结束日期"
                align="right">
                </el-date-picker>
                <Button type="primary" v-if="selectDate" style="margin-left:10px;" @click="findorders">查询</Button>
            </Col>
            <Col :span="4" style="text-align:right;">
                <Button type="primary" @click="getAllOrders">所有订单</Button>
            </Col>
        </Row>
        <!-- 订单数据表 -->
        <div style="width:100%;background-color:#f40;">
            <el-table
                :data="allorders"
                class="order-table"
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
                    prop="order_id"
                    label="订单编号"
                    align="center"
                    width="250">
                </el-table-column>
                <el-table-column
                    label="账号"
                    prop="account"
                    align="center"
                    width="200">
                </el-table-column>
                <el-table-column
                    prop="publicpwd"
                    label="明文密码"
                    align="center"
                    width="150">
                </el-table-column>
                <el-table-column
                    prop="money"
                    align="center"
                    width="100"
                    label="金额">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="startTime"
                    width="200"
                    label="开始时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="endTime"
                    width="200"
                    label="结束时间">
                </el-table-column>
                <el-table-column
                    align="center"
                    prop="password"
                    width="300"
                    label="密文">
                </el-table-column>
                <el-table-column
                    prop="operation"
                    align='center'
                    label="操作"
                    fixed="right"
                    width="100">
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
    name:"allorders",
    data(){
        return{
            isCheckPassword:false,
            inputPassword:'',
            noChangeData:[],
            selectDate:"",
            allorders:[],
            allTableData:[],
            paginations: {  // 分页属性
                page_index: 1, // 当前位于哪页
                total: 0, // 总数
                page_size: 8, // 1页显示多少条
                page_sizes: [8, 15, 20, 25], //每页显示多少条
                layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
            },
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                    picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                    const start = new Date();
                    start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                    picker.$emit('pick', [start, end]);
                    }
                }]
            },
            delRow:""
        }
    },
    created(){
        this.getAllOrders();
    },
    methods:{
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
                            this.$axios.post("http://localhost:8633/api/admin/orders/del", this.delRow)
                                    .then(res => {
                                        this.$nextTick(() => {
                                            this.getAllOrders();
                                            wsmLoading.end();
                                            this.$Message.success(res.data.result);
                                        })
                                    })
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
        getAllOrders(){
            this.selectDate = '';
            this.$axios.get("http://localhost:8633/api/admin/orders/all")
                    .then(res => {
                        this.noChangeData = res.data;
                        this.allorders = res.data;
                        this.allTableData = res.data;
                        this.setPaginations();
                    })
        },
        onDeleteSong(order){
            this.$confirm("你确定要删除这条订单信息吗?不可恢复是否继续?", '提示', {
                confirmButtonText:"确定",
                cancleTextButtonText:"取消",
                type:"warning"
            }).then(() => {
                this.isCheckPassword = true;
                this.delRow = order;
            }).catch(() => console.log("cancle"))
        },
        findorders(){
            const startTime = new Date(this.selectDate[0]).getTime();
            const endTime = new Date(this.selectDate[1]).getTime();
            const result = [];
            this.noChangeData.forEach(item => {
                const time = new Date(item.startTime).getTime();
                if(time >= startTime && time <= endTime){
                    result.push(item)
                }
            })
            this.allorders = result;
            this.allTableData = result;
            this.setPaginations();
        },
        // 设置当前页
        handleCurrentChange(page) {
            // 获取当前页
            let sortnum = this.paginations.page_size * (page - 1);
            let table = this.allTableData.filter((item, index) => {
                return index >= sortnum;
            });
            // 设置默认分页数据
            this.allorders = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
            this.allorders = table.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
        // 改变每页条数
        handleSizeChange(page_size) {
            // 切换size
            this.paginations.page_index = 1;
            this.paginations.page_size = page_size;
            this.allorders = this.allTableData.filter((item, index) => {
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
            this.allorders = this.allTableData.filter((item, index) => {
                return index < this.paginations.page_size;
            });
        },
    }
}
</script>
<style lang="less" scoped>
.allorders{
    width: 100%;
    height: 100%;
    padding: 20px 60px;
}
</style>