<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(v)=>{this.queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="原料名称或配音"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="materialName" label="原料名称" width="200">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="200">
            </el-table-column>
            <el-table-column prop="warningValue1" label="闲时预警">
            </el-table-column>
            <el-table-column prop="warningValue2" label="忙时预警">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showWarningSetPage(scope.$index, scope.row)">
                        设置预警
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
            </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" v-model="dialogWaringSetShow" class="dialog">
            <el-form label-width="90px" v-loading="loadingState">
                <el-form-item label="原料名称">{{material.materialName}}</el-form-item>
                <el-form-item label="仓库">{{material.cabinName}}
                </el-form-item>
                <el-form-item label="闲时预警值">
                    <el-input size="small" v-model="material.warningValue1" style="width:100px">
                        <template slot="append">{{material.stockUnit}}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="忙时预警值">
                    <el-input size="small" v-model="material.warningValue2" style="width:100px">
                        <template slot="append">{{material.stockUnit}}</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div style="text-align:center;margin-top:10px;">
                <el-button size="small" type="primary" @click="saveWaringValue">
                    保存预警设置
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { api } from '../common/bus'
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
            queryList: [],
            userRole: this.$store.state.userRole,
            dialogWaringSetShow: false,
            dialogTitle: '预警设置',
            material: {}
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
        formatStorageLife(row) {
            let re = /(\d+)(\w)/ig;
            let r = re.exec(row.storageLife);
            let ret = "";
            if (r) {
                ret = r[1];
                switch (r[2]) {
                    case "D":
                        ret = ret + "天";
                        break;
                    case "M":
                        ret = ret + "月";
                        break;
                }
            }
            return ret;
        },
        formatSpec(row) {
            if (row.specUnit == '无') {
                return '无'
            }
            return row.specQty + row.stockUnit + "/" + row.specUnit;
        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialsStockPage({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    cabinCode: this.queryCond.cabinCode,
                    searchKey: this.queryCond.searchKey,
                    status: '1'
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
        showWarningSetPage(index, item) {
            this.dialogWaringSetShow = true;
            this.material = item;
        },
        saveWaringValue() {
            api.saveWarning(this.material)
                .then((resp) => {
                    this.$message("设置成功")
                    setTimeout(() => { this.dialogWaringSetShow = false; }, 500)
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
</style>