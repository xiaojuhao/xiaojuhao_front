<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col>
                    <MyCabinSelect @input="(v)=>{this.queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:130px" placeholder="原料名称"></el-input>
                    <el-date-picker v-model="queryCond.startDate" type="date" placeholder="起始日期" style="width:130px">
                    </el-date-picker>
                    -
                    <el-date-picker v-model="queryCond.endDate" type="date" placeholder="结束日期" style="width:130px">
                    </el-date-picker>
                    <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                    <el-button type="primary" icon="search" @click="downloadExcel()">下载EXCEL</el-button>
                    <br/>
                    <el-select v-model="queryCond.applyType" clearable style="width: 130px;" placeholder="类型">
                        <el-option label="采购单" value="purchase"></el-option>
                        <el-option label="调拨单" value="allocation"></el-option>
                    </el-select>
                    <span style="margin-top: 10px;">
                        <el-checkbox v-model="queryCond.groupBySupplier">按供应商分组</el-checkbox>
                    </span>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState">
            <el-table-column prop="materialName" label="原料名称" width="220">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="220">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商" width="120">
            </el-table-column>
            <el-table-column prop="inventoryAmt" label="采购数量" width="120">
                <template slot-scope="scope">
                    {{scope.row.inventoryAmt}} {{scope.row.stockUnit}}
                </template>
            </el-table-column>
            <el-table-column prop="totalPrice" label="采购金额" width="120">
                <template slot-scope="scope">
                    {{scope.row.totalPrice}} 元
                </template>
            </el-table-column>
            <el-table-column prop="totalPaidAmt" label="支付金额" width="160">
                <template slot-scope="scope">
                    {{scope.row.totalPaidAmt}} 元
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { api, util, config } from '../common/bus'
import MyCabinSelect from '../common/MyCabinSelect'

export default {
    components: {
        MyCabinSelect
    },
    data() {
        return {
            tableData: [],
            loadingState: false,
            queryCond: {
                cabinCode: '',
                searchKey: '',
                startDate: null,
                endDate: null,
                groupBySupplier: false,
                applyType: ''
            },
            showOutStock: false
        }
    },
    mounted() {},
    methods: {
        getData() {
            let self = this;
            self.$data.loadingState = true;
            api.inventoryReport({
                cabinCode: this.queryCond.cabinCode,
                searchKey: this.queryCond.searchKey,
                startDate: util.formatDateT(this.queryCond.startDate),
                endDate: util.formatDateT(this.queryCond.endDate),
                groupBySupplier: this.queryCond.groupBySupplier,
                applyType: this.queryCond.applyType
            }).then((values) => {
                self.tableData = values;
            }).fail((resp) => {
                self.$message.error("请求出错")
            }).always(() => {
                self.$data.loadingState = false;
            })
        },
        search() {
            this.tableData = [];
            this.queryCond.pageNo = 1;
            this.getData();
        },
        downloadExcel() {
            let param = '';
            let cond = {
                cabinCode: this.queryCond.cabinCode,
                searchKey: this.queryCond.searchKey,
                startDate: util.formatDateT(this.queryCond.startDate),
                endDate: util.formatDateT(this.queryCond.endDate),
                groupBySupplier: this.queryCond.groupBySupplier,
                applyType: this.queryCond.applyType
            };
            Object.keys(cond).forEach((key) => {
                let val = cond[key];
                if (val) {
                    param = param + "&" + key + "=" + val
                }
            })
            window.open(config.server + "/report/inventoryReport?download=excel" + param)
        },
        handleSelect(item) {
            this.$data.query.name = item.value;
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