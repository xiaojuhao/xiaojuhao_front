<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col>
                    <MyCabinSelect @input="(v)=>{this.queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="原料名称或配音"></el-input>
                    <el-date-picker v-model="queryCond.startDate" type="date" placeholder="起始日期" style="width:130px">
                    </el-date-picker>
                    -
                    <el-date-picker v-model="queryCond.endDate" type="date" placeholder="结束日期" style="width:130px">
                    </el-date-picker>
                    <el-button type="primary" icon="search" @click="search()">搜索</el-button>
                    <el-button type="primary" icon="search" @click="downloadExcel()">下载EXCEL</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState">
            <el-table-column prop="materialName" label="原料名称" width="220">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="220">
            </el-table-column>
            <el-table-column prop="currSpecAndUnit" label="采购库存" width="120">
            </el-table-column>
            <el-table-column prop="currStockAndUnit" label="食材库存" width="120">
            </el-table-column>
            <el-table-column prop="inStock" label="入库数量" width="120">
            </el-table-column>
            <el-table-column prop="sale" label="销售数量" width="120">
                <template slot-scope="scope">
                    {{-1 * scope.row.sale}}
                </template>
            </el-table-column>
            <el-table-column prop="inStockLoss" label="入库损耗数量" width="160">
                <template slot-scope="scope">
                    {{-1 * scope.row.inStockLoss}}
                </template>
            </el-table-column>
            <el-table-column prop="claimLoss" label="报损数量" width="160">
                <template slot-scope="scope">
                    {{-1 * scope.row.claimLoss}}
                </template>
            </el-table-column>
            <el-table-column prop="correctDelta" label="盘点损耗" width="160">
                <template slot-scope="scope">
                    {{-1 * scope.row.correctDelta}}
                </template>
            </el-table-column>
            <el-table-column label="销售占比" width="160">
                <template slot-scope="scope">
                    {{scope.row.saleAmtRatio}}%
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
                endDate: null
            },
            showOutStock: false
        }
    },
    mounted() {
        this.loadParam();
    },
    methods: {
        keepParam() {
            this.$store.commit("setQueryCond", this.queryCond)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        getData() {
            this.keepParam();
            let self = this;
            self.$data.loadingState = true;
            api.stockReport({
                cabinCode: this.queryCond.cabinCode,
                searchKey: this.queryCond.searchKey,
                startDate: util.formatDateT(this.queryCond.startDate),
                endDate: util.formatDateT(this.queryCond.endDate)
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
            Object.keys(this.queryCond).forEach((key) => {
                let val = this.queryCond[key];
                if (val) {
                    param = param + "&" + key + "=" + val
                }
            })
            window.open(config.server + "/report/stockReport?download=excel" + param)
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