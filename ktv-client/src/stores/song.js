import { stat } from "fs";

/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 储存歌曲信息
*  @Date: 2019/10/20 08:46
*
*/ 
const state = {
    songList: localStorage.songList ? JSON.parse(localStorage.getItem("songList")) : [],
    currentSong : localStorage.currentSong ? JSON.parse(localStorage.getItem("currentSong"))[0] : '',
    playModle : localStorage.playModle ? localStorage.getItem("playModle") : -1,
    volume:0,
};
const getters = {
    songList:state => state.songList,
    songListLen:state => state.songList.length,
    currentSong:state => state.currentSong,
    playModle:state => state.playModle,
    volume:state => state.volume
};
const mutations = {
    setSongList(state, songInfo){
        state.songList.push(songInfo);
    },
    setAllSong(state, songlist){
        state.songList = songlist;
    },
    setCurrentSong(state, songinfo){
        state.currentSong = songinfo;
    },
    setPlayModle(state, modle){
        state.playModle = modle;
        localStorage.setItem("playModle", modle)
    },
    setVolume(state, v){
        if(v > 0){
            if(state.volume < 0.95){
                state.volume += v;
            }
        }else{
            if(state.volume > 0.05){
                state.volume -= v;
            }
        }
    }
};
const actions = {
    setSongList:({commit}, songInfo) => {
        commit("setSongList", songInfo);
    },
    setAllSong:({commit}, songlist) => {
        commit("setAllSong", songlist);
    },
    setCurrentSong:({commit}, songinfo) => {
        commit("setCurrentSong", songinfo);
    },
    setPlayModle({commit}, modle){
        commit("setPlayModle", modle);
    },
    setVolume({commit}, v){
        commit("setVolume", v);
    }
}

const musicStore = {
    state,
    getters,
    mutations,
    actions
}

export default musicStore