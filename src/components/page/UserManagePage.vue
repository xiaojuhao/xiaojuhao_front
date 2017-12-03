<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px" v-loading="loading">
                <el-form-item label="登录名">
                    <el-input v-model="form.userCode" placeholder="登录名"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.userMobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="超级管理员">
                    <el-select v-model="form.isSu" style="width:150px" placeholder="请选择">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                    <span v-show="form.isSu=='1'">
                        <font color=red>注：超级管理员拥有所有权限，请谨慎设置！！</font>
                    </span>
                </el-form-item>
                <el-form-item label="角色" v-if="form.isSu=='0'">
                    <el-select v-model="userRole" style="width:80%" :multiple="true" placeholder="请选择">
                        <el-option v-for="item in allRoles" :key="item.roleCode" :label="item.roleName" :value="item.roleCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="登录密码">
                    <el-input type="password" v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" style="width:150px" placeholder="请选择">
                        <el-option label="有效" value="1"></el-option>
                        <el-option label="无效" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.isSu=='0'" label="授权门店">
                    <el-checkbox-group v-model="auth_stores">
                        <el-checkbox v-for="item in myAllStores" :key="item.storeCode" :label="item.storeCode" :checked="item.checked">{{item.storeName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item v-if="form.isSu=='0'" label="授权仓库">
                    <el-checkbox-group v-model="auth_warehouse">
                        <el-checkbox v-for="item in myAllWarehouse" :key="item.warehouseCode" :label="item.warehouseCode" :checked="item.checked">{{item.warehouseName}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">取消</el-button>
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
                userCode: this.$route.query.userCode,
                userName: '',
                password: '',
                userRoleStr: '',
                status: '',
                password: '',
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
            this.$data.loading = true;
            this.form.authStores = this.auth_stores.filter((item) => {
                if (this.allStoreMap.get(item)) return true;
                return false;
            }).join(',')
            this.form.authWarehouse = this.auth_warehouse.filter((item) => {
                if (this.myAllWarehouseMap.get(item)) return true;
                return false;
            }).join(',')
            this.form.userRoleStr = this.userRole.join(',')
            api.saveUser(this.$data.form)
                .then((val) => {
                    this.$message("提交成功")
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
        api.getUserByCode(this.form.userCode)
            .then((u) => {
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
                list.forEach((item)=>{
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