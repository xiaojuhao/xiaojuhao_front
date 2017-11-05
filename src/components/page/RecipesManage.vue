<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="queryCond.materialCode"
                :fetch-suggestions="querySearch" placeholder="菜品编码"
                :trigger-on-focus="false"
                @select="handleSelect">
            </el-autocomplete>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">增加菜品</el-button>
            </div>
        </div>
        <el-table :data="queryList" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="id" label="ID" sortable width="100">
            </el-table-column>
            <el-table-column prop="recipesName" label="菜品名称" width="200">
            </el-table-column>
            <el-table-column prop="recipesCode" label="菜品编码" width="">
            </el-table-column>
            <el-table-column label="操作" width="120">
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
    import * as bus from '../common/bus.js'
    import config from '../common/config.vue'
    import OutStock from './OutStock.vue'
    import jquery from 'jquery'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
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
                let self = this;
                self.$data.loadingState = true;
                bus.recipes.queryRecipesPage({
                    recipesCode:''
                })
                .then((page)=>{
                    self.$data.totalRows = page.totalRows;
                    self.$data.queryList = page.values;
                }).done(()=>{
                    self.$data.loadingState = false;
                })
            },
            search(){
                this.queryList = [];
                this.queryData();
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
            edit(index, item){
                this.$router.push({path:"/recipesManagePage",query:{code:item && item.recipesCode}})
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