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
            path: '/readme',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            children:[
                {
                    path: '/indexPage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)
                },
                {
                    path: '/userManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)
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
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // Vue-Quill-Editor组件
                },
                {
                    path: '/dishesManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)     // Vue-Quill-Editor组件
                },
                {
                    path: '/wharehouseManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)       // Vue-Core-Image-Upload组件
                },
                {
                    path: '/storeManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)   // vue-schart组件
                },
                {
                    path: '/inventoryManage',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/pandian',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // 拖拽列表组件
                },
                {
                    path: '/diaobo',
                    component: resolve => require(['../components/page/IndexInfo.vue'], resolve)    // 拖拽列表组件
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
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
    ]
})
