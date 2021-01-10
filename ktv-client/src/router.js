import Vue from 'vue'
import Router from 'vue-router'
import { LoadingBar } from 'view-design'

import Home from './views/Home.vue'
import Index from './views/Index.vue'
import Hot from './views/hot.vue'
import Artist from './views/artist.vue'
import ABC from './views/abc.vue'
import Language from './views/language.vue'
import Style from './views/style.vue'
import KtvLikes from './views/ktvlikes.vue'
import Selected from './views/selected.vue'
import notFound from './views/404.vue'

Vue.use(Router)

const vueRouter = new Router({
    mode:"history",
    base:process.env.BASE_URL,
    routes:[
      {
        path:"/", 
        redirect:"/home"
      },
      {
        path:"/home", 
        component:Home,
        children:[
          {path:"", redirect:"index"},
          {path:"index", name:"index", component:Index},
          {path:"hot", name:"hot", component:Hot, meta:{title:"歌曲热榜"}},
          {path:"artist", name:"artist", component:Artist, meta:{title:"明星点歌"}},
          {path:"ABC", name:"abc", component:ABC, meta:{title:"拼音点歌"}},
          {path:"language", name:"language", component:Language, meta:{title:"语种点歌"}},
          {path:"style", name:"style", component:Style, meta:{title:"风格点歌"}},
          {path:"ktvlikes", name:"ktvlikes", component:KtvLikes, meta:{title:"KTV推荐"}},
          {path:"selected", name:"selected", component:Selected, meta:{title:"已选歌曲"}},
        ]
      },
      { 
        path:"*", 
        component:notFound,
        name:"404", 
        meta:{
          title:"o(╥﹏╥)o迷茫中...",
        }
      }
    ]
})


vueRouter.beforeEach((from, to, next) => {
  LoadingBar.start();
  // if(to.path == "/" || to.path == "/home" || to.pa){
  //     next();
  // }
  next();
})

vueRouter.afterEach((to, next) => {
    LoadingBar.finish();
    if(to.meta.title){
        document.title = to.meta.title;
    }else{
        document.title = "自助点歌系统";
    }
    
})





export default vueRouter;
