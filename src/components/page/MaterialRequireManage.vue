<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(v)=>{queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索条件"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>支持原料名称、配音搜索
                </el-col>
                <el-col :span="8">
                    <div style="position:relative; float:right; ">
                        <el-button round @click="edit()">增加原料</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="cabinName" label="仓库" width="150">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="150">
            </el-table-column>
            <!-- <el-table-column prop="materialCate" label="分类" width="100">
            </el-table-column> -->
            <el-table-column label="申请日期" width="120" :formatter="formatRequireDate">
            </el-table-column>
            <el-table-column label="需求量" width="100">
                <template slot-scope="scope">
                    {{scope.row.requireAmt}}{{scope.row.stockUnit}}
                </template>
            </el-table-column>
            <el-table-column label="采购规格" width="160">
                <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.specCode" slot="append" style="width:140px" @change="onSelectSpec(scope.row, scope.row.specCode)">
                        <el-option v-for="item in scope.row.specCodeSel" :key="item.specCode" :label="item.specName" :value="item.specCode">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="采购量" width="160">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.specAmt">
                        <template slot="append">{{scope.row.specUnit}}</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="采购价" width="160">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.specPrice">
                        <template slot="append">元/{{scope.row.specUnit}}</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="供应商" width="150">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.supplierCode" slot="append" style="width:140px">
                        <el-option v-for="item in scope.row.supplierSel" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="需求备注" width="120">
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
import MyCabinSelect from '../common/MyCabinSelect'
import Vue from 'vue'
export default {
    components: {
        MaterialSelection,
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
                cabinCode: '',
                searchKey: ''
            },
            userRole: this.$store.state.userRole
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
    },
    methods: {
        handleCurrentChange(val) {
            this.queryCond.pageNo = val;
            this.queryData();
        },
        keepParam() {
            let p = {
                pageNo: this.queryCond.pageNo,
                pageSize: this.queryCond.pageSize,
                totalRows: this.queryCond.totalRows,
                materialCode: this.queryCond.materialCode
            }
            this.$store.commit("setQueryCond", p)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        formatRequireDate(row) {
            return util.formatDate(row.requireDate)
        },
        formatSpec(row) {
            if (row.specUnit == '无') {
                return '无'
            }
            return row.specQty + row.stockUnit + "/" + row.specUnit;
        },
        onSelectSpec() {

        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialRequire({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    cabinCode:this.queryCond.cabinCode
                })
                .then((page) => {
                    this.tableData = page.values;
                    this.queryCond.totalRows = page.totalRows;
                    this.tableData.forEach((it) => { this.initItem(it) })
                }).fail((resp) => {
                    this.$message.error("请求出错")
                }).always((resp) => {
                    this.loadingState = false;
                })
        },
        initItem(item) {
            setTimeout(() => {
                //规格选项
                api.querySpecDetailByMaterialCode(item.materialCode)
                    .then((list) => {
                        if (list && list.length > 0) {
                            Vue.set(item, 'specCode', list[0].specCode)
                            Vue.set(item, 'specUnit', list[0].specUnit)
                            Vue.set(item, 'specQty', list[0].transRate)
                            Vue.set(item, 'brandName', list[0].brandName)
                            Vue.set(item, 'homeplace', list[0].homeplace)
                        }
                        Vue.set(item, 'specCodeSel', list)
                    })
                //供应商选项
                api.queryMaterialSupplerByCode({ materialCode: item.materialCode })
                    .then((list) => {
                        if (list && list.length > 0) {
                            Vue.set(item, 'supplierCode', list[0].supplierCode)
                        }
                        Vue.set(item, 'supplierSel', list)
                    })
            }, 0)
        },
        search() {
            this.tableData = [];
            this.queryData();
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