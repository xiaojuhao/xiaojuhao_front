import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    sideBarOppened: false
}

const getters = {
    changeState: (state, v) => {
        console.log("changeState(getters):" + v)
    }
}

const mutations = {
    changeState: (state, v) => {
        console.log("changeState(mutations):" + v)
        console.log(state.sideBarOppened = v)
    },
    toggleSideBarOppened: (state) => {
        if (state.sideBarOppened) {
            state.sideBarOppened = false;
        } else {
            state.sideBarOppened = true;
        }
    }
}

const actions = {
    changeState: (state, v) => {
        console.log("changeState(actions):" + v)
        console.log(state.sideBarOppened = v)
    }
}

const modules = {

}


const store = new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules
});


//export {store}
//export const store = storex
export default store