<template>
    <div class="container">
        <div class="table subdiv" v-loading="loadingState" element-loading-text="处理中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <div class="handle-box">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <!-- <RecipesSelection @input="(v)=>{this.queryCond.recipesCode=v;}"></RecipesSelection> -->
                        <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索菜品名称或拼音"></el-input>
                        <el-select v-model="queryCond.hadFormula" style="width:160px" clearable placeholder="配料完善状态">
                            <el-option label="已完善" value="Y"></el-option>
                            <el-option label="未完善" value="N"></el-option>
                        </el-select>
                        <el-button type="primary" icon="search" @click="search">查询</el-button>
                    </el-col>
                    <el-col :span="7">
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
                <el-table-column prop="hadFormula" label="是否已完善配料" width="150">
                </el-table-column>
                <el-table-column prop="src" label="来源" width="150"></el-table-column>
                <el-table-column label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="edit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
                </el-pagination>
            </div>
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
            loadingState: false,
            isShowMessage: false,
            queryCond: {
                pageNo: 1,
                pageSize: 10,
                totalRows: 0,
                recipesCode: '',
                hadFormula: '',
                searchKey: ''
            },
            queryList: []
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;
            this.queryData();
        },
        keepParam() {
            let p = {
                pageNo: this.queryCond.pageNo,
                pageSize: this.queryCond.pageSize,
                totalRows: this.queryCond.totalRows,
                recipesCode: this.queryCond.recipesCode,
                hadFormula: this.queryCond.hadFormula
            }
            this.$store.commit("setQueryCond", p)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        queryData() {
            this.loadingState = true;
            api.queryRecipesPage({
                    pageNo: this.queryCond.pageNo,
                    pageSize: this.queryCond.pageSize,
                    recipesCode: this.queryCond.recipesCode,
                    hadFormula: this.queryCond.hadFormula,
                    searchKey: this.queryCond.searchKey
                })
                .then((page) => {
                    this.queryCond.totalRows = page.totalRows;
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
        handleSelect(item) {
            this.$data.query.name = item.value;
        },
        edit(item) {
            this.keepParam();
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
        },
        closeChart() {
            this.isShowMessage = false;
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

.container {
    position: relative;
}

.subdiv {
    position: absolute;
}

.chart-div {
    background: gray;
    border: 0;
}
</style>