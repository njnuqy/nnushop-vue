import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const init = {
    token: localStorage.getItem('token') || null,
    user: localStorage.getItem('user') || null
};
const store = new Vuex.Store({
    state:{
        init
    },
    mutations:{
        SET_TOKEN(state,value){
            state.token = value;
        },
        SET_USER(state,user){
            state.user = user;
        }
    }
})

export default store;