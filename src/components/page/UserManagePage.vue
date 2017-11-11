<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px" v-loading="loading">
                <el-form-item label="登录名">
                    <el-input v-model="form.userCode" placeholder="登录名"></el-input>
                </el-form-item>
                <el-form-item label="用户名称">
                    <el-input v-model="form.userName" placeholder="用户名称"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="form.userMobile" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="form.userRole" style="width:150px" placeholder="请选择">
                          <el-option label="管理员" value="1"></el-option>
                          <el-option label="店长" value="2"></el-option>
                          <el-option label="店员" value="3"></el-option>
                          <el-option label="仓管" value="4"></el-option>
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
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import {api} from '../common/bus'
    import MaterialSelection from '../common/MaterialSelection'
    export default {
        data: function(){
            return {
                loading:false,
                form:{
                    userCode:this.$route.query.userCode,
                    userName:'',
                    password:'',
                    userRole:'',
                    status:'',
                    password:'',
                    userMobile:''
                }
            }
        },
        methods: {
            onSubmit() {
                this.$data.loading = true;
                api.saveUser(this.$data.form)
                .then((val)=>{
                    this.$message("提交成功")
                }).fail((resp)=>{
                    this.$message.error(resp.message)
                }).always(()=>{
                    this.$data.loading = false
                })
            },
            onCancel(){
                this.$router.go(-1)
            }
        },
        mounted(){
            api.getUserByCode(this.$data.form.userCode)
            .then((u)=>{
                this.$data.form.userName = u.userName;
                this.$data.form.userRole = u.userRole;
                this.$data.form.userMobile = u.userMobile;
                this.$data.form.status = u.status;
            })
        },
        computed:{
            
        }
    }
</script>
<style scoped>
    .el-input {
        width:50%;
    }
</style>