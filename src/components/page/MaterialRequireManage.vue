<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(v)=>{queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索条件"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="8">
                    <div style="position:relative; float:right; ">
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)" @select="handleSelect" :row-style="rowStyle">
            <el-table-column type="selection" width="55">
            </el-table-column>
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
        <el-row style="margin-top:20px;">
            <el-col :offset="6">
                <el-button type="primary" :disabled="selectItems.length==0" @click="submitSelectedData(1)">暂存</el-button>
                <el-button type="primary" :disabled="selectItems.length==0" @click="submitSelectedData(2)">提交采购</el-button>
            </el-col>
        </el-row>
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
            queryCond: {
                pageNo: 1,
                pageSize: 30,
                totalRows: 0,
                materialCode: '',
                cabinCode: '',
                searchKey: '',
                status: '0'
            },
            tableData: [],
            loadingState: false,
            userRole: this.$store.state.userRole,
            selectItems: []
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
                materialCode: this.queryCond.materialCode,
                status: this.queryCond.status
            }
            this.$store.commit("setQueryCond", p)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        formatRequireDate(row) {
            return util.formatDate(row.requireDate)
        },
        onSelectSpec(item, specCode) {
            item.specCodeSel && item.specCodeSel.forEach((it) => {
                if (it.specCode == specCode) {
                    Vue.set(item, 'specCode', it.specCode)
                    Vue.set(item, 'specUnit', it.specUnit)
                    Vue.set(item, 'specQty', it.transRate)
                    Vue.set(item, 'brandName', it.brandName)
                    Vue.set(item, 'homeplace', it.homeplace)
                }
            })
        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialRequire({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    cabinCode: this.queryCond.cabinCode,
                    status: this.queryCond.status,
                    searchKey:this.queryCond.searchKey
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
        rowStyle(row) {
            if (row.isSelected == true)
                return 'background:#E0E0E0'
        },
        handleSelect(sels, item) {
            this.selectItems = sels;
            Vue.set(item, 'isSelected', false)
            setTimeout(() => sels.forEach((it) => Vue.set(it, 'isSelected', true)), 0)
        },
        submitSelectedData(type) {
            api.handleRequire({
                requires: JSON.stringify(this.selectItems),
                handleType: type
            }).then((resp) => {
                this.$message("提交成功");
                this.queryData();
            }).fail((resp) => {
                this.$message.error(resp.message)
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

.bg-selected {
    background: red;
}
</style>