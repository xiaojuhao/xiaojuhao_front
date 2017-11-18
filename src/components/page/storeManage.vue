<template>
    <div class="table">
        <div class="handle-box">
            <el-button round @click="queryData()">刷新数据</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">增加新门店</el-button>
            </div>
        </div>
        <el-table :data="queryList" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="storeCode" label="门店编码" width="120">
            </el-table-column>
            <el-table-column prop="storeName" label="门店名称" width="150">
            </el-table-column>
            <el-table-column prop="defaultWarehouse" label="默认仓库" width="150" :formatter="formatWarehouse">
            </el-table-column>
            <el-table-column prop="storeManager" label="负责人" width="120">
            </el-table-column>
            <el-table-column prop="storeAddr" label="门店地址" width="150">
            </el-table-column>
            <el-table-column prop="managerPhone" label="负责人手机" width="130">
            </el-table-column>
            <el-table-column prop="managerEmail" label="负责人邮箱" width="220">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {api} from '../common/bus'
    export default {
        data() {
            return {
                loadingState: false,
                queryList:[],
                allWarehouse:[]
            }
        },
        methods: {
            queryData(){
                this.queryList = [];
                this.totalRows = 0;
                let self = this;
                self.$data.loadingState = true;
                api.getAllStoreList()
                .then((values)=>{
                    self.queryList = values;
                }).fail((resp)=>{
                    this.$message.error(resp.message)
                }).always(()=>{
                    self.$data.loadingState = false;
                })
            },
            edit(index, item){
                this.$router.push({path:"/storeManagePage",query:{storeCode:item && item.storeCode}})
            },
            formatWarehouse(item){
                let wh = this.warehouseMap[item.defaultWarehouse];
                return wh && wh.warehouseName;
            }
        },
        mounted(){
            api.getAllWarehouseList().
            then((list)=>{
                this.$data.allWarehouse = list;
            })
            this.queryData();
        },
        computed:{
            warehouseMap(){
                let map = {}
                this.$data.allWarehouse.forEach((item)=>{
                    map[item.warehouseCode]=item;
                })
                return map;
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