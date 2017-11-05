<template>
    <div class="table">
        <div class="handle-box">
            <el-button round @click="queryData()">查询列表</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">增加仓库</el-button>
            </div>
        </div>
        <el-table :data="queryList" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="id" label="ID" sortable width="100">
            </el-table-column>
            <el-table-column prop="warehouseCode" label="仓库编码" width="150">
            </el-table-column>
            <el-table-column prop="warehouseName" label="仓库名称" width="150">
            </el-table-column>
            <el-table-column prop="warehouseManager" label="负责人" width="120">
            </el-table-column>
            <el-table-column prop="warehouseAddr" label="仓库地址" width="150">
            </el-table-column>
            <el-table-column prop="managerPhone" label="负责人手机" width="120">
            </el-table-column>
            <el-table-column prop="managerEmail" label="负责人邮箱" width="250">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">编辑</el-button>
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
                tableData: [],
                pageNo: 1,
                pageSize: 20,
                totalRows:0,
                loadingState: false,
                queryList:[]
            }
        },
        methods: {
            handleCurrentChange(val){
                this.$data.pageNo = val;
                this.queryData();
            },
            queryData(){
                this.queryList = [];
                this.totalRows = 0;
                let self = this;
                self.$data.loadingState = true;
                jquery.ajax({
                    url:config.server+'/warehouse/queryWarehouses',
                    data:{
                        pageSize:self.$data.pageSize,
                        pageNo:self.$data.pageNo
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
                    self.queryList = value.values;
                    self.totalRows = value.totalRows;
                }).fail(function(resp){
                    self.$message.error("请求出错")
                }).done(function(resp){
                    self.$data.loadingState = false;
                })
            },
            edit(index, item){
                this.$router.push({path:"/warehouseManagePage",query:{warehouseCode:item && item.warehouseCode}})
            }
        },
        mounted(){
            this.queryData();
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