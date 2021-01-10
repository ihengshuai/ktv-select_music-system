/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 如果登录,检测是否过期
*  @Date: 2019/1019 10:09
*
*/ 
import jwt_decode from "jwt-decode"
import { Message } from "view-design";
import router from '@/router'
function BadAccount(){
    const decode = jwt_decode(localStorage.userToken);
    const {endTime} = decode;
    const badTime = new Date(endTime).getTime();
    // setInterval(() => {
        if(new Date().getTime() > badTime){ // 到时间时,强制下机
            Message.error({
                content:"账号过期",
                duration:3
            });
            localStorage.removeItem("userToken");
            router.go(0);
        }
        if(new Date().getTime() - badTime == 5 * 60 * 1000){  // 5分钟提醒
            Message.warning({
                content:"你的余额不足,还剩5分钟",
                duration:10
            })
        }
    // }, 900)
}

export default BadAccount