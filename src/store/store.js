
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        sideBarOppened: false
    },
    getters: {
        changeState: state => {
            console.log("changeState(getters):" + state)
        }
    },
    mutations: {
        changeState: state => {
            console.log("changeState(mutations):" + state)
        }
    },
    actions: {
        increment({ commit }, payload) {
            commit('突变方法名' + payload)
        }
    },
    modules: {

    }
});
