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
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve) // 
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
                    component: resolve => require(['../components/page/inventoryInManage.vue'], resolve) // 
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
                    path: '/pandian',
                    component: resolve => require(['../components/page/Pandian.vue'], resolve) // 
                },
                {
                    path: '/baosun',
                    component: resolve => require(['../components/page/Baosun.vue'], resolve)
                },
                {
                    path: '/diaobo',
                    component: resolve => require(['../components/page/Diaobo.vue'], resolve) // 
                },
                {
                    path: '/diaobopage',
                    component: resolve => require(['../components/page/DiaoboPage.vue'], resolve) // 
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
                    path: '/reportOfStock',
                    component: resolve => require(['../components/page/ReportOfStock.vue'], resolve)
                },
                {
                    path: '/purchaseOrder',
                    component: resolve => require(['../components/page/PurchaseOrder.vue'], resolve)
                }
            ]
        }
    ]
})