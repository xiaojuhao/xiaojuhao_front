<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="query.materialCode"
                :fetch-suggestions="querySearch" placeholder="原料编码"
                :trigger-on-focus="false"
                @select="handleSelect">
            </el-autocomplete>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%"
            v-loading="loadingState"
            @expand="expand">
            <el-table-column type="expand">
                <template scope="props">
                    {{props.row.materialName}}每个仓库的明细（待实现）
                </template>
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="220">
            </el-table-column>
            <el-table-column prop="currStock" label="总库存" width="100">
            </el-table-column>
            <el-table-column prop="usedStock" label="总使用量" width="100">
            </el-table-column>
            <el-table-column label="剩余量" width="100" :formatter="getLeftAmount">
            </el-table-column>
            <el-table-column label="利用率(%)" width="120" :formatter="getUtilizationRatio">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="">
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
    import OutStock from './OutStock.vue'
    import jquery from 'jquery'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                pageSize:5,
                totalRows:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                loadingState: false,
                del_list: [],
                is_search: false,
                query:{
                    materialCode:''
                },
                showOutStock:false
            }
        },
        created(){
            console.log('created......')
        },
        mounted(){
            this.getData();
        },
        activated(){
            console.log("activated......");
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
                        materialCode:self.$data.materialCode,
                        storeCode:'M000',
                        stockType:'1'
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
                }).done(function(resp){
                    // self.$notify({
                    //     title:'请求数据',message:'请求完成',duration:1000,position: 'bottom-right'
                    // });
                    self.$data.loadingState = false;
                })
            },
            search(){
                this.tableData = [];
                this.cur_page = 1;
                this.getData();
            },
            formatStockType(row, column) {
                return row.stockType==1?"总库":"分库";
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            outstock(index, item) {
                // this.$message('编辑第'+(index+1)+'行');
                //console.log(row)
                this.$router.push({path:"/outStock",query:{stockId:item.id}})
               // this.$data.showOutStock=true;
            },
            instock(index, item) {
                this.$router.push({path:"/inStock",query:{stockId:item.id}})
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
                data.push({id:1,value:'aaaaa'})
                data.push({id:2,value:'bbbbb'})
                data.push({id:3,value:'ccccc'})
                console.log(this.$data.query)
                cb(data)
            },
            expand(row,expanded){
                this.$message(row.materialName+(expanded?"打开":"关闭"))
            },
            getLeftAmount(row){
                return row.currStock - row.usedStock;
            },
            getUtilizationRatio(row){
                return 100;
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