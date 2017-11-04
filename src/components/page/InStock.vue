<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>入库</el-breadcrumb-item>
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
                <el-form-item label="入库数量" >
                     <el-input v-model="inStockAmt"></el-input>
                </el-form-item>
                <el-form-item label="仓库">
                     <el-select v-model="warehouseCode" placeholder="请选择">
                        <el-option
                          v-for="item in warehouseSelection"
                          :key="item.warehouseCode"
                          :label="item.warehouseName"
                          :value="item.warehouseCode">
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
    import config from '../common/config.vue'
    import jquery from 'jquery'
    export default {
        data: function(){
            return {
                item:{},
                inStockAmt:0,
                warehouseCode:'',
                warehouseSelection:[]
            }
        },
        methods: {
            onSubmit() {
                var self = this;
                jquery.ajax({
                    url:config.server+"/busi/instock",
                    data:{
                        materialCode:self.item.materialCode,
                        instockAmt:self.inStockAmt,
                        warehouseCode:self.warehouseCode
                    },
                    dataType:'jsonp'
                }).then(function(resp){
                    if(resp.code != 200){
                        self.$message.error(resp.message)
                        return;
                    }
                    self.$router.go(-1);
                });
            },
            onBack(){
                this.$router.go(-1)
            },
            initData() {
                var stockId = this.$route.query.stockId;
                var $data = this;
                config.queryMaterialsStockById(stockId,(resp)=>{
                    $data.item = resp.value;
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
            config.getWarehouse({},(resp)=>{
                console.log(resp)
                this.warehouseSelection=resp.value.values
            });
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
</style>