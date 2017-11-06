<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-menu',
                        index: 'indexPage',
                        title: '首页'
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '2',
                        title: '系统管理',
                        subs: [
                            {
                                index: 'userManage',
                                title: '用户管理'
                            },
                            {
                                index: 'roleManage',
                                title: '角色管理'
                            },
                            {
                                index: 'sysConfig',
                                title: '系统设置'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '3',
                        title: '基础信息管理',
                        subs: [
                            {
                                index: 'materialManage',
                                title: '原料管理'
                            },
                            {
                                index: 'recipesManage',
                                title: '菜品管理'
                            },
                            {
                                index: 'warehouseManage',
                                title: '仓库管理'
                            },
                            {
                                index: 'storeManage',
                                title: '门店管理'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '4',
                        title: '进销存管理',
                        subs: [
                            {
                                index: 'inventoryOut',
                                title: '出库管理'
                            },
                            {
                                index: 'inventoryIn',
                                title: '入库管理'
                            },
                            {
                                index: 'pandian',
                                title: '库存盘点'
                            },
                            {
                                index: 'diaobo',
                                title: '库存调拨'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '5',
                        title: '报表',
                        subs: [
                            {
                                index: 'reportOfStock',
                                title: '库存报表'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '6',
                        title: '任务管理',
                        subs: [
                            {
                                index: 'waitingTask',
                                title: '待处理任务'
                            },
                            {
                                index: 'myTask',
                                title: '我的申请'
                            }
                        ]
                    }
                ]
            }
        },
        created: function(){
            
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
