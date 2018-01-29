<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 报表管理</el-breadcrumb-item>
                <el-breadcrumb-item>库存盘点明细</el-breadcrumb-item>
                <el-breadcrumb-item>{{checkMain.cabinName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-select v-model="queryCond.category" style="width:100px" clearable placeholder="分类">
                        <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索条件"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                    <el-button type="primary" icon="search" @click="downloadExcel">下载EXCEL</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="materialName" label="原料名称" width="200">
            </el-table-column>
            <el-table-column label="初始库存" width="160">
                <template slot-scope="scope">
                    {{scope.row.oriStockAmt}} {{scope.row.stockUnit}}
                </template>
            </el-table-column>
            <el-table-column label="盘点库存" width="160">
                <template slot-scope="scope">
                    {{scope.row.stockAmt}} {{scope.row.stockUnit}}
                </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120">
            </el-table-column>
            <el-table-column label="差额" width="120">
                <template slot-scope="scope">
                    {{scope.row.deltaAmt}} {{scope.row.stockUnit}}
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
            </el-pagination>
        </div>
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
                pageNo: 1,
                pageSize: 10,
                totalRows: 0,
                materialCode: '',
                searchKey: '',
                cabinCode: '',
                category: ''
            },
            checkMain: {},
            categorySel: [],
            queryList: []
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
        api.queryMaterialCheckMain({
            id: this.$route.query.id
        }).then((page) => {
            if (page && page.values && page.values.length > 0) {
                this.checkMain = page.values[0]
            }
        })
        api.queryUnitByGroup('material_category').then((cates) => this.categorySel = cates);
    },
    methods: {
        handleCurrentChange(val) {
            this.queryCond.pageNo = val;
            this.queryData();
        },
        keepParam() {
            this.$store.commit("setQueryCond", this.queryCond)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        formatStartTime(row) {
            return util.formatDateTime(row.startTime)
        },
        formatEndTime(row) {
            return util.formatDateTime(row.endTime)
        },
        formatStatus(row) {
            switch (row.status) {
                case "0":
                    return "未盘点";
                case "1":
                    return "已盘点";
            }
        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialCheckDetail({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    mainId: this.$route.query.id,
                    category: this.queryCond.category,
                    searchKey: this.queryCond.searchKey
                })
                .then((page) => {
                    this.queryList = page.values;
                    this.queryCond.totalRows = page.totalRows;
                }).fail((resp) => {
                    this.$message.error("请求出错")
                }).always((resp) => {
                    this.loadingState = false;
                })
        },
        search() {
            this.queryList = [];
            this.queryData();
        },
        downloadExcel() {
            window.open(config.server + "/check/downloadCheckDetail?mainId=" + this.$route.query.id)
        },
        edit(index, item) {
            this.keepParam();
            this.$router.push({ path: "/materialManagePage", query: { mid: item && item.id } })
        },
        delMaterial(index, item) {
            let tips = "是否删除" + item.materialName + "?"
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteMaterials(item.materialCode)
                    .then(() => {
                        this.queryData();
                    }).fail((resp) => {
                        this.$message.error(resp.message)
                    })
            })

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