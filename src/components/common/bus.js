import jquery from 'jquery'
import store from '../../store/store'
import router from "../../router/index"
import {Message} from 'element-ui';

const config = {
    //server:'http://47.104.25.105:80/xiaojuhao/'
    //server:'http://localhost:8080/'
    server: function() {
        if (window.location.href.indexOf("localhost") > 0) {
            return "http://localhost:8080/"
        }
        return process.env.REMOTE_SERVER
    }()
}
const http = {
    jsonp(uri, data) {
        if (data) {
            data.requestLoginCookie = store.state.loginCookie;
        }
        var df = jquery.Deferred();
        jquery.ajax({
                url: config.server + uri,
                data: data,
                method: 'POST',
                crossDomain: true,
                dataType: 'json'
            })
            .then((resp) => df.resolve(resp))
            .fail((resp) => {
                df.reject(resp)
            })
        return df.promise();

    },
    jsonp2(uri, data) {
        if (data) {
            data.requestLoginCookie = store.state.loginCookie;
        }
        var df = jquery.Deferred();
        jquery.ajax({
                url: config.server + uri,
                data: data,
                method: 'POST',
                dataType: 'json',
                crossDomain: true
            })
            .then((resp) => {
                if (resp.code == "R401") {
                    router.push("/login")
                    return;
                }
                if (resp.code == "200") {
                    df.resolve(resp.value)
                } else {
                    df.reject(resp);
                }
            }).fail((resp) => {

            });

        return df.promise();
    },
    post(uri, data) {
        if (data) {
            data.requestLoginCookie = store.state.loginCookie;
        }
        var df = jquery.Deferred();
        jquery.ajax({
                url: config.server + uri,
                data: data,
                method: 'POST',
                crossDomain: true,
                dataType: 'json'
            })
            .then((resp) => {
                if (resp.code == "R401") {
                    router.push("/login")
                    return;
                }
                if (resp.code == "200") {
                    df.resolve(resp.value)
                } else {
                    df.reject(resp);
                }
            }).fail((resp) => {

            });
        return df.promise();
    }
}

export { config };

export { http };

export const api = {
    getMenu() {
        return http.jsonp2("/menu", {});
    },
    signin(data) {
        var df = jquery.Deferred();
        try {
            jquery.ajax({
                url: config.server + '/user/login',
                data: data,
                crossDomain: true,
                method: 'POST',
                dataType: 'json'
            }).then((resp) => {
                df.resolve(resp)
            });
        } catch (e) {
            df.reject({
                code: 400,
                message: '网络异常'
            });
        }

        return df.promise();
    },
    saveUser(data) {
        return http.jsonp2("/user/saveUser", data);
    },
    resetPassword(userCode) {
        return http.jsonp2("/user/resetPassword", { userCode: userCode })
    },
    getUserByCode(userCode) {
        return http.jsonp2("/user/queryUserByCode", { userCode: userCode })
    },
    queryUsersPage(data) {
        return http.jsonp("/user/queryUsers", data)
    },
    getAllStoreList() {
        var df = jquery.Deferred();
        http.jsonp('/store/getAllStore', { pageSize: 1000 })
            .then((resp) => {
                if (resp.code == "200") {
                    var values = resp.value && resp.value.values;
                    df.resolve(values);
                } else {
                    df.reject(resp)
                }
            }).fail((resp) => df.reject(resp))
        return df.promise();
    },
    queryStoreByCode(code) {
        return http.jsonp2("/store/getStoreByCode", { storeCode: code })
    },
    queryMyStores() {
        return http.jsonp2("/store/getMyStore", {})
    },
    outstock(data) {
        var df = jquery.Deferred();
        http.jsonp('/busi/outstock', data)
            .then((resp) => {
                if (resp.code == "200") {
                    df.resolve(resp.value);
                } else {
                    df.reject(resp)
                }
            }).fail((resp) => {
                df.reject(resp)
            })
        return df.promise();
    },
    instock(data) {
        var df = jquery.Deferred();
        http.jsonp('/busi/instock', data)
            .then((resp) => {
                if (resp.code == "200") {
                    df.resolve(resp.value);
                } else {
                    df.reject(resp)
                }
            }).fail((resp) => {
                df.reject(resp)
            })
        return df.promise();
    },
    diaobo(data) {
        return http.post("/busi/diaobo", data);
    },
    addRecipes(data) {
        var df = jquery.Deferred();
        jquery.ajax({
            url: config.server + "/recipes/addRecipes",
            data: data,
            dataType: 'jsonp'
        }).then((resp) => {
            if (resp.code == "200") {
                df.resolve(resp.value);
            } else {
                df.reject(resp);
            }
        }).fail((resp) => {
            df.reject(resp);
        });
        return df.promise();
    },
    queryRecipesPage(data) {
        return http.jsonp2("/recipes/queryRecipes", data)
    },
    queryAllRecipes() {
        return http.jsonp2("/recipes/queryAllRecipes", { pageSize: 1000 })
    },
    queryRecipesByCode(code) {
        return http.jsonp2("/recipes/queryRecipesByCode", { recipesCode: code })
    },
    queryMaterialsStockPage(data) {
        return http.jsonp2("/busi/queryMaterialsStock", data);
    },
    queryAllFenkuMaterialsStock(materialCode) {
        let data = {
            materialCode: materialCode,
            pageSize: 1000,
            stockType: '2'
        }
        var df = jquery.Deferred();
        http.jsonp2("/busi/queryMaterialsStock", data)
            .then((page) => {
                df.resolve(page.values);
            }).fail((resp) => {
                df.reject(resp);
            });

        return df.promise();
    },
    queryMaterialsStockHistory(data) {
        return http.jsonp2("/busi/queryMaterialsStockHistory", data);
    },
    queryMaterialsStockById(id) {
        return http.jsonp2("/busi/queryMaterialsStockById", { id: id });
    },
    queryAllMaterials() {
        let data = {
            pageNo: 1,
            pageSize: 2000
        }
        return http.jsonp2("/busi/queryMaterials", data);
    },
    addMaterials(data) {
        return http.post("/busi/addMaterials", data)
    },
    queryMaterialSplitByMaterialCode(materialCode) {
        return http.post("/busi/queryMaterialSplitByMaterialCode", { materialCode: materialCode })
    },
    queryRecipesFormula(recipesCode) {
        let data = { recipesCode: recipesCode }
        return http.jsonp2("/recipes/queryRecipesFormula", data)
    },
    getAllWarehouse() {
        return http.jsonp2("/warehouse/queryWarehouses", { pageSize: 1000 })
    },
    queryWarehousesPage(param) {
        return http.jsonp("/warehouse/queryWarehouses", param)
    },
    getWarehouseByCode(code) {
        return http.jsonp2("/warehouse/queryWarehouseByCode", { warehouseCode: code })
    },
    queryMyWarehouse() {
        return http.jsonp2("/warehouse/queryMyWarehouse", {});
    },
    saveSupplierInfo(param) {
        return http.jsonp2("/supplier/saveSupplier", param)
    },
    querySupplierPage(param) {
        return http.jsonp2("/supplier/querySupplierPage", param)
    },
    querySupplierByCode(code) {
        return http.jsonp2("/supplier/querySupplierByCode", { supplierCode: code })
    },
    queryMaterialSupplerByCode(param) {
        return http.jsonp2("/busi/queryMaterialSupplerByCode", param)
    },
    queryAllMaterialSuppler() {
        return http.jsonp2("/busi/queryAllMaterialSuppler", {})
    }
}