<template>
    <div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="门店">
                   <el-select v-model="storeCode" placeholder="请选择">
                        <el-option
                          v-for="item in storeSelection"
                          :key="item.storeCode"
                          :label="item.storeCode + '-' + item.storeName"
                          :value="item.storeCode">
                        </el-option>
                      </el-select>
                      <el-button type="primary" icon="plus" @click="addRows"></el-button>
                </el-form-item>
                <el-form-item>
                	<div v-for="(item,index) in recipesList">
                	    <el-select v-model="item.recipesCode" placeholder="请选择">
                        <el-option
                          v-for="item in recipesSelection"
                          :key="item.recipesCode"
                          :label="item.recipesCode + '-' + item.recipesName"
                          :value="item.recipesCode">
                        </el-option>
                      </el-select>
                      <el-input placeholder="请输入份数" v-model="item.num" >
					    <template slot="prepend">份数</template>
					  </el-input>
					  <el-button type="primary" icon="minus" @click="removeRows(index)"></el-button>
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
    import * as bus from '../common/bus'
    export default {
        data(){
            return {
                storeSelection:[],
                recipesSelection:[],
                storeCode:'',
                recipesList:[
                	{}
                ]
             }
        },
        methods: {  
            onCancel(){
                this.$router.go(-1)
            },
            onSubmit(){
            	this.$message.error("还未实现")
            },
            addRows(){
            	this.$data.recipesList.push({})
            },
            removeRows(index){
            	this.$data.recipesList.splice(index,1)
            }
        },
        mounted(){
        	var $data = this.$data;
        	bus.store.getAllStoreList()
             .then((resp)=>{
                 $data.storeSelection = resp
             });

             $data.recipesSelection=[
             	{recipesCode:"0001",recipesName:"鱼香肉丝"},
             	{recipesCode:"0002",recipesName:"黄焖鸡小份"},
             	{recipesCode:"0003",recipesName:"黄焖鸡大份"},
             	{recipesCode:"0004",recipesName:"土洞牛肉"},
             	{recipesCode:"0005",recipesName:"汉堡王大份"},
             	{recipesCode:"0006",recipesName:"牛肉汉堡"},
             	{recipesCode:"0007",recipesName:"小炒肉"}
             ]
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
</style>