<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="queryCond.materialCode"
                :fetch-suggestions="querySearch" placeholder="供应商"
                :trigger-on-focus="false"
                @select="handleSelect">
            </el-autocomplete>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">添加供应商</el-button>
            </div>
        </div>
        <el-table :data="queryList" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)"
            @expand="expand">
            <el-table-column type="expand">
                <template scope="props">
                    供应商供应的原料
                </template>
            </el-table-column>
            <el-table-column prop="supplierCode" label="供应商编码" width="120">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商名称" width="150">
            </el-table-column>
            <el-table-column prop="supplierTel" label="电话" width="130">
            </el-table-column>
            <el-table-column prop="supplierPhone" label="手机" width="130">
            </el-table-column>
            <el-table-column prop="supplierEmail" label="邮箱" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
            </el-table-column>
            <el-table-column prop="supplierAddr" label="地址" width="300">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
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
    import {api} from '../common/bus.js'
    export default {
        data() {
            return {
                pageNo: 1,
                pageSize: 5,
                totalRows:0,
                loadingState: false,
                queryCond:{
                    materialCode:''
                },
                queryList:[]
            }
        },
        created(){
            
        },
        mounted(){
            this.queryData();
        },
        activated(){
           
        },
        computed: {

        },
        methods: {
            handleCurrentChange(val){
                this.pageNo = val;
                this.queryData();
            },
            queryData(){
                api.querySupplierPage({
                    pageNo:this.pageNo,
                    pageSize:this.pageSize
                }).then((page)=>{
                    this.totalRows = page.totalRows;
                    this.queryList = page.values;
                })
            },
            search(){
                this.queryList = [];
                this.queryData();
            },
            querySearch(queryString,cb){
                var data = [];
                data.push({id:1,value:'aaaaa'})
                data.push({id:2,value:'bbbbb'})
                data.push({id:3,value:'ccccc'})
                console.log(this.$data.query)
                cb(data)
            },
            edit(index, item){
                this.$router.push({path:"/supplierManagePage",query:{supplierCode:item && item.supplierCode}})
            },
            expand(row,expanded){
                
            },
            handleSelect(){

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
.el-row {
    margin-bottom: 4px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>