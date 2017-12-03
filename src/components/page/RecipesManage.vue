<template>
    <div class="table" v-loading="loadingState" element-loading-text="处理中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="4">
                    <RecipesSelection @input="(v)=>{this.queryCond.recipesCode=v;}"></RecipesSelection>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="16">
                    <div style="position:relative; float:right; ">
                        <el-button round @click="syncMenu()">同步菜单</el-button>
                        <el-button round @click="edit()">增加菜品</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" @expand="expand">
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-row v-for="item in props.row.formulas" :key="item.materialCode">
                        <el-col :span="3">{{item.materialName}}</el-col>
                        <el-col :span="1">{{item.materialAmt}}</el-col>
                        <el-col :span="1">{{item.materialUnit}}</el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="recipesCode" label="菜品编码" width="120">
            </el-table-column>
            <el-table-column prop="recipesName" label="菜品名称" width="200">
            </el-table-column>
            <el-table-column prop="recipesType" label="菜品类型" width="150">
            </el-table-column>
            <el-table-column prop="outCode" label="外部系统编号" width="150">
            </el-table-column>
            <el-table-column prop="src" label="来源"></el-table-column>
            <el-table-column label="操作" width="120">
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
import RecipesSelection from '../common/RecipesSelection'
import Vue from 'vue'
export default {
    components: {
        RecipesSelection
    },
    data() {
        return {
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            totalRows: 0,
            loadingState: false,
            queryCond: {
                recipesCode: ''
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
            this.loadingState = true;
            api.queryRecipesPage({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    recipesCode: this.queryCond.recipesCode
                })
                .then((page) => {
                    this.totalRows = page.totalRows;
                    this.queryList = [];
                    page.values.forEach((item) => {
                        Vue.set(item, "formulas", [])
                        this.queryList.push(item)
                    })
                }).always(() => {
                    this.loadingState = false;
                })
        },
        search() {
            this.queryList = [];
            this.queryData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        edit(index, item) {
            this.$router.push({ path: "/recipesManagePage", query: { code: item && item.recipesCode } })
        },
        syncMenu() {
            this.loadingState = true;
            api.syncRecipes()
                .then(() => {
                    this.$message("同步菜单成功")
                }).always(() => {
                    this.loadingState = false;
                    this.queryData();
                })
        },
        expand(row, expanded) {
            if (expanded) {
                api.queryRecipesFormula(row.recipesCode)
                    .then((values) => {
                        row.formulas = values;
                    })
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