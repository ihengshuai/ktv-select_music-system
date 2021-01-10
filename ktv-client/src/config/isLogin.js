/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 判断是否登录
*  @Date: 2019/10/19 9:27
*
*/ 

function isLogin(){
    if(!localStorage.userToken){
        return false;
    }else{
        return true;
    }
}

export default isLogin