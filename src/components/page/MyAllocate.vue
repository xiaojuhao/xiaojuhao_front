<template>
    <div class="table">
        <div class="handle-box">
            调拨单状态 <el-select v-model="query.status">
                <el-option label="配送中" value="4"></el-option>
                <el-option label="已入库" value="5"></el-option>
                <el-option label="撤销" value="6"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索采购单</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="cabinCode" label="单位编码" width="150">
            </el-table-column>
            <el-table-column prop="cabinName" label="单位名称" width="150">
            </el-table-column>
            <el-table-column prop="proposer" label="申请人" width="120">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80" :formatter="formatStatus">
            </el-table-column>
            <el-table-column prop="applyType" label="类型" width="100" :formatter="formatApplyType">
            </el-table-column>
            <el-table-column prop="gmtCreated" label="操作日期" width="120" :formatter="formatCreate">
            </el-table-column>
            <el-table-column prop="applyNum" label="采购单号" width="350">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="80">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="printBill(scope.row)">打印</el-button>
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
import { api,config } from '../common/bus'
export default {
    data() {
        return {
            tableData: [],
            pageSize: 5,
            pageNo:1,
            totalRows: 0,
            loadingState: false,
            query: {
                status: ''
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
        formatStatus(row) {
            switch (row.status) {
                case "4":
                    return '配送中'
                case "5":
                    return "已入库"
                case "6":
                    return "撤销"
                default:
                    return '未知'
            }
        },
        formatApplyType(row) {
            switch (row.applyType) {
                case "purchase":
                    return "采购单"
                case "allocate_in":
                    return "拨入"
                case "allocate_out":
                    return "拨出"
                default:
                    return "未知"
            }
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getData();
        },
        formatCreate(row){
            let date = new Date(row.gmtCreated)
            return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()
        },
        getData() {
            let param = {
                status: this.query.status,
                pageNo: this.pageNo,
                pageSize:this.pageSize
            }
            api.queryMyAllocate(param)
                .then((page) => {
                    this.tableData = page.values;
                    this.totalRows = page.totalRows;
                })
        },
        search() {
            this.tableData = [];
            this.getData();
        },
        confirmOrder(item) {
            this.$router.push({ path: "/inventoryInConfirm", query: { applyNum: item && item.applyNum } })
        },
        printBill(item){
            window.open(config.server+"/print?applyNum="+item.applyNum)
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