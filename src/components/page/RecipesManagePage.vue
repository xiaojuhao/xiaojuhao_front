<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>菜品管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="菜品名称">
                    <el-input v-model="form.recipesName" placeholder="菜品名称"></el-input>
                </el-form-item>
                <el-form-item label="菜品代码">
                    <el-input disabled v-model="form.recipesCode" placeholder="菜品代码"></el-input>
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
    import * as bus from '../common/bus'
    export default {
        data: function(){
            return {
                form:{
                    id:'',
                    recipesCode:this.$route.query.code,
                    recipesName:''
                }
                
            }
        },
        methods: {
            onSubmit() {
                var $data = this.$data;
                bus.recipes.addRecipes({
                    recipesCode:$data.form.recipesCode,
                    recipesName:$data.form.recipesName
                }).then((resp)=>{
                    //console.log(resp)
                    this.$message("操作成功")
                    this.$router.go(-1)
                })
            },
            onCancel(){
                this.$router.go(-1)
            }
        },
        mounted(){
            bus.recipes.queryRecipesByCode(this.$data.form.recipesCode)
            .then((resp)=>{
                console.log(resp)
                this.$data.form.recipesName = resp.recipesName;
            })
        }
    }
</script>