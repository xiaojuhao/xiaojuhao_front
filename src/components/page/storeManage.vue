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
                    <el-input v-model="storeName" placeholder="门店名称"></el-input>
                </el-form-item>
                <el-form-item label="门店地址">
                    <el-input v-model="storeAddr" placeholder="门店地址"></el-input>
                </el-form-item>
                <el-form-item label="负责人">
                    <el-input v-model="storeManager" placeholder="负责人"></el-input>
                </el-form-item>
                <el-form-item label="负责人手机">
                    <el-input v-model="managerPhone" placeholder="负责人手机"></el-input>
                </el-form-item>
                <el-form-item label="负责人邮箱">
                    <el-input v-model="managerEmail" placeholder="负责人邮箱"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">新增</el-button>
                    <el-button>取消</el-button>
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
                storeName:'',
                storeAddr:'',
                storeManager:'',
                managerPhone:'',
                managerEmail:''
            }
        },
        methods: {
            onSubmit() {
                var $data = this.$data;
                //this.$message.success('提交成功！');
                jquery.ajax({
                    url:config.server+"/store/addStore",
                    data:$data,
                    dataType:'jsonp'
                }).then((resp)=>{
                    console.log(resp)
                })
            }
        }
    }
</script>