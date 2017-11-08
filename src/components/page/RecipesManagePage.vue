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
                    <el-row :gutter="5">
                        <el-col :span="12"><span class="span-center">原料</span></el-col>
                        <el-col :span="4"><span class="span-center">数量</span></el-col>
                        <el-col :span="3"><span class="span-center">单位</span></el-col>
                        <el-col :span="3"><span class="span-center">操作</span></el-col>
                    </el-row>
                    <el-row v-for="(ff,index) in form.formula" :gutter="5">
                        <el-col :span="12">
                            <el-select v-model="ff.materialCode" 
                            placeholder="请选择" 
                            :filterable="true"
                            :filter-method="filterMaterials"
                            @visible-change="materialVisualChange"
                            @change="formulaChange(ff)">
                                <el-option
                                  v-for="item in allMaterialsShow"
                                  :key="item.materialCode"
                                  :label="item.materialName"
                                  :value="item.materialCode">
                                </el-option>
                              </el-select>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="ff.amt" placeholder="数量"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">{{ff.stockUnit}}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">
                                <el-button type="danger" icon="delete" @click="removeFormula(index)"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button type="success" @click="addFormula">增加原料</el-button>
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
    export default {
        data: function(){
            return {
                form:{
                    id:'',
                    recipesCode:this.$route.query.code,
                    recipesName:'',
                    formula:[]
                },
                allMaterials:[],
                allMaterialsShow:[]
            }
        },
        methods: {
            onSubmit() {
                var $data = this.$data;
                api.addRecipes({
                    recipesCode:$data.form.recipesCode,
                    recipesName:$data.form.recipesName,
                    formulaJson:JSON.stringify($data.form.formula)
                }).then((resp)=>{
                    this.$message("操作成功")
                    this.$router.go(-1)
                })
            },
            onCancel(){
                this.$router.go(-1)
            },
            formulaChange(item){
                if(this.allMaterialsMap && this.allMaterialsMap[item.materialCode]){
                    item.stockUnit = this.allMaterialsMap[item.materialCode].stockUnit;   
                }
            },
            removeFormula(index){
                this.$data.form.formula.splice(index,1)
            },
            addFormula(){
                this.$data.form.formula.push({id:0,stockUnit:'',amt:0,materialCode:''})
            },
            filterMaterials(input){
                let $data = this.$data;
                setTimeout(()=>{
                    $data.allMaterialsShow =  $data.allMaterialsShow.filter((item)=>{
                        return true;
                    })
                },10);
            },
            materialVisualChange(val){
                if(val){
                    this.$data.allMaterialsShow=[];
                    this.$data.allMaterials.forEach((item)=>this.$data.allMaterialsShow.push(item))
                }
            }
        },
        mounted(){
            api.queryRecipesByCode(this.$data.form.recipesCode)
            .then((resp)=>{
                this.$data.form.recipesName = resp.recipesName;
            });
            api.queryAllMaterials()
            .then((val)=>{
                this.$data.allMaterials = val.values;
            });
            this.$data.allMaterialsShow=[];
            this.$data.allMaterials.forEach((item)=>this.$data.allMaterialsShow.push(item))
            api.queryRecipesFormula(this.$data.form.recipesCode)
            .then((value)=>{
                this.$data.form.formula = value;
            })

        },
        computed:{
            allMaterialsMap:function(){
                var map = {};
                this.$data.allMaterials.forEach((item)=>{
                    map[item.materialCode]=item
                })
                return map;
            }
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