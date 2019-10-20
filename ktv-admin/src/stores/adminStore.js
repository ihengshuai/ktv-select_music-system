/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 配置adminstore
*  @Date: 2019/10/16 12:52
*
*/ 

const state = {
    isAdminAuthorization:false,
    adminInfo:[]
};
const getters = {
    isAdminAuthorization:state => state.isAdminAuthorization,
    adminInfo:state => state.adminInfo,
};
const mutations = {
    isAdminAuthorization:(state, authorization) => {
        state.isAdminAuthorization = authorization;
    },
    setAdminInfo:(state, info) => {
        state.adminInfo = info;
    }
};
const actions = {
    isAdminAuthorization:({commit}, authorization) => {
        commit("isAdminAuthorization", authorization);
    },
    setAdminInfo:({commit}, info) => {
        commit("setAdminInfo", info);
    },
    clearAdminAuthorization:({commit}) => {
        localStorage.removeItem("adminToken");
        commit("isAdminAuthorization", false);
    }
};

const adminStore = {
    state,
    getters,
    mutations,
    actions
}

export default adminStore;