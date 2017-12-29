<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(v)=>{this.queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="原料名称或配音"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState">
            <el-table-column prop="materialName" label="原料名称" width="220">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="220">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="120">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="160">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showDetail(scope.row)">详细记录</el-button>
                    <el-button size="small" type="primary" @click="showTendency(scope.row)">趋势图</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
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
                pageNo: 1,
                pageSize: 10,
                totalRows: 0,
                cabinCode: '',
                searchKey: ''
            },
            showOutStock: false
        }
    },
    mounted() {
        this.loadParam();
        this.getData();
    },
    methods: {
        handleCurrentChange(val) {
            this.queryCond.pageNo = val;
            this.getData();
        },
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
            api.queryMaterialsStockPage({
                pageSize: self.queryCond.pageSize,
                pageNo: self.queryCond.pageNo,
                cabinCode: this.queryCond.cabinCode,
                searchKey: this.queryCond.searchKey
            }).then((page) => {
                self.tableData = page.values;
                self.queryCond.totalRows = page.totalRows;
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
        handleSelect(item) {
            this.$data.query.name = item.value;
        },
        showDetail(row) {
            this.$router.push({ path: "/stockHistory", query: { cabin: row.cabinCode, mcode: row.materialCode } })
        },
        showTendency(row) {
            this.$router.push({ path: "/stockDailyCharts", query: { cabin: row.cabinCode, mcode: row.materialCode } })
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