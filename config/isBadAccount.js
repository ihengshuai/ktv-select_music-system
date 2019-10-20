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
    
    
    const flag = await new Promise((resolve) => {
        if(params){
            const account = params.account;
            UserOrOrders.findOne({account})
                .then(user => {
                    if(user){
                        if(new Date().getTime() > new Date(user.endTime).getTime()){
                            console.log("过期用户");
                            // 处理
                            return resolve(false);
                        }else{
                            console.log("合法用户");
                            return resolve(true);
                        }
                    }else{
                        return resolve(false);
                    }
                })
        }else{
            console.log("不合法用户");
            return resolve(false);
        }
        
    }) 
    return flag;
}