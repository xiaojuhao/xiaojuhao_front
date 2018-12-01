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
                <!-- 供应商管理 -->
                <el-form-item label="供应商">
                    <el-button type="primary" @click="showAddNewSupplierDialog">绑定供应商</el-button>
                    <br/>
                    <span v-for="item in addedSuppliers" :key="item.supplierCode">
                        {{item.supplierName}}({{item.supplierCode}}) &nbsp&nbsp
                    </span>
                </el-form-item>
                <el-form-item label="门店图像">
                    <el-upload class="avatar-uploader" :action="actionUrl" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.storeImg" :src="form.storeImg" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="onCancel">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog title="供应商信息" v-model="addNewSupplierDialogShow" class="dialog">
            <el-row >
                <el-col>
                    <el-input v-model="supplierNameSearchWord" placeholder="供应商名称"></el-input>
                    <br/><br/>
                    <el-checkbox v-for="item in filteredSupplierList" :key="item.supplierCode" 
                        @change="supplierCheckChange(item)" 
                        v-model="item.checked">
                        {{item.supplierName}}
                    </el-checkbox>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import jquery from 'jquery'
import config from '../common/config.vue'
import { api } from '../common/bus'
import Vue from 'vue'
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
                defaultWarehouse: '',
                storeImg: '',
                supplierCodes:''
            },
            actionUrl: config.server + '/file/upload',
            addNewSupplierDialogShow:false,
            allSuppliers:[],
            supplierNameSearchWord:''
        }
    },
    methods: {
        onSubmit() {
            this.form.supplierCodes = Array.from(this.addedSupplierCodeSet).join(',')
            api.saveStore(this.form)
                .then((value) => {
                    Object.assign(this.form, value)
                    this.$message("保存成功")
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        handleAvatarSuccess(res, file) {
            this.form.storeImg = config.server+'/file/show?image='+res.value.filename;
        },
        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        },
        showAddNewSupplierDialog(){
            this.loadingState = true;
            this.queryAllSuppliers(()=>{
                this.loadingState = false;
                this.addNewSupplierDialogShow = true;
            });
        },
        queryAllSuppliers(cb){
            let dbSupplierSet = new Set();
            if(this.form.supplierCodes){
                this.form.supplierCodes.split(",").forEach(it=>dbSupplierSet.add(it))
            }
            if(this.allSuppliers.length > 0){
                this.allSuppliers.forEach(it=>{
                    if(dbSupplierSet.has(it.supplierCode)){
                        it.checked = true;
                    }else{
                        it.checked = false;
                    }
                })
                cb && cb();
                return;
            }
            api.querySupplierPage({
                pageSize: 2000
            }).then((page) => {
                page.values.forEach((item) => {
                    if(dbSupplierSet.has(item.supplierCode)){
                        Vue.set(item,'checked', true)
                    }else{
                        Vue.set(item,'checked', false)
                    }
                })
                this.allSuppliers = page.values;
                cb && cb()
            })
        },
        supplierCheckChange(item){
            var hasIn = this.addedSupplierCodeSet.has(item.supplierCode)
            //添加
            if(item.checked && hasIn == false){
                this.addedSupplierCodeSet.add(item.supplierCode)
            }
            //删除
            else if(!item.checked && hasIn){
                this.addedSupplierCodeSet.delete(item.supplierCode)
            }
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
                this.form.supplierCodes = v.supplierCodes;
                this.queryAllSuppliers();//查询出所有的供应商
            })
    },
    computed:{
        filteredSupplierList:function(){
            if(this.supplierNameSearchWord){
                return this.allSuppliers.filter((it)=>{
                    return it.supplierName.indexOf(this.supplierNameSearchWord) >= 0
                })
            }else{
                return this.allSuppliers;
            }
        },
        addedSuppliers:function(){
            return this.allSuppliers.filter(it=>{
                return it.checked;
            })
        },
        addedSupplierCodeSet:function(){
            let set = new Set();
            this.allSuppliers.forEach(it=>{
                if(it.checked){
                    set.add(it.supplierCode)
                }
            })
            return set;
        }
    }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 178px;
    height: 178px;
}

.avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar .el-upload {
    width: 178px;
    height: 178px;
}
</style>