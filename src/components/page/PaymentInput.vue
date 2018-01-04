<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-select v-model="queryCond.type" style="width:100px" clearable placeholder="费用类型">
                        <el-option label="报销" value="reim"></el-option>
                        <el-option label="备用金" value="fund"></el-option>
                        <el-option label="付款申请" value="expense"></el-option>
                        <el-option label="工资" value="salary"></el-option>
                    </el-select>
                    <el-select v-model="queryCond.status" style="width:100px" clearable placeholder="状态">
                        <el-option v-for="item in paymentStatusSels" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                    <el-date-picker v-model="queryCond.startDateD" type="date" placeholder="起始日期" style="width:130px">
                    </el-date-picker>
                    -
                    <el-date-picker v-model="queryCond.endDateD" type="date" placeholder="结束日期" style="width:130px">
                    </el-date-picker>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="8">
                    <div style="position:relative; float:right; ">
                        <el-button round @click="edit()">申请新单</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="payNo" label="申请单号" width="150">
            </el-table-column>
            <el-table-column prop="departmentName" label="申请部门" width="150">
            </el-table-column>
            <el-table-column prop="typeName" label="分类" width="100">
            </el-table-column>
            <el-table-column prop="payables" label="申请金额" width="100">
            </el-table-column>
            <el-table-column prop="paidAmt" label="已付金额" width="100">
            </el-table-column>
            <el-table-column label="状态" width="100" :formatter="formatStatus">
            </el-table-column>
            <el-table-column label="申请日期" width="120" :formatter="formatCreateTime">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="primary" @click="delMaterial(scope.$index, scope.row)">
                        删除
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
import MaterialSelection from '../common/MaterialSelection'

export default {
    components: {
        MaterialSelection
    },
    data() {
        return {
            loadingState: false,
            queryCond: {
                pageNo: 1,
                pageSize: 10,
                totalRows: 0,
                materialCode: '',
                searchKey: '',
                type: '',
                status: '',
                startDateD: null,
                endDateD: null
            },
            paymentStatusSels: [],
            queryList: [],
            userRole: this.$store.state.userRole
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
        api.queryUnitByGroup('payment_status').then((vals) => this.paymentStatusSels = vals);
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
        formatStatus(row) {
            switch (row.status) {
                case "0":
                    return "暂存";
                case "1":
                    return "待审核";
                case "2":
                    return "审核通过";
                case "3":
                    return "审核驳回";
                case "4":
                    return "待支付";
                case "5":
                    return "已支付";
                default:
                    return "未知";
            }
        },
        formatCreateTime(row) {
            return util.formatDate(row.createdTime)
        },
        queryData() {
            this.loadingState = true;
            this.queryCond.startDate = util.parseDate(this.queryCond.startDateD);
            this.queryCond.endDate = util.parseDate(this.queryCond.endDateD);
            api.queryPayments(this.queryCond)
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
        edit(index, item) {
            this.keepParam();
            this.$router.push({ path: "/paymentInputDetail", query: { id: item && item.id, payno: item && item.payNo } })
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