<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px">
                <el-form-item label="门店名称">
                    <el-input v-model="form.storeName" placeholder="门店名称"></el-input>
                </el-form-item>
                <el-form-item label="门店编码">
                    <el-input disabled v-model="form.storeCode" placeholder="门店编码"></el-input>
                </el-form-item>
                <el-form-item label="外部系统编码">
                    <el-input v-model="form.outCode" placeholder="外部系统编码"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="form.storeAddr" placeholder="门店地址"></el-input>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-input v-model="form.storeManager" placeholder="负责人"></el-input>
                </el-form-item>
                <el-form-item label="负责人手机">
                    <el-input v-model="form.managerPhone" placeholder="负责人手机"></el-input>
                </el-form-item>
                <el-form-item label="负责人邮箱">
                    <el-input v-model="form.managerEmail" placeholder="负责人邮箱"></el-input>
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
import jquery from 'jquery'
import config from '../common/config.vue'
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            form: {
                id: '',
                storeCode: this.$route.query.storeCode,
                storeName: '',
                storeAddr: '',
                storeManager: '',
                managerPhone: '',
                managerEmail: '',
                defaultWarehouse: ''
            },
            warehouseSelection: []

        }
    },
    methods: {
        onSubmit() {
            api.saveStore(this.form)
                .then((respVal) => {
                    this.$message("新增成功")
                    this.$router.go(-1)
                })
        },
        onCancel() {
            this.$router.go(-1)
        }
    },
    mounted() {
        api.queryStoreByCode(this.form.storeCode)
            .then((v) => {
                this.form.id = v.id;
                this.form.storeCode = v.storeCode;
                this.form.storeName = v.storeName;
                this.form.storeAddr = v.storeAddr;
                this.form.storeManager = v.storeManager;
                this.form.managerPhone = v.managerPhone;
                this.form.managerEmail = v.managerEmail;
                this.form.defaultWarehouse = v.defaultWarehouse;
                this.form.outCode = v.outCode;
            })
        api.getAllWarehouseList()
            .then((val) => {
                this.warehouseSelection = val;
            })
    }
}
</script>