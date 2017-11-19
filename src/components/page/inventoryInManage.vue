<template>
    <div class="table">
        <div class="handle-box">
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="cabinCode" label="采购单位编码" width="150">
            </el-table-column>
            <el-table-column prop="cabinName" label="采购单位名称" width="150">
            </el-table-column>
            <el-table-column prop="proposer" label="申请人" width="120">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
            </el-table-column>
            <el-table-column prop="orderNum" label="采购单号" width="">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="confirmOrder(scope.$index, scope.row)">采购单确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            pageSize: 5,
            totalRows: 0,
            loadingState: false,
            query: {
                materialCode: ''
            },
            showOutStock: false
        }
    },
    mounted() {
        this.getData();
    },
    computed: {
        data() {
            const self = this;
            return self.tableData.filter(function(d) {
                return d;
            })
        }
    },
    methods: {
        formatStatus(row){
            switch(row.status){
                case "4": return '配送中'
                default: return '未知'
            }
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            api.queryMyPurchaseOrderPage()
                .then((page) => {
                    this.tableData = page.values;
                })
        },
        search() {
            this.tableData = [];
            this.getData();
        },
        confirmOrder(){
            this.$message("厨师长确认采购单功能")
        }
    }
}
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

table.gridtable {
    width: 80%;
    height: 8px;
    font-family: verdana, arial, sans-serif;
    color: #333333;
    border-width: 1px;
    border-color: #666666;
    border-collapse: collapse;
}

table.gridtable th {
    border-width: 1px;
    height: 8px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #dedede;
}

table.gridtable td {
    border-width: 1px;
    height: 8px;
    padding: 8px;
    border-style: solid;
    border-color: #666666;
    background-color: #ffffff;
}
</style>