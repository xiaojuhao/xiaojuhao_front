<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>门店管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="门店名称">
                    <el-input v-model="form.storeName" placeholder="门店名称"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="form.storeAddr" placeholder="门店地址"></el-input>
                </el-form-item>
                <el-form-item label="默认仓库">
                    <el-input v-model="form.defaultWarehouse" placeholder="默认仓库"></el-input>
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
                    <el-button type="primary" @click="onSubmit">新增</el-button>
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
                    sid:this.$route.query.sid,
                    storeCode:this.$route.query.storeCode,
                    storeName:'',
                    storeAddr:'',
                    storeManager:'',
                    managerPhone:'',
                    managerEmail:''
                }
                
            }
        },
        methods: {
            onSubmit() {
                var $data = this.$data;
                //this.$message.success('提交成功！');
                jquery.ajax({
                    url:config.server+"/store/addStore",
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
                url:config.server+"/store/getStoreByCode",
                data:{storeCode:this.$data.form.storeCode},
                dataType:'jsonp'
            }).then((resp)=>{
                if(resp && resp.value){
                    var v = resp.value;
                    this.$data.form.storeCode = v.storeCode;
                    this.$data.form.storeName = v.storeName;
                    this.$data.form.storeAddr = v.storeAddr;
                    this.$data.form.storeManager = v.storeManager;
                    this.$data.form.managerPhone = v.managerPhone;
                    this.$data.form.managerEmail = v.managerEmail;
                }
            })
        }
    }
</script>