import Vue from 'vue'
import Vuex from 'vuex'
import {api} from 'components/common/bus'
Vue.use(Vuex)

const state = {
    sideBarOppened: false,
    allMaterials:[],
    allStores:[],
    allRecipes:[],
    allWarehouses:[],
    allSuppliers:[],
    loginCookie:'',
    userRole:''
}

const getters = {
    allMaterialsMap: (state) => {
        var map = new Map();
        state.allMaterials.forEach((item)=>{
            map.set(item.materialCode,item)
        })
        return map;
    },
    allStoresMap:(state)=>{
        var map = new Map();
        state.allStores.forEach((item)=>{
            map.set(item.storeCode,item)
        })
        return map;
    },
    allRecipesMap: (state)=>{
        var map = new Map();
        state.allRecipes.forEach((item)=>{
            map.set(item.recipesCode,item)
        })
        return map;
    },
    allWarehousesMap: (state)=>{
        var map = new Map();
        state.allWarehouses.forEach((item)=>{
            map.set(item.warehouseCode,item)
        })
        return map;
    },
    allSuppliersMap: (state)=>{
        var map = new Map();
        state.allSuppliers.forEach((item)=>{
            map.set(item.suppliersCode,item)
        })
        return map;
    }
}

const mutations = {
    loadAllMaterials(state){
        api.queryAllMaterials()
        .then((page)=>{
            state.allMaterials = page.values;
        })
    },
    loadAllStores(state){
        api.getAllStoreList()
        .then((list)=>{
            state.allStores = list;
        })
    },
    loadAllRecipes(state){
        api.queryAllRecipes()
        .then((page)=>{
            state.allRecipes = page.values;
        })
    },
    loadAllWarehouses(state){
        api.getAllWarehouseList()
        .then((list)=>{
            state.allWarehouses = list;
        })
    },
    loadAllSuppliers(state){
        api.querySupplierPage({
            pageSize:1000
        }).then((page)=>{
            state.allSuppliers = page.values;
        })
    },
    ensureLoadAll(state){
        if(!state.allMaterials || state.allMaterials.length ==0){
            api.queryAllMaterials()
            .then((page)=>{
                state.allMaterials = page.values;
            })
        }
        if(!state.allStores || state.allStores.length ==0){
            api.getAllStoreList()
            .then((list)=>{
                state.allStores = list;
            })
        }
        if(!state.allRecipes || state.allRecipes.length ==0){
            api.queryAllRecipes()
            .then((page)=>{
                state.allRecipes = page.values;
            })
        }
        if(!state.allWarehouses || state.allWarehouses.length ==0){
            api.getAllWarehouseList()
            .then((page)=>{
                state.allWarehouses = page.values;
            })
        }
        if(!state.allSuppliers || state.allSuppliers.length ==0){
            api.querySupplierPage({
                pageSize:1000
            }).then((page)=>{
                state.allSuppliers = page.values;
            })
        }
    },
    setLoginCookie(state,cookieValue){
        state.loginCookie = cookieValue;
    },
    setUserRole(state,role){
        state.userRole = role;
    }
}

const actions = {
    loadAllData({commit}){
        setTimeout(()=>{commit('loadAllMaterials')},0)
        setTimeout(()=>{commit('loadAllStores')},0)
        setTimeout(()=>{commit('loadAllRecipes')},0)
        setTimeout(()=>{commit('loadAllWarehouses')},0)
        setTimeout(()=>{commit('loadAllSuppliers')},0)
    },
    ensureDataLoad({commit}){
        setTimeout(()=>commit('ensureLoadAll'),0)
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