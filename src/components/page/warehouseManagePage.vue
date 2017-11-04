<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="门店名称">
                    <el-input v-model="form.warehouseName" placeholder="仓库名称"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="form.warehouseAddr" placeholder="仓库地址"></el-input>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-input v-model="form.warehouseManager" placeholder="负责人"></el-input>
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
    export default {
        data: function(){
            return {
                form:{
                    id:'',
                    warehouseCode:this.$route.query.warehouseCode,
                    warehouseName:'',
                    warehouseAddr:'',
                    warehouseManager:'',
                    managerPhone:'',
                    managerEmail:''
                }
                
            }
        },
        methods: {
            onSubmit() {
                var $data = this.$data;
                jquery.ajax({
                    url:config.server+"/warehouse/saveWarehouse",
                    data:this.$data.form,
                    dataType:'jsonp'
                }).then((resp)=>{
                    this.$message("新增成功")
                    this.$router.go(-1)
                })
            },
            onCancel(){
                this.$router.go(-1)
            }
        },
        mounted(){
            jquery.ajax({
                url:config.server+"/warehouse/queryWarehouseByCode",
                data:{warehouseCode:this.$data.form.warehouseCode},
                dataType:'jsonp'
            }).then((resp)=>{
                if(resp && resp.value){
                    var v = resp.value;
                    this.$data.form.id = v.id;
                    this.$data.form.warehouseCode = v.warehouseCode;
                    this.$data.form.warehouseName = v.warehouseName;
                    this.$data.form.warehouseAddr = v.warehouseAddr;
                    this.$data.form.warehouseManager = v.warehouseManager;
                    this.$data.form.managerPhone = v.managerPhone;
                    this.$data.form.managerEmail = v.managerEmail;
                }
            })
        }
    }
</script>