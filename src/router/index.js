import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
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
            children:[
                {
                    path: '/indexPage',
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
                    path: '/roleManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)     // vue-datasource组件
                },
                {
                    path: '/sysConfig',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)
                },
                {
                    path: '/materialManage',
                    component: resolve => require(['../components/page/MaterialManage.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/dishesManage',
                    component: resolve => require(['../components/page/dishesManage.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/wharehouseManage',
                    component: resolve => require(['../components/page/wharehouseManage.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/storeManage',
                    component: resolve => require(['../components/page/storeManage.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/inventoryOut',
                    component: resolve => require(['../components/page/inventoryOutManage.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/inventoryIn',
                    component: resolve => require(['../components/page/inventoryInManage.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/pandian',
                    component: resolve => require(['../components/page/Pandian.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/diaobo',
                    component: resolve => require(['../components/page/Diaobo.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/diaobopage',
                    component: resolve => require(['../components/page/DiaoboPage.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/waitingTask',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/myTask',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // 拖拽列表组件
                }
            ]
        }
    ]
})
