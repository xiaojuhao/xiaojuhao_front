import jquery from 'jquery'
import store from '../../store/store'
import router from "../../router/index"
import { Message } from 'element-ui';

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
export const util = {
    formatDate(ms) {
        let date = new Date(ms);
        return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
}
const http = {
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
};

export { config };

export { http };

export const api = {
    getMenu() {
        return http.post("/menu", {});
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
        return http.post("/user/saveUser", data);
    },
    resetPassword(userCode) {
        return http.post("/user/resetPassword", { userCode: userCode })
    },
    getUserByCode(userCode) {
        return http.post("/user/queryUserByCode", { userCode: userCode })
    },
    queryUsersPage(data) {
        return http.post("/user/queryUsers", data)
    },
    getAllStoreList() {
        var df = jquery.Deferred();
        http.post('/store/getAllStore')
            .then((page) => {
                df.resolve(page.values);
            }).fail((resp) => df.reject(resp))
        return df.promise();
    },
    queryStoreByCode(code) {
        return http.post("/store/getStoreByCode", { storeCode: code })
    },
    queryMyStores() {
        return http.post("/store/getMyStore", {})
    },
    saveStore(data) {
        return http.post("/store/saveStore", data)
    },
    outstock(data) {
        var df = jquery.Deferred();
        http.post('/busi/outstock', data)
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
        http.post('/busi/instock', data)
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
    addRecipes(data) {
        return http.post("/recipes/addRecipes", data);
    },
    queryRecipesPage(data) {
        return http.post("/recipes/queryRecipes", data)
    },
    queryAllRecipes() {
        return http.post("/recipes/queryAllRecipes", { pageSize: 1000 })
    },
    queryRecipesByCode(code) {
        return http.post("/recipes/queryRecipesByCode", { recipesCode: code })
    },
    queryMaterialsStockPage(data) {
        return http.post("/busi/queryMaterialsStock", data);
    },
    correctStock(data) {
        return http.post("/inventoryApply/correctStock", data)
    },
    queryMaterialsStockHistoryPage(data) {
        return http.post("/busi/queryMaterialsStockHistory", data);
    },
    queryMaterialsStockById(id) {
        return http.post("/busi/queryMaterialsStockById", { id: id });
    },
    queryAllMaterials() {
        let data = {
            pageNo: 1,
            pageSize: 2000
        }
        return http.post("/busi/queryMaterials", data);
    },
    queryMaterialsPage(data) {
        return http.post("/busi/queryMaterials", data);
    },
    queryMaterialById(id) {
        return http.post("/busi/queryMaterialById", { id: id })
    },
    addMaterials(data) {
        return http.post("/busi/addMaterials", data)
    },
    queryMaterialSplitByMaterialCode(materialCode) {
        return http.post("/busi/queryMaterialSplitByMaterialCode", { materialCode: materialCode })
    },
    queryRecipesFormula(recipesCode) {
        let data = { recipesCode: recipesCode }
        return http.post("/recipes/queryRecipesFormula", data)
    },
    getAllWarehouseList() {
        let df = new jquery.Deferred();
        http.post("/warehouse/queryWarehouses", { pageSize: 1000 })
            .then((page) => {
                df.resolve(page.values)
            }).fail((resp) => {
                df.reject(resp)
            })
        return df;
    },
    queryWarehousesPage(param) {
        return http.post("/warehouse/queryWarehouses", param)
    },
    getWarehouseByCode(code) {
        return http.post("/warehouse/queryWarehouseByCode", { warehouseCode: code })
    },
    queryMyWarehouse() {
        return http.post("/warehouse/queryMyWarehouse", {});
    },
    saveWarehouse(data) {
        return http.post("/warehouse/saveWarehouse", data)
    },
    saveSupplierInfo(param) {
        return http.post("/supplier/saveSupplier", param)
    },
    querySupplierPage(param) {
        return http.post("/supplier/querySupplierPage", param)
    },
    querySupplierByCode(code) {
        return http.post("/supplier/querySupplierByCode", { supplierCode: code })
    },
    queryMaterialSupplerByCode(param) {
        return http.post("/busi/queryMaterialSupplerByCode", param)
    },
    queryAllMaterialSuppler() {
        return http.post("/busi/queryAllMaterialSuppler", {})
    },
    commitPurchaseOrder(data) {
        return http.post("/inventoryApply/commitPurchaseOrder", data)
    },
    queryInventoryApplyPage(data) {
        return http.post("/inventoryApply/queryInventoryApply", data)
    },
    queryMyPurchaseOrderPage(data) {
        return http.post("/inventoryApply/queryMyPurchaseOrder", data)
    },
    queryMyLossApply(data) {
        return http.post("/inventoryApply/queryMyLossApply", data)
    },
    queryMyLossApplyDetail(data) {
        return http.post("/inventoryApply/queryMyLossApplyDetail", data)
    },
    queryMyAllocate(data) {
        return http.post("/inventoryApply/queryMyAllocate", data)
    },
    queryInventoryApplyByApplyNum(orderNum) {
        return http.post("/inventoryApply/queryPurchaseOrderDetail", { applyNum: orderNum })
    },
    confirmInventory(data) {
        return http.post("/inventoryApply/confirmInventory", data)
    },
    commitDiaobo(data) {
        return http.post("/diaobo/commit", data)
    },
    confirmDiaobo(data) {
        return http.post("/diaobo/confirm", data)
    },
    getCabinByCode(code) {
        return http.post("/busi/getCabinByCode", { cabinCode: code })
    },
    claimLoss(data) {
        return http.post("/inventoryApply/claimLoss", data)
    },
    startCorrect(cabinCode) {
        return http.post("/inventoryApply/startCorrect", {cabinCode:cabinCode})
    },
    finishCorrect(cabinCode){
        return http.post("/inventoryApply/finishCorrect",{cabinCode:cabinCode})
    },
    getNoticePage(data){
        return http.post("/notice/latest",data)
    }
}