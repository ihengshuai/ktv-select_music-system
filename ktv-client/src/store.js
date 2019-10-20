import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// import userStore from "@/stores/userStore"
import musicStore from "@/stores/song"


const state = {
    isAuthorizated:false,
    user:{},
};
const getters = {
    isAuthorizated:state => state.isAuthorizated,
    user:state => state.user,
};
const mutations = {
    setAuthorizated(state, authorization){
        state.isAuthorizated = authorization;
    },
    setUser(state, user){
        state.user = user;
    },
};
const actions = {
    setAuthorizated:({commit}, authorization) => {
        commit("setAuthorizated", authorization);
    },
    setUser:({commit}, user) => {
        commit("setUser", user);
    },
    clearState:({commit}) => {
        commit("setAuthorizated", false);
        commit("setUser", null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("currentSong");
        localStorage.removeItem("playModle");
        localStorage.removeItem("songList");
    }
};

const vueStore = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        musicStore
    }
})

export default vueStore
