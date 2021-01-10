/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 获取验证码
*  @Date: 2019/10/16 10:39
*
*/ 
const svgCaptcha = require('svg-captcha');
const router = require("express").Router();

router.get("/" , (req, res) => {
    const captcha = svgCaptcha.create({
        // 翻转颜色  
        inverse: false,  
        // 字体大小  
        fontSize: 38,  
        // 噪声线条数  
        noise: 3,  
        // 宽度  
        width: 80,  
        // 高度  
        height: 32
    })
    // 保存到session,忽略大小写  
    req.session = captcha.text.toLowerCase(); 
    console.log(req.session); //0xtg 生成的验证码
    //保存到cookie 方便前端调用验证
    res.cookie('captcha', req.session); 
    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(String(captcha.data));
    res.end();
})


module.exports = router