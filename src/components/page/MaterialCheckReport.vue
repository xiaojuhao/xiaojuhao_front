<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(val)=>{this.queryCond.cabinCode = val}"></MyCabinSelect>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="cabinCode" label="门店编码" width="150">
            </el-table-column>
            <el-table-column prop="cabinName" label="门店名称" width="150">
            </el-table-column>
            <el-table-column prop="checker" label="盘点人员" width="130">
            </el-table-column>
            <el-table-column label="状态" width="130" :formatter="formatStatus">
            </el-table-column>
            <el-table-column label="盘点开始时间" width="180" :formatter="formatStartTime">
            </el-table-column>
            <el-table-column prop="盘点开始时间" label="盘点结束时间" width="180" :formatter="formatEndTime">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showDetail(scope.$index, scope.row)">
                        详细
                    </el-button>
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
import { api, util } from '../common/bus'
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
            queryList: [],
            categorySel: [],
            userRole: this.$store.state.userRole
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
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
                    return "未开始";
                case "1":
                    return "正在盘点";
                case "2":
                    return "盘点完成";
            }
        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialCheckMain({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    cabinCode: this.queryCond.cabinCode
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
        showDetail(index, item) {
            this.keepParam();
            this.$router.push({ path: "/materialCheckReportDetail", query: { id: item && item.id } })
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