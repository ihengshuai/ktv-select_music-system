/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 判断下一首歌曲
*  @Date: 2019/10/20 09:49
*
*/ 
import store from "@/store"
import { MessageBox } from 'element-ui';
function nextSong(){
    if(store.getters.currentSong){
        if(localStorage.playModle == -1){
            return store.getters.currentSong;
        }else{
            const songList = store.getters.songList;
            const currentSong = store.getters.currentSong;
            var songIndex = 0;
            songList.forEach((item, index) => {
                if(item._id == currentSong._id){
                    songIndex = index;
                }
            })
            if(songIndex == songList.length - 1){
                return songList[0]
            }else{
                return songList[songIndex + 1]
            }
        }
    }else{
        return {_id:0}
    }
}

export default nextSong