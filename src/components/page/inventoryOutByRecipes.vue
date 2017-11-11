<template>
    <div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px" v-loading="loadingState">
                <el-form-item label="门店">
                    <el-row>
                       <el-col :span="12">
                            <StoreSelection :value="storeCode" @input="selectStore"></StoreSelection>
                        </el-col>
                       <el-col :span="12"><el-button type="primary" icon="plus" @click="addRows"></el-button></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                	<div v-for="(item,index) in recipesList">
                      <el-row>
                	       <el-col :span="10">
                                <RecipesSelection 
                                    :value="item.recipesCode"
                                    v-on:input="addNewRecipes"
                                    :context="item"
                                    :excludes="addedRecipesCode"
                                ></RecipesSelection>
                           </el-col>
                           <el-col :span="8">
                              <el-input placeholder="请输入份数" v-model="item.amt" >
					               <template slot="prepend">份数</template>
					           </el-input>
                            </el-col>
                            <el-col :span="6">
					             <el-button type="error" size="small" icon="delete" @click="removeRows(index)"></el-button>
                            </el-col>
                      </el-row>
                  </div>
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
    import {api,http} from '../common/bus'
    import StoreSelection from '../common/StoreSelection'
    import RecipesSelection from '../common/RecipesSelection'
    export default {
        data(){
            return {
                storeCode:'',
                recipesList:[],
                allRecipes:[],
                loadingState:false
             }
        },
        methods: {  
            onCancel(){
                this.$router.go(-1)
            },
            onSubmit(){
                this.$data.loadingState = true;
                http.jsonp2("/busi/outstockByRecipes",{
                    storeCode: this.$data.storeCode,
                    recipesJson:JSON.stringify(this.$data.recipesList)
                }).then((value)=>{
                    this.$message("提交成功")
                }).fail((resp)=>{
                    this.$message.error(resp.message)
                }).always(()=>{
                    this.$data.loadingState = false;
                })
            },
            addRows(){
            	this.$data.recipesList.push({
                    recipesCode:'',
                    recipesName:'',
                    amt:0
                })
            },
            removeRows(index){
            	this.$data.recipesList.splice(index,1)
            },
            addNewRecipes(ctx,recipesCode){
                let item = this.recipesMap[recipesCode]
                if(!item) return;
                Object.keys(item).forEach((key)=>ctx[key]=item[key])
            },
            selectStore(ctx,val){
                this.$data.storeCode = val;
            }
        },
        mounted(){
            let self = this;
        	api.queryAllRecipes()
            .then((values)=>{
                self.$data.allRecipes = values;
            })
        },
        computed: {
            recipesMap(){
                let map = {}
                this.$data.allRecipes.forEach((item)=>{
                    map[item.recipesCode] = item;
                })
                return map;
            },
            addedRecipesCode(){
                let ll = [];
                Object.keys(this.$data.recipesList).forEach((i)=>{
                    ll.push(this.$data.recipesList[i].recipesCode)
                })
                return ll;
            }
        },
        components:{
          StoreSelection,
          RecipesSelection
        }
    }
</script>
<style scoped>
	.form-box{
		margin-top: 20px;
	}
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
    .el-input {
	    width: 150px;
	}
    .el-row {
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
    }
</style>