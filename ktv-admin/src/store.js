import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import adminStore from "@/stores/adminStore"

const state = {

};
const getters = {

};
const mutations = {

};
const actions = {

};

const vueStore = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
      adminStore
    }
})


export default vueStore
