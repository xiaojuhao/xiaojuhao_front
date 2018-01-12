<template>
    <div class="table">
        <div class="handle-box">
            <div style="position:relative; float:left; ">
                <SupplierSelect @input="(v)=>{this.queryCond.supplierCode = v ;}"></SupplierSelect>
            </div>
            <el-select v-model="queryCond.status" clearable placeholder="有效性" style="width:120px;">
                <el-option label="有效" value="1"></el-option>
                <el-option label="无效" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="edit()">添加供应商</el-button>
            </div>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="supplierCode" label="供应商编码" width="120">
            </el-table-column>
            <el-table-column prop="supplierName" label="供应商名称" width="150">
            </el-table-column>
            <el-table-column prop="supplierFullName" label="供应商全称" width="300">
            </el-table-column>
            <el-table-column prop="supplierTel" label="电话" width="130">
            </el-table-column>
            <el-table-column prop="supplierPhone" label="手机" width="130">
            </el-table-column>
            <el-table-column prop="supplierEmail" label="邮箱" width="150">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus">
            </el-table-column>
            <el-table-column prop="supplierAddr" label="地址" width="300">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="120">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">编辑</el-button>
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
import { api } from '../common/bus.js'
import SupplierSelect from '../common/SupplierSelect'
export default {
    components: {
        SupplierSelect
    },
    data() {
        return {
            pageNo: 1,
            pageSize: 10,
            totalRows: 0,
            loadingState: false,
            queryCond: {
                supplierCode: '',
                status: '1'
            },
            queryList: []
        }
    },
    mounted() {
        this.queryData();
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;
            this.queryData();
        },
        queryData() {
            api.querySupplierPage({
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                supplierCode: this.queryCond.supplierCode,
                status: this.queryCond.status
            }).then((page) => {
                this.totalRows = page.totalRows;
                this.queryList = page.values;
            })
        },
        search() {
            this.queryList = [];
            this.queryData();
        },
        edit(index, item) {
            this.$router.push({ path: "/supplierManagePage", query: { supplierCode: item && item.supplierCode } })
        },
        formatStatus(row) {
            switch (row.status) {
                case "1":
                    return '有效';
                case "2":
                    return '无效';
                default:
                    return '未知'
            }
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

.el-row {
    margin-bottom: 4px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>