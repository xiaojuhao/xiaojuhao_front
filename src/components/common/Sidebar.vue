<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="light" unique-opened router>
            <template v-for="item in menus">
                <template v-if="item.subs">
                    <el-submenu :index="item.menuIndex">
                        <template slot="title"><i :class="item.menuIcon"></i>{{ item.menuName }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.menuIndex">{{ subItem.menuName }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.menuIndex">
                        <i :class="item.menuIcon"></i>{{ item.menuName }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import {api} from './bus'
    export default {
        data() {
            return {
                menus:[],
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
                            },
                            {
                                index: "supplierManage",
                                title: "供应商管理"
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
                                index: 'inventoryInIndex',
                                title: '入库管理'
                            },
                            {
                                index: 'pandian',
                                title: '库存盘点'
                            },
                            {
                                index: 'baosun',
                                title: '原料报损'
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
        },
        mounted(){
            api.getMenu()
            .then((list)=>{
                this.menus = list;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 200px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #2E363F;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
