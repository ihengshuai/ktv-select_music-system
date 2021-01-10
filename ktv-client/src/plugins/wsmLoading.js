/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 加载动画
*  @Date: 2019/10/19 10:17
*
*/ 

import { Loading } from 'element-ui';
import Vue from 'vue';

let loadingInstance;
let wsmLoading = {
    start:(notice, bgcolor, fullscreen) => {
        loadingInstance = Loading.service({
            fullscreen: fullscreen ? fullscreen : true,
            text: notice ? notice : '正在加载...',
            background: bgcolor ? bgcolor : "rgba(0,0,0,.7)",
            lock: true,
        })
    },
    end:() => {
        Vue.nextTick(() => {
            loadingInstance.close();
        })
    }
}

export default wsmLoading