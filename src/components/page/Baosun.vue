<template>
    <div class="table">
        <div class="handle-box">
        <el-select
            v-model="query.materialCode"
            filterable clearable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethod">
            <el-option
              v-for="item in materialSelection"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
            <el-select v-model="query.warehouseCode" clearable placeholder="仓库">
                <el-option
                    v-for="item in warehouseSelection"
                    :key="item.warehouseCode"
                    :label="item.warehouseName"
                    :value="item.warehouseCode">
                </el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)"
            @expand="expand">
            <el-table-column type="expand">
                <template scope="props">
                 <ul>
                    <li v-for="item in props.row.expands">{{item}}</li>
                 </ul>
                </template>
            </el-table-column>
            <el-table-column prop="materialCode" label="原料编码" width="100">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="120">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="100">
            </el-table-column>
            <el-table-column prop="usedStock" label="已用数量" width="100">
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库" width="200">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="100">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="baosun(scope.$index, scope.row)">报损</el-button>
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
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                pageSize:5,
                totalRows:0,
                loadingState: false,
                del_list: [],
                is_search: false,
                query:{
                    materialCode:'',
                    stockType:'2',
                    warehouseCode:''
                },
                warehouseSelection:[],
                materialSelection:[],
                showOutStock:false
            }
        },
        created(){
            
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
        activated(){
            
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
                jquery.ajax({
                    url:config.server+'/busi/queryMaterialsStock',
                    data:{
                        pageSize:self.$data.pageSize,
                        pageNo:self.$data.cur_page,
                        materialCode:self.$data.query.materialCode,
                        warehouseCode:self.$data.query.warehouseCode,
                        stockType:self.$data.query.stockType
                    },
                    dataType: 'jsonp'
                }).then(function(resp){
                    if(resp.code!=200){
                        self.$message.error(resp.message)
                        return;
                    }
                    var value = resp.value;
                    if(!value){
                       self.$message.error("服务端没有返回数据")
                       return;
                    }
                    self.tableData = value.values;
                    self.totalRows = value.totalRows;
                }).fail(function(resp){
                    self.$message.error("请求出错")
                }).always(function(resp){
                    // self.$notify({
                    //     title:'请求数据',message:'请求完成',duration:1000,position: 'bottom-right'
                    // });
                    self.$data.loadingState = false;
                })
            },
            search(){
                this.tableData = [];
                this.getData();
            },
            formatStockType(row, column) {
                return row.stockType==1?"总库":"分库";
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            baosun(index, item) {
                this.$message('功能还未实现');
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelect(item){
                this.$data.query.name=item.value;
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
          },
          expand(row){
            row.expands = [
                "20170102 八佰伴店 报损 20只",
                "20170103 八佰伴店 报损 21只",
                "20170105 八佰伴店 报损 5只",
                "20170112 八佰伴店 报损 12只",
            ]
          }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>