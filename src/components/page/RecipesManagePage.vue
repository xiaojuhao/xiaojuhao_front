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
                            <MaterialSelection 
                                :value="ff.materialCode" 
                                :context="ff"
                                :excludes="addedMaterials"
                                v-on:input="addNewFormula">
                            </MaterialSelection>
                        </el-col>
                        <el-col :span="4">
                            <el-input v-model="ff.materialAmt" placeholder="数量"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">{{ff.materialUnit}}</div>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">
                                <el-button type="danger" icon="delete" @click="removeFormula(index)"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button type="success" @click="addFormulaItem">增加原料</el-button>
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
                    recipesCode:this.$route.query.code,
                    recipesName:'',
                    formula:[]
                },
                allMaterials:[]
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
            removeFormula(index){
                this.$data.form.formula.splice(index,1)
            },
            addFormulaItem(){
                this.$data.form.formula.push({
                    id:0,
                    materialUnit:'',
                    materialAmt:0,
                    materialCode:''
                })
            },
            addNewFormula(ctx,val){
                let item = this.allMaterialsMap[val]
                Object.keys(item).forEach((key)=>{
                    ctx[key]=item[key]
                })
                ctx.materialUnit = item.stockUnit;
            }
        },
        mounted(){
            api.queryRecipesByCode(this.$data.form.recipesCode)
            .then((resp)=>{
                this.$data.form.recipesName = resp.recipesName;
            });
            api.queryAllMaterials()
            .then((page)=>{
                this.$data.allMaterials = page.values;
            })
            api.queryRecipesFormula(this.$data.form.recipesCode)
            .then((values)=>{
                this.$data.form.formula = values;
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
                this.$data.form.formula.forEach((item)=>ll.push(item.materialCode))
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