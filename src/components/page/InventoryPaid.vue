<template>
    <div class="table">
        <div class="handle-box">
            <el-select v-model="query.paidStatus">
                <el-option label="待支付" value="0"></el-option>
                <el-option label="已支付" value="1"></el-option>
                <el-option label="支付失败" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="cabinName" label="仓库" width="150">
            </el-table-column>  
            <el-table-column prop="supplierName" label="供应商" width="120">
            </el-table-column>
            <el-table-column prop="proposer" label="申请人" width="120">
            </el-table-column>
            <el-table-column prop="payables" label="应付/已付" width="160" :formatter="formatPay">
            </el-table-column>
            <el-table-column prop="applyType" label="类型" width="100" :formatter="formatApplyType">
            </el-table-column>
            <el-table-column label="支付状态" width="100" :formatter="formatPayStatus">
            </el-table-column>
            <el-table-column label="支付时间" width="120" :formatter="formatPayTime">
            </el-table-column>
            <el-table-column prop="payRemark" label="备注" width="100">
            </el-table-column>
            <el-table-column prop="applyNum" label="采购单号" width="350">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button size="small" v-if="scope.row.paidStatus == '0'" type="primary" @click="payOrder(scope.row)">支付</el-button>
                    <el-button size="small" type="primary" @click="showDetail(scope.row)">明细</el-button>
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
import { api, config, util } from '../common/bus'
export default {
    data() {
        return {
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            totalRows: 0,
            loadingState: false,
            query: {
                paidStatus: '0'
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
                case "claim_loss":
                    return "报损"
                default:
                    return "未知"
            }
        },
        formatPayStatus(row) {
            switch (row.paidStatus) {
                case "0":
                    return "待支付";
                case "1":
                    return "支付成功";
                case "2":
                    return "支付失败";
                default:
                    return "未知状态"
            }
        },
        formatPayTime(row) {
            return util.formatDate(row.paidTime)
        },
        formatPay(row){
            return row.payables.toFixed(2)+"/"+row.paidAmt.toFixed(2);
        },
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getData();
        },
        getData() {
            let param = {
                paidStatus: this.query.paidStatus,
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                applyTypes: 'purchase'
            }
            api.queryInventoryApplyPage(param)
                .then((page) => {
                    this.totalRows = page.totalRows;
                    this.tableData = page.values;
                })
        },
        search() {
            this.tableData = [];
            this.getData();
        },
        payOrder(item) {
            this.$router.push({ path: "/inventoryPaidPage", query: { applyNum: item && item.applyNum } })
        },
        printBill(item) {
            window.open(config.server + "/print?applyNum=" + item.applyNum)
        },
        showDetail(item) {
            this.$router.push({ path: "/inventoryDetail", query: { applyNum: item && item.applyNum } })
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