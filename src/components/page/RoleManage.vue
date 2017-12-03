<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">添加角色</el-button>
            </div>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="id" label="ID" width="100">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称">
            </el-table-column>
            <el-table-column label="状态" :formatter="formatStatus">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageNo" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
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
            pageNo: 1,
            pageSize: 10,
            totalRows: 0,
            loadingState: false,
            showOutStock: false
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getData();
        },
        formatStatus(row) {
            switch (row.status) {
                case "1":
                    return "有效"
                default:
                    return "无效"
            }
        },
        formatIsSupper(row) {
            switch (row.isSupper) {
                case "1":
                    return "是"
                default:
                    return "否"
            }
        },
        getData() {
            this.$data.loadingState = true;
            let param = {
                pageSize: this.pageSize,
                pageNo: this.pageNo
            };
            api.queryRolesPage(param)
                .then((page) => {
                    this.tableData = page.values;
                    this.totalRows = page.totalRows;
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.$data.loadingState = false
                })
        },
        edit(row) {
            this.$router.push({path:'/roleEdit',query:{ID:row && row.id}})
        }
    }
}
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
    margin-top: -40px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
</style>