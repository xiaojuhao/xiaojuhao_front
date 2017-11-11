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
                    {{props.row.info}}
                </template>
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="220">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存(总)" width="120">
            </el-table-column>
            <el-table-column prop="usedStock" label="已使用量(总)" width="120">
            </el-table-column>
            <el-table-column label="利用率(%)" width="120" :formatter="getUtilizationRatio">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" 
                    @click="exportxls(scope.$index, scope.row)">导出报表</el-button>
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
                row.info=row.materialName+(expanded?"打开":"关闭");
                this.$message(row.materialName+(expanded?"打开":"关闭"))
            },
            getUtilizationRatio(row){
                return 100;
            },
            exportxls(){
                this.$message("导出EXCEL报表")
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