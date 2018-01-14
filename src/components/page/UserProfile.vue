<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>个人信息管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px" v-loading="loading">
                <el-form-item label="登录名">
                    {{form.userCode}}
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.userMobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="确认登录密码">
                    <el-input type="password" v-model="form.passwordConfirm"></el-input>
                </el-form-item>
                <el-form-item v-if="form.isSu=='0'" label="授权门店">
                    <el-checkbox-group v-model="auth_stores">
                        <el-checkbox disabled v-for="item in myAllStores" :key="item.storeCode" :label="item.storeCode" :checked="item.checked">{{item.storeName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.isSu=='0'" label="授权仓库">
                    <el-checkbox-group v-model="auth_warehouse">
                        <el-checkbox disabled v-for="item in myAllWarehouse" :key="item.warehouseCode" :label="item.warehouseCode" :checked="item.checked">{{item.warehouseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">修改</el-button>
                    <el-button @click="onCancel">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            loading: false,
            form: {
                userCode: '',
                userName: '',
                password: '      ',
                passwordConfirm: '      ',
                userRoleStr: '',
                status: '',
                userMobile: '',
                isSu: '0'
            },
            userRole: [],
            auth_stores: [],
            auth_warehouse: [],
            myAllStoresX: [],
            myAllWarehouseX: [],
            allRoles: []
        }
    },
    methods: {
        onSubmit() {
            if (this.form.password != this.form.passwordConfirm) {
                this.$message.error("登录密码和确认密码不一致,请重新输入");
                return;
            }
            this.$data.loading = true;
            api.modifyMyProfile(this.$data.form)
                .then((val) => {
                    this.$message("修改成功")
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.$data.loading = false
                })
        },
        onCancel() {
            this.$router.go(-1)
        }
    },
    mounted() {
        api.loginInfo()
            .then((u) => {
                this.form.userCode = u.userCode;
                this.form.userName = u.userName;
                this.form.userMobile = u.userMobile;
                this.form.status = u.status;
                this.form.isSu = u.isSu || '0';
                if (u.authStores) {
                    this.auth_stores = u.authStores.split(',')
                }
                if (u.authWarehouse) {
                    this.auth_warehouse = u.authWarehouse.split(',')
                }
            });
        api.queryMyStores()
            .then((list) => {
                this.myAllStoresX = list;
            })
        api.queryMyWarehouse()
            .then((list) => {
                this.myAllWarehouseX = list;
            })
        api.queryRolesPage({ pageSize: 1000 })
            .then((page) => {
                this.allRoles = page.values;
            })
        api.getUserRoles(this.$route.query.userCode)
            .then((list) => {
                list.forEach((item) => {
                    this.userRole.push(item.roleCode)
                })
            })
    },
    computed: {
        myAllStores() {
            return this.myAllStoresX.filter((item) => {
                return true;
            })
        },
        myAllWarehouse() {
            return this.myAllWarehouseX.filter((item) => {
                return true;
            })
        },
        allStoreMap() {
            let map = new Map()
            this.myAllStores.forEach((item) => {
                map.set(item.storeCode, item);
            })
            return map;
        },
        myAllWarehouseMap() {
            let map = new Map()
            this.myAllWarehouse.forEach((item) => {
                map.set(item.warehouseCode, item)
            })
            return map;
        }
    }
}
</script>
<style scoped>
.el-input {
    width: 80%;
}
</style>