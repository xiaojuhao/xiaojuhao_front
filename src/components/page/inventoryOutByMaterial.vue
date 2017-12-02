<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="4">
               <el-col :span="4"><StoreSelection></StoreSelection></el-col>
               <el-col :span="4"><WarehouseSelection></WarehouseSelection></el-col>
               <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </el-row>
        </div>
        <el-table :data="data" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column type="expand">
                <template slot-scope="props">
                 【待实现】展示{{props.row.materialName}}最近几条出库记录
                </template>
            </el-table-column>
            <el-table-column prop="materialCode" label="原料编码" width="120">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="150">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="100">
            </el-table-column>
            <el-table-column prop="usedStock" label="已用数量" width="100">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="150">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="150">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                	<el-button size="small" type="primary" 
                        @click="outstock(scope.$index, scope.row)">出库</el-button>
                    
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
	import config from '../common/config.vue'
    import jquery from 'jquery'
    import StoreSelection from '../common/StoreSelection'
    import WarehouseSelection from '../common/WarehouseSelection'
    import {api} from '../common/bus'
    export default {
        data() {
            return {
                
            }
        },
        components:{
            StoreSelection,
            WarehouseSelection
        },
        mounted(){
			this.getData();
            var $this = this;
            jquery.ajax({
                url:config.server+"/warehouse/queryWarehouses",
                dataType:'jsonp'
            }).then((resp)=>{
                $this.warehouseSelection = resp.value.values;
            })
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                	return d;
                })
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                self.$data.loadingState = true;
                let param = {
                        pageSize:self.$data.pageSize,
                        pageNo:self.$data.cur_page,
                        materialCode:self.$data.query.materialCode,
                        warehouseCode:self.$data.query.warehouseCode,
                        stockType:self.$data.query.stockType
                    };
                api.queryMaterialsStockPage(param)
                .then((page)=>{
                    self.tableData = page.values;
                    self.totalRows = page.totalRows;
                }).fail(function(resp){
                    self.$message.error("请求出错")
                }).always(function(resp){
                    self.$data.loadingState = false;
                })
            },
            search(){
                this.tableData = [];
                this.getData();
            },
            outstock(index, item) {
                // this.$message('编辑第'+(index+1)+'行');
                //console.log(row)
                this.$router.push({path:"/outStock",query:{stockId:item.id}})
               // this.$data.showOutStock=true;
            },
            querySearch(queryString,cb){
            	var data = [];
            	config.search({w:queryString},(resp)=>{
                    data = resp.values;
                })
            	cb(data)
            },
            remoteMethod(query) {
            if (query !== '') {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                config.search({w:query},(resp)=>{
                    this.materialSelection = resp.value;
                })
              }, 200);
            } else {
              this.materialSelection = [];
            }
          }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
    margin-top: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>