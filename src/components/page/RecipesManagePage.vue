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
                <el-form-item label="配方">
                    <table class="border-table" style="width:100%">   
                    <tr>
                        <th>ID</th>
                       <th>食材</th>  
                       <th>数量</th>  
                       <th>操作</th>  
                    </tr>  
                    <tr v-for="ff in form.formula">
                      <td>{{ff.id}}</td>  
                      <td>
                          <el-select v-model="ff.dropdown" filterable placeholder="请选择" 
                            @change="formulaChange(ff)">
                            <el-option
                              v-for="item in allMaterials"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                              :disabled="item.disabled">
                            </el-option>
                          </el-select>
                      </td>  
                      <td>{{ff.dropdown}}</td>  
                      <td>330623***********9</td>  
                    </tr>
                    </table>  
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
                    recipesName:'',
                    formula:[
                        {id:1},{id:2},{},{}
                    ]
                },
                allMaterials:[
                    {label:'鱼头',value:'00001'},
                    {label:'鱼肉',value:'00002'},
                    {label:'葱',value:'00003'},
                    {label:'大蒜',value:'00004'},
                    {label:'耗油',value:'00005'}
                ]
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
            },
            formulaChange(item){
                //console.log(item)
                this.$data.allMaterials.forEach((val,index,arr)=>{
                    if(val.value == item.dropdown){
                        val.disabled = true;
                    }
                })
            }
        },
        mounted(){
            bus.recipes.queryRecipesByCode(this.$data.form.recipesCode)
            .then((resp)=>{
                this.$data.form.recipesName = resp.recipesName;
            })
        }
    }
</script>
<style>
    .border-table {   
        border-collapse: collapse;   
        border: none;   
    }   
    .border-table td {   
        border: solid #000 1px;   
    }
    .border-table th {   
        border: solid #000 1px;   
    }
</style>