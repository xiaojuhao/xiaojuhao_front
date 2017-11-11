<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="100px" v-loading="loadingState">
                <el-form-item label="供应商名称">
                    <el-input v-model="form.supplierName" placeholder="供应商名称"></el-input>
                </el-form-item>
                <el-form-item label="供应商代码">
                    <el-input disabled v-model="form.supplierCode" placeholder="供应商代码"></el-input>
                </el-form-item>
                <el-form-item label="供应商手机">
                    <el-input v-model="form.supplierPhone" placeholder="供应商手机"></el-input>
                </el-form-item>
                <el-form-item label="供应商电话">
                    <el-input v-model="form.supplierTel" placeholder="供应商电话"></el-input>
                </el-form-item>
                <el-form-item label="供应商邮箱">
                    <el-input v-model="form.supplierEmail" placeholder="供应商邮箱"></el-input>
                </el-form-item>
                <el-form-item label="供应原料">
                    <el-row :gutter="5">
                        <el-col :span="12"><span class="span-center">原料</span></el-col>
                        <el-col :span="3"><span class="span-center">操作</span></el-col>
                    </el-row>
                    <el-row v-for="(ff,index) in form.materials" :gutter="5">
                        <el-col :span="12">
                            <MaterialSelection 
                                :value="ff.materialCode" 
                                :context="ff"
                                :excludes="addedMaterials"
                                v-on:input="materialSelCallback">
                            </MaterialSelection>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">
                                <el-button icon="delete" size="small" @click="removeMaterials(index)"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button type="success" @click="addMaterialItem">增加原料</el-button>
                        </el-col>
                    </el-row>
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
                form:{
                    id:'',
                    supplierCode:this.$route.query.supplierCode,
                    supplierName:'',
                    materials:[]
                },
                allMaterials:[],
                loadingState:false
            }
        },
        methods: {
            onSubmit() {
                this.$message("待实现")
            },
            onCancel(){
                this.$router.go(-1)
            },
            removeMaterials(index){
                this.$data.form.materials.splice(index,1)
            },
            addMaterialItem(){
                this.$data.form.materials.push({
                    id:0,
                    materialUnit:'',
                    materialAmt:0,
                    materialCode:''
                })
            },
            materialSelCallback(ctx,val){
                let item = this.allMaterialsMap[val]
                Object.keys(item).forEach((key)=>{
                    ctx[key]=item[key]
                })
                ctx.materialUnit = item.stockUnit;
            }
        },
        mounted(){
            
            api.queryAllMaterials()
            .then((page)=>{
                this.$data.allMaterials = page.values;
            })
            
        },
        computed:{
            allMaterialsMap(){
                let map = {}
                this.allMaterials.forEach((item)=>{
                    map[item.materialCode] = item;
                })
                return map;
            },
            addedMaterials(){
                let ll = [];
                this.$data.form.materials.forEach((item)=>ll.push(item.materialCode))
                return ll;
            }
        },
        components: {
            MaterialSelection
        }
    }
</script>
<style scoped>
    .span-center {
        display:inline-block;
        width: 100%;
        font-weight:bold;
    }
    .grid-content {
        min-height: 1px;
     }
    .el-row {
        margin-bottom: 4px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    .el-col {
        border-radius: 4px;
      }
</style>