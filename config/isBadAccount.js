/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 判断是否过期用户
*  @Date: 2019/10/19 12:19
*
*/ 
const UserOrOrders = require("../dbModel/user");
module.exports = async params => {
    let flag = false;
    try {
        const account = params.account;
        const user = await UserOrOrders.findOne({account})
        if(user){
            if(new Date().getTime() > new Date(user.endTime).getTime()){
                console.log("过期用户");
                // 处理
                return flag;
            }else{
                console.log("合法用户");
                return !flag;
            }
        }else{
            console.log("不合法用户");
            return flag;
        }
    } catch (error) {
        console.error(error)
        return flag;
    }
    
}
