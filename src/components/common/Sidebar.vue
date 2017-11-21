<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-demo" theme="dark" unique-opened router>
            <template v-for="item in menus">
                <template v-if="item.type=='nav'">
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
import { api } from './bus'
export default {
    data() {
        return {
            menus: []
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    mounted() {
        api.getMenu()
            .then((list) => {
                this.menus = list;
            })
    }
}
</script>
<style scoped>
.sidebar {
    display: block;
    position: absolute;
    width: 180px;
    left: 0;
    top: 70px;
    bottom: 0;
    background: #2E363F;
}

.sidebar>ul {
    height: 100%;
}
</style>