<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="4">
                    <MaterialSelection @input="(v)=>{this.query.materialCode=v}"></MaterialSelection>
                </el-col>
                <el-col :span="4">
                    <MyCabinSelect @input="(val)=>{this.query.cabinCode=val}"></MyCabinSelect>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)" @expand="expand">
            <el-table-column type="expand">
                <template scope="props">
                    <ul>
                        <li v-for="h in props.row.history" style="list-style-type:none">
                            <el-row>
                                <el-col :span="2">{{formatOpType(h.opType)}}</el-col>
                                <el-col :span="2">{{h.amt}}</el-col>
                                <el-col :span="2">{{formatStatus(h.status)}}</el-col>
                            </el-row>
                        </li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column prop="materialCode" label="原料编码" width="100">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="150">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="100">
            </el-table-column>
            <el-table-column prop="usedStock" label="已用数量" width="100">
            </el-table-column>
            <el-table-column prop="cabinName" label="货仓" width="200">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="100">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="diaobo(scope.$index, scope.row)">调拨</el-button>
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
import config from '../common/config.vue'
import jquery from 'jquery'
import { api } from '../common/bus'
import MyCabinSelect from '../common/MyCabinSelect'
import MaterialSelection from '../common/MaterialSelection'
import Vue from 'vue'
export default {
    components: {
        MyCabinSelect,
        MaterialSelection
    },
    data() {
        return {
            tableData: [],
            cur_page: 1,
            pageSize: 5,
            totalRows: 0,
            loadingState: false,
            query: {
                materialCode: '',
                stockType: '2',
                cabinCode: ''
            },
            warehouseSelection: [],
            materialSelection: [],
            showOutStock: false
        }
    },
    created() {

    },
    mounted() {
        this.getData();
        api.queryMyWarehouse()
            .then((page) => {
                this.warehouseSelection = page.values;
            })
    },
    activated() {

    },
    computed: {
        data() {
            const self = this;
            return self.tableData.filter(function(d) {
                Vue.set(d, 'history', [])
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
            let param = {
                pageSize: self.pageSize,
                pageNo: self.cur_page,
                materialCode: self.query.materialCode,
                cabinCode: self.query.cabinCode,
                stockType: self.query.stockType
            };
            api.queryMaterialsStockPage(param)
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
            this.tableData = [];
            this.getData();
        },
        formatStockType(row, column) {
            return row.stockType == 1 ? "总库" : "分库";
        },
        diaobo(index, item) {
            this.$router.push({ path: "/diaoboPage", query: { stockId: item.id } })
        },
        querySearch(queryString, cb) {
            var data = [];
            config.search({ w: queryString }, (resp) => {
                data = resp.values;
            })
            cb(data)
        },
        remoteMethod(query) {
            if (query !== '') {
                this.loading = true;
                setTimeout(() => {
                    this.loading = false;
                    config.search({ w: query }, (resp) => {
                        this.materialSelection = resp.value;
                    })
                }, 200);
            } else {
                this.materialSelection = [];
            }
        },
        handleSelect() {

        },
        expand(row, expanded) {
            if (expanded) {
                api.queryMaterialsStockHistoryPage({
                    materialCode: row.materialCode,
                    cabinCode: row.cabinCode,
                    opTypes: 'boru,bochu'
                }).then((page) => {
                    row.history = page.values;
                })
            }
        },
        formatStatus(status) {
            if (status == '0') return '未处理';
            if (status == '1') return '已处理';
            if (status == '2') return '废弃';
            if (status == '9') return '处理中'
            return '未知'
        },
        formatOpType(type) {
            if (type == 'boru') return '拨入';
            if (type == 'bochu') return '拨出';
            return '未知'
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