<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>调拨</el-breadcrumb-item>
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
                <el-form-item label="仓库">
                    <span>{{item.storeName}}</span>
                </el-form-item>
                <el-form-item label="调拨数量" >
                     <el-input v-model="diaoboAmt"></el-input>
                </el-form-item>
                <el-form-item label="拨出仓库">
                     <el-select v-model="toStoreCode" placeholder="请选择">
                        <el-option
                          v-for="item in storeSelection"
                          :key="item.storeCode"
                          :label="item.storeName"
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
    import config from '../common/config.vue'
    import jquery from 'jquery'
    export default {
        data: function(){
            return {
                item:{},
                diaoboAmt:0,
                allStore:[],
                toStoreCode:''
            }
        },
        methods: {
            onSubmit() {
                var self = this;
                jquery.ajax({
                    url:config.server+"/busi/diaobo",
                    data:{
                        materialCode:self.item.materialCode,
                        diaoboAmt:self.diaoboAmt,
                        storeCode:self.item.storeCode,
                        toStoreCode:self.toStoreCode
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
            storeSelection:function(p){
                return this.allStore.filter((d)=>{
                    //过滤拨出仓库
                    if(d.storeCode != this.item.storeCode){
                        return d;
                    }
                });
            }
        },
        mounted(){
            this.initData();
            config.getAllStore((resp)=>this.allStore=resp.value.values);
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