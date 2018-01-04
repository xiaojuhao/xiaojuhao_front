import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/home',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children: [{
                    path: '/',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)
                },
                {
                    path: '/outStock',
                    component: resolve => require(['../components/page/OutStock.vue'], resolve)
                },
                {
                    path: '/inStock',
                    component: resolve => require(['../components/page/InStock.vue'], resolve)
                },
                {
                    path: '/userManage',
                    component: resolve => require(['../components/page/UserManage.vue'], resolve)
                },
                {
                    path: '/userManagePage',
                    component: resolve => require(['../components/page/UserManagePage.vue'], resolve)
                },
                {
                    path: '/roleManage',
                    component: resolve => require(['../components/page/RoleManage.vue'], resolve) // 
                },
                {
                    path: '/roleEdit',
                    component: resolve => require(['../components/page/RoleEdit.vue'], resolve) // 
                },
                {
                    path: '/sysConfig',
                    component: resolve => require(['../components/page/SysConfig.vue'], resolve)
                },
                {
                    path: '/materialManage',
                    component: resolve => require(['../components/page/MaterialManage.vue'], resolve) // 
                },
                {
                    path: '/materialManagePage',
                    component: resolve => require(['../components/page/MaterialManagePage.vue'], resolve) // 
                },
                {
                    path: '/materialRequireManage',
                    component: resolve => require(['../components/page/MaterialRequireManage.vue'], resolve) // 
                },
                {
                    path: '/materialWarningSet',
                    component: resolve => require(['../components/page/MaterialWarningSet.vue'], resolve) // 
                },
                {
                    path: '/recipesManage',
                    component: resolve => require(['../components/page/RecipesManage.vue'], resolve) //
                },
                {
                    path: '/recipesManagePage',
                    component: resolve => require(['../components/page/RecipesManagePage.vue'], resolve) // 
                },
                {
                    path: '/warehouseManage',
                    component: resolve => require(['../components/page/warehouseManage.vue'], resolve) // 
                },
                {
                    path: '/warehouseManagePage',
                    component: resolve => require(['../components/page/warehouseManagePage.vue'], resolve) //
                },
                {
                    path: '/storeManage',
                    component: resolve => require(['../components/page/storeManage.vue'], resolve) // 
                },
                {
                    path: '/storeManagePage',
                    component: resolve => require(['../components/page/storeManagePage.vue'], resolve) // 
                },
                {
                    path: '/supplierManage',
                    component: resolve => require(['../components/page/SupplierManage.vue'], resolve) // 
                },
                {
                    path: '/supplierManagePage',
                    component: resolve => require(['../components/page/SupplierManagePage.vue'], resolve) // 
                },
                {
                    path: '/inventoryOut',
                    component: resolve => require(['../components/page/inventoryOutManage.vue'], resolve),
                    children: [{
                            path: "/byMaterial",
                            component: resolve => require(['../components/page/inventoryOutByMaterial.vue'], resolve)
                        },
                        {
                            path: "/byRecipes",
                            component: resolve => require(['../components/page/inventoryOutByRecipes.vue'], resolve)
                        }
                    ]
                },
                {
                    path: '/inventoryIn',
                    component: resolve => require(['../components/page/inventoryIn.vue'], resolve) // 
                },
                {
                    path: '/inventoryInConfirm',
                    component: resolve => require(['../components/page/inventoryInConfirm.vue'], resolve) // 
                },
                {
                    path: '/inventoryInIndex',
                    component: resolve => require(['../components/page/inventoryInIndex.vue'], resolve) // 
                },
                {
                    path: '/inventoryInPage',
                    component: resolve => require(['../components/page/inventoryInPage.vue'], resolve) // 
                },
                {
                    path: '/inventoryDetail',
                    component: resolve => require(['../components/page/InventoryDetail.vue'], resolve)
                },
                {
                    path: '/inventoryPaid',
                    component: resolve => require(['../components/page/InventoryPaid.vue'], resolve)
                },
                {
                    path: '/inventoryPaidPage',
                    component: resolve => require(['../components/page/InventoryPaidPage.vue'], resolve)
                },
                {
                    path: '/pandian',
                    component: resolve => require(['../components/page/Pandian.vue'], resolve) // 
                },
                {
                    path: '/pandianPage',
                    component: resolve => require(['../components/page/PandianPage.vue'], resolve) // 
                },
                {
                    path: '/pandianNewPage',
                    component: resolve => require(['../components/page/PandianNewPage.vue'], resolve) // 
                },
                {
                    path: '/baosun',
                    component: resolve => require(['../components/page/Baosun.vue'], resolve)
                },
                {
                    path: '/baosunPage',
                    component: resolve => require(['../components/page/BaosunPage.vue'], resolve)
                },
                {
                    path: '/baosunDetail',
                    component: resolve => require(['../components/page/BaosunDetail.vue'], resolve)
                },
                {
                    path: '/diaobo',
                    component: resolve => require(['../components/page/Diaobo.vue'], resolve) // 
                },
                {
                    path: '/diaoboPage',
                    component: resolve => require(['../components/page/DiaoboPage.vue'], resolve) // 
                },
                {
                    path: '/diaoboHandle',
                    component: resolve => require(['../components/page/DiaoboHandle.vue'], resolve) // 
                },
                {
                    path: '/diaoboHandlePage',
                    component: resolve => require(['../components/page/DiaoboHandlePage.vue'], resolve) // 
                },
                {
                    path: '/waitingTask',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve) // 
                },
                {
                    path: '/myTask',
                    component: resolve => require(['../components/page/MyTask.vue'], resolve) // 
                },
                {
                    path: '/myPurchaseOrder',
                    component: resolve => require(['../components/page/MyPurchaseOrder.vue'], resolve) // 
                },
                {
                    path: '/myLossApply',
                    component: resolve => require(['../components/page/MyLossApply.vue'], resolve) // 
                },
                {
                    path: '/myAllocate',
                    component: resolve => require(['../components/page/MyAllocate.vue'], resolve) // 
                },
                {
                    path: '/reportOfStock',
                    component: resolve => require(['../components/page/ReportOfStock.vue'], resolve)
                },
                {
                    path: '/purchaseOrder',
                    component: resolve => require(['../components/page/PurchaseOrder.vue'], resolve)
                },
                {
                    path: '/purchaseOrderPage',
                    component: resolve => require(['../components/page/PurchaseOrderPage.vue'], resolve)
                },
                {
                    path: '/stockHistory',
                    component: resolve => require(['../components/page/StockHistory.vue'], resolve)
                },
                {
                    path: '/orderManage',
                    component: resolve => require(['../components/page/OrderManage.vue'], resolve)
                },
                {
                    path: '/stockDailyCharts',
                    component: resolve => require(['../components/page/StockDailyCharts.vue'], resolve)
                },
                {
                    path: '/recipesDailyChart',
                    component: resolve => require(['../components/page/RecipesDailyChart.vue'], resolve)
                },
                {
                    path: '/paymentPay',
                    component: resolve => require(['../components/page/PaymentPay.vue'], resolve)
                },
                {
                    path: '/paymentInput',
                    component: resolve => require(['../components/page/PaymentInput.vue'], resolve)
                },
                {
                    path: '/paymentInputDetail',
                    component: resolve => require(['../components/page/PaymentInputDetail.vue'], resolve)
                },
                {
                    path: '/paymentApprove',
                    component: resolve => require(['../components/page/PaymentApprove.vue'], resolve)
                },
                {
                    path: '/paymentReport',
                    component: resolve => require(['../components/page/PaymentReport.vue'], resolve)
                }
            ]
        }
    ]
})