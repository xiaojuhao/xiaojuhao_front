<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="queryCond.materialCode"
                :fetch-suggestions="querySearch" placeholder="原料编码"
                :trigger-on-focus="false"
                @select="handleSelect">
            </el-autocomplete>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">增加</el-button>
            </div>
        </div>
        <el-table :data="queryList" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="id" label="ID" sortable width="100">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="200">
            </el-table-column>
            <el-table-column prop="materialCode" label="原料编码" width="150">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="120">
            </el-table-column>
            <el-table-column prop="canSplit" label="是否可拆" width="120">
            </el-table-column>
            <el-table-column prop="modifier" label="最近修改人" width="">
            </el-table-column>
            <el-table-column label="操作" width="100">
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
                jquery.ajax({
                    url:config.server+'/busi/queryMaterials',
                    data:{
                        pageSize:self.$data.pageSize,
                        pageNo:self.$data.pageNo,
                        materialCode:self.$data.materialCode
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
                    // self.$notify({
                    //     title:'请求数据',message:'请求完成',duration:1000,position: 'bottom-right'
                    // });
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
                this.$router.push({path:"/materialManagePage",query:{mid:item && item.id}})
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