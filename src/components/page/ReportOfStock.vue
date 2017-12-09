<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="query.materialCode" :fetch-suggestions="querySearch" placeholder="原料编码" :trigger-on-focus="false" @select="handleSelect">
            </el-autocomplete>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState">
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
            pageSize: 10,
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
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let self = this;
            self.$data.loadingState = true;
            api.queryMaterialsStockPage({
                pageSize: self.$data.pageSize,
                pageNo: self.$data.cur_page,
                materialCode: self.$data.materialCode
            }).then((page) => {
                self.tableData = page.values;
                self.totalRows = page.totalRows;
            }).fail((resp) => {
                self.$message.error("请求出错")
            }).always(() => {
                self.$data.loadingState = false;
            })
        },
        search() {
            this.tableData = [];
            this.cur_page = 1;
            this.getData();
        },
        handleSelect(item) {
            this.$data.query.name = item.value;
        },
        querySearch(queryString, cb) {
            var data = [];
            data.push({ id: 1, value: 'aaaaa' })
            data.push({ id: 2, value: 'bbbbb' })
            data.push({ id: 3, value: 'ccccc' })
            console.log(this.$data.query)
            cb(data)
        },
        showDetail(row) {
            this.$router.push({ path: "/stockHistory", query: { cabin: row.cabinCode, mcode: row.materialCode } })
        },
        showTendency(row){
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