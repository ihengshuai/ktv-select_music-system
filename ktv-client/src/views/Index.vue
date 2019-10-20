<template>
    <div class="index-view">
        <!-- 首页内容 -->
        <div class="content">
            <div class="left-content">
                <div class="top1">
                    <div class="left1">
                        <div @click="goArtist"></div>
                    </div>
                    <div class="right1">
                        <div class="top2">  
                            <div class="left2"><div @click="goABC"></div></div>
                            <div class="right2"><div @click="goLanguage"></div></div>
                        </div>
                        <div class="bottom2"><div @click="goStyle"></div></div>
                    </div>
                </div>
                <div class="bottom1"><div @click="goKtvLikes"></div></div>
            </div>
            <div class="right-content" @click="goHot()"><div></div></div>
        </div>
    </div>
</template>
<script>
import hasLogin from "@/config/isLogin";
export default {
    name:"index-view",
    data(){
        return{

        }
    },
    methods:{
        goHot(){
            if(hasLogin()){
                this.$router.push('/home/hot');
            }
        },
        goArtist(){
            if(hasLogin()){
                this.$router.push('/home/artist');
            }
        },
        goABC(){
            if(hasLogin()){
                this.$router.push('/home/abc');
            }
        },
        goLanguage(){
            if(hasLogin()){
                this.$router.push('/home/language');
            }
        },
        goStyle(){
            if(hasLogin()){
                this.$router.push('/home/style');
            }
        },
        goKtvLikes(){
            if(hasLogin()){
                this.$router.push('/home/ktvlikes');
            }
        }
    }
}
</script>
<style lang="less" scoped>
.index-view{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .content{
        width: 1100px;
        height: 450px;
        // border: 1px solid #000;
        display: flex;

        .left-content{
            width: 100%;
            flex: 3;
            display: flex;
            flex-direction: column;

            .top1{
                width: 100%;
                flex: 3;
                display: flex;

                .left1{
                    flex: 1;
                    height: 100%;
                    padding: 5px;
                    div{
                        // margin-bottom: 5px;
                        border-radius: 5px;
                        width: 100%;
                        height: 97%;
                        background-image: url(../assets/image/mingxing-song.jpg);
                        background-position: center;
                        transition: all 750ms;
                        &:hover{
                            transform: scale(1.03);
                            cursor: pointer;
                            box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                        }
                    }
                    
                }
                .right1{
                    flex: 2;
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .top2{
                        flex: 2;
                        width: 100%;
                        display: flex;
                        .left2{
                            flex: 1;
                            height: 100%;
                            padding: 5px;
                            div{
                                border-radius: 5px;
                                width: 100%;
                                height: 100%;
                                background-image: url(../assets/image/pinyin-song.jpg);
                                background-position: center; 
                                background-size: 100% 100%;
                                transition: all 750ms;
                                &:hover{
                                    transform: scale(1.03);
                                    cursor: pointer;
                                    box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                                }
                            }
                        }
                        .right2{
                            flex: 1;
                            height: 100%;
                            padding: 5px;
                            div{
                                border-radius: 5px;
                                width: 100%;
                                height: 100%;
                                background-image: url(../assets/image/yuzhong-song.jpg);
                                background-position: center top; 
                                transition: all 750ms;
                                &:hover{
                                    transform: scale(1.03);
                                    cursor: pointer;
                                    box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                                }
                            }
                        }
                    }
                    .bottom2{
                        flex: 1;
                        width: 100%;
                        height: 100%;
                        padding-top: 10px;
                        
                        div{
                            border-radius: 5px;
                            // margin: 5px;
                            margin-bottom: 0px;
                            width: 98.4%;
                            height: 90%;
                            background-image: url(../assets/image/fengge-song.jpg);
                            background-size: 100% 120%;
                            background-position: center;
                            transition: all 750ms;
                            &:hover{
                                transform: scale(1.03);
                                cursor: pointer;
                                box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                            }
                        }
                    }
                }
            }
            .bottom1{
                width: 100%;
                flex:1;
                padding: 5px;
                div{
                    margin-right: 5px;
                    border-radius: 5px;
                    width: 99%;
                    height: 100%;
                    background-image: url(../assets/image/likes-song.png);
                    background-size: 100% 170%;
                    background-position: center;
                    transition: all 750ms;
                    &:hover{
                        transform: scale(1.03);
                        cursor: pointer;
                        box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                    }
                }
            }
        }
        .right-content{
            width: 100%;
            flex: 1;
            padding: 5px;
            div{
                border-radius: 5px;
                width: 100%;
                height: 100%;
                background-image: url(../assets/image/hot-song.jpg);
                background-size: 170% 120%;
                background-position: center top;
                transition: all 750ms;
                &:hover{
                    transform: scale(1.03);
                    cursor: pointer;
                    box-shadow: 1px 1px 1px rgba(0, 0, 0, .4);
                }
            }
        }
    }
}
</style>