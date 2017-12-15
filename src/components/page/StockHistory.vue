<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存流水</el-breadcrumb-item>
                <el-breadcrumb-item>{{query.cabinName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="id" label="顺序" width="80">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="120">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="120">
            </el-table-column>
            <el-table-column prop="opType" label="操作类型" width="120" :formatter="formatOpType">
            </el-table-column>
            <el-table-column prop="amt" label="库存变化" width="120">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="operator" label="操作人" width="100">
            </el-table-column>
            <el-table-column prop="gmtCreated" label="操作时间" width="180" :formatter="formatDate">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="300">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="cur_page" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
        <div style="text-align:center">
            <el-button @click="returnBack" >返回</el-button>
        </div>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
export default {
    data() {
        return {
            tableData: [],
            cur_page: 1,
            pageSize: 10,
            totalRows: 0,
            loadingState: false,
            query: {
                cabinCode: this.$route.query.cabin,
                materialCode: this.$route.query.mcode,
                cabinName: ''
            },
            showOutStock: false
        }
    },
    mounted() {
        this.getData()
        api.getCabinByCode(this.query.cabinCode)
            .then((vo) => {
                this.query.cabinName = vo.name;
            })
    },
    methods: {
        returnBack(){
            this.$router.go(-1)
        },
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        formatOpType(row) {
            switch (row.opType) {
                case "in_stock":
                    return "采购入库"
                case "in_stock_loss":
                    return "采购损耗"
                case "out_stock":
                    return "出库"
                case "correct":
                    return "盘点库存"
                case "claim_loss":
                    return "报损"
                case "allocation":
                    return "库存调拨"
                case "correct_delta":
                    return "盘点差额"
                default:
                    return row.opType
            }
        },
        formatDate(row) {
            let date = new Date(row.gmtCreated)
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + (date.getHours() + 1) + ":" + date.getMinutes() + ":" + date.getSeconds()
        },
        getData() {
            let self = this;
            self.$data.loadingState = true;
            let param = {
                pageSize: self.pageSize,
                pageNo: self.cur_page,
                materialCode: self.query.materialCode,
                cabinCode: self.query.cabinCode,
            };

            api.queryMaterialsStockHistoryPage(param)
                .then((page) => {
                    self.tableData = page.values;
                    self.totalRows = page.totalRows;
                }).fail(function(resp) {
                    self.$message.error("请求出错")
                }).always(function(resp) {
                    self.$data.loadingState = false;
                })
        },
        search() {
            this.cur_page = 1;
            this.tableData = [];
            this.getData();
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
</style>