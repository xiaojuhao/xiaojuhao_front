<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>出库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :inline="true" label-width="80px" class="table-simple">
                <el-form-item label="原料名称">
                    <span>{{item.materialName}}</span>
                </el-form-item>
                <el-form-item label="原料编码">
                    <span>{{item.materialCode}}</span>
                </el-form-item>
                <el-form-item label="当前库存">
                    <span>{{item.currStock}}</span>
                </el-form-item>
                <el-form-item label="已用数量">
                    <span>{{item.usedStock}}</span>
                </el-form-item>
                <el-form-item label="库存类型" class="el-form-item2">
                    <span>{{stockTypeName}}</span>
                </el-form-item>
                <el-form-item label="出库数量" >
                     <el-input v-model="outStockAmt" class="input-width-short">
                         <template slot="append">{{item.stockUnit}}</template>
                     </el-input>
                </el-form-item>
                <el-form-item label="门店">
                     <el-select v-model="storeCode" placeholder="请选择">
                        <el-option
                          v-for="item in storeSelection"
                          :key="item.storeCode"
                          :label="item.storeCode + '-' + item.storeName"
                          :value="item.storeCode">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item class="el-form-item-button">
                      <el-button type="primary" @click="onSubmit">提交</el-button>
                      <span style="margin-right:20px"></span>
                      <el-button @click="onBack">取消</el-button>
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
                item:{},
                outStockAmt:0,
                storeCode:'',
                storeSelection:[]
            }
        },
        methods: {
            onSubmit() {
                var $this = this;
                api.outstock({
                    id:this.$route.query.stockId,
                    materialCode:$this.item.materialCode,
                    warehouseCode:$this.item.warehouseCode,
                    outstockAmt:$this.outStockAmt,
                    storeCode:$this.storeCode
                }).then((resp)=>{
                    $this.$message("出库成功")
                    $this.$router.go(-1)
                }).fail((resp)=>{
                    $this.$message.error(resp.message)
                });
            },
            onBack(){
                this.$router.go(-1)
            },
            initData() {
            	var jsonp = require('jsonp')
            	var $data = this;
              api.queryMaterialsStockById(this.$route.query.stockId)
              .then((value)=>{
                  $data.item = value;
              });
              api.getAllStoreList()
              .then((value)=>{
                  $data.storeSelection = value;
              })

            }
        },
        computed:{
        	stockTypeName:function(){
        		if(this.item.stockType && this.item.stockType==1){
        			return '总库'
        		}else{
        			return '分库'
        		}
        	}
        },
        mounted(){
        	this.initData();
        },
        activated(){
            
        }
    }
</script>
<style scoped>
  .table-simple {
    font-size: 0;
  }
  .table-simple label {
    width: 90px;
    color: #99a9bf;
    background-color: red;

  }
  .table-simple .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .table-simple .el-form-item2 {
    width: 90%;
  }
  .el-form-item-button {
    margin-top: 10px;
    margin-left: 20%;
    width: 90%;
  }
  .input-width-short {
    width: 150px;
  }
</style>