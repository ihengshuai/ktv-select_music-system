<template>
    <div class="user_service">
        <el-form :model="ruleForm" status-icon label-width="100px" class="ruleform" >
            <el-form-item label="时长:" required>
                <el-select v-model="timeLong" clearable placeholder="请选择时长">
                    <el-option
                        v-for="item in timeOptions"
                        :key="item"
                        :value="item">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="总金额:">
                <span>{{timeLong ? ruleForm.totalMoney : 0 }}元</span>
            </el-form-item>
            <el-form-item style="text-align:right;padding:20px 0px;">
                <el-button type="primary" @click="submitForm('ruleForm')">开户</el-button>
            </el-form-item>
        </el-form>
        <Row class="order-current" v-if="card.flag">
            <Card style="width:350px">
                <p slot="title">
                    <Icon type="ios-checkmark-circle" style="color:green;" />
                    开户成功
                </p>
                <a href="javascript:(0);" slot="extra">
                    <Icon type="ios-loop-strong"></Icon>
                    创建时间:{{card.currentTime}}
                </a>
                <div style="padding:5px 0px;">
                    <Icon type="ios-contact" />账号:<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{card.account}}</span>
                </div>
                <div style="padding:5px 0px;">
                    <Icon type="ios-key" />密码:<span style="padding: 0px 2px;color:#19be6b;font-weight:700;">{{card.password}}</span>
                </div>
                <div style="padding:5px 0px;">
                    <Icon type="logo-bitcoin" />金额:<span style="padding: 0px 2px;color:#ed4014;font-weight:700;">{{card.money}}元</span>
                </div>
                <div style="padding:5px 0px;">
                    <Icon type="ios-copy" />订单编号:<span style="padding: 0px 2px;color:#2b85e4;">{{card.order_id}}</span>
                </div>
            </Card> 
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
import "@/plugins/Date"
export default {
    name:"user_service",
    data(){
        return{
            isCheckPassword:false,
            inputPassword:"",
            ruleForm:{
                order_id:"",
                startTime:"",
                endTime:"",
                totalMoney:''
            },
            card:{
                account:'',
                password:'',
                money:'',
                order_id:'',
                currentTime:'',
                flag:false
            },
            timeLong:"",
            timeOptions:[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        }
    },
    created(){

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
                            this.ruleForm.order_id = new Date().format("yyyyMMddHHmmss") + `_${Math.floor(Math.random() * 100000)}`;
                            this.ruleForm.startTime = new Date().format("yyyy/MM/dd HH:mm:ss");
                            this.ruleForm.endTime = new Date(this.timeLong * 60 * 60 * 1000 + new Date(this.ruleForm.startTime).getTime()).format("yyyy/MM/dd HH:mm:ss");
                            this.$axios.post("http://localhost:8633/api/admin/account/new", this.ruleForm)
                                    .then(res => {
                                        this.card = {...res.data};
                                        this.card.flag = true;
                                        this.card.currentTime = new Date().format("yyyy/MM/dd HH:mm:ss");
                                        this.$nextTick(() => {
                                            this.inputPassword = "";
                                            this.timeLong = "";
                                            wsmLoading.end();
                                            this.$Message.success("开户成功");
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
        submitForm(formName){
            if(this.timeLong){
                this.isCheckPassword = true;
            }else{
                this.$Message.warning("请先选择时长");
            }
        },
        
    },
    watch:{
        timeLong(val){
            this.ruleForm.totalMoney = val * 30;
        }
    }
}
</script>
<style lang="less" scoped>
.user_service{
    width: 100%;
    height: 100%;
    background-image: url(../assets/image/user_service-bg.jpg);
    background-size: 100% 100%;
    display: flex;
    align-content: center;
    justify-content: center;

    .ruleform{
        margin-top: 100px;
        border-radius: 10px;
        font-size: 18px;
        font-weight: 900;
        padding:10px 20px;
        padding-top: 40px;
        width:600px;
        height: 250px;
        background: rgba(0, 0, 0, .1);
    }

    .order-current{
        position: fixed;
        background-color: aqua;
        margin-top: 380px;
    }
    
}
</style>