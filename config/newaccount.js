/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 随机生成账号和密码
*  @Date: 2019/10/18 14:02
*
*/ 


module.exports = time => {   // 添加time参数来模仿时间戳,  防止缓存, 多次账号密码一致
    //  xxxx @ yyy .com
    const accoutList = ['a','b','c','d','e','f','g','h','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',1,2,3,4,5,6,7,8,9];
    const pwdList = ['1','2','3','4','5','6','7','8','9'];
    let name1 = '',
        name2 = '',
        pwd = '';
    for(let i = 0; i < 8; i ++){
        name1 += accoutList[Math.floor(Math.random() * 34)];
    }
    for(let j = 0; j < 3; j++){
        name2 += accoutList[Math.floor(Math.random() * 34)];
    }
    for(let k = 0; k < 6; k++){
        pwd += pwdList[Math.floor(Math.random() * 9)];
    }
    const account = name1 + '@' + name2 + '.com';
    const password = pwd;

    return {account,password}
}