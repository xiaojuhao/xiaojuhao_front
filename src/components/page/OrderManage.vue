<template>
    <div class="table" v-loading="loadingState2" element-loading-text="正在同步" element-loading-spinner="el-icon-loading">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>销售订单信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-input v-model="searchKey" placeholder="菜单名称或拼音或编码" style="width:150px"></el-input>
            <MyStoreSelect @input="(v)=>{this.storeCode=v}"></MyStoreSelect>
            <el-date-picker v-model="saleDateStart" type="date" placeholder="起始日期" style="width:130px">
            </el-date-picker>
            -
            <el-date-picker v-model="saleDateEnd" type="date" placeholder="结束日期" style="width:130px">
            </el-date-picker>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
            <div style="position:relative; float:right; ">
                <el-button round @click="syncSaleData">同步数据</el-button>
                <el-date-picker v-model="syncDate" type="date" placeholder="同步日期" style="width:130px">
                </el-date-picker>
            </div>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="storeName" label="门店" width="160">
            </el-table-column>
            <el-table-column prop="recipesName" label="菜品" width="160">
            </el-table-column>
            <el-table-column prop="saleDate" label="销售时间" width="120" :formatter="formatSaleDate">
            </el-table-column>
            <el-table-column prop="saleNum" label="销售数量" width="100">
            </el-table-column>
            <el-table-column prop="totalPrice" label="总价" width="200">
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="100">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="180">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="showMaterialDetail(scope.row)">原料详情</el-button>
                    <el-button size="small" type="primary" @click="saleChart(scope.row)">折线图</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="pageNo" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
        <el-dialog :title="dialogTitle" v-model="dialogOrderMaterialShow" class="dialog">
            <el-table :data="orderMaterials" border>
                <el-table-column prop="materialName" label="原料名称">
                </el-table-column>
                <el-table-column label="消耗数量">
                    <template <template slot-scope="scope">
                        {{scope.row.materialTotalAmt}}{{scope.row.materialUnit}}
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                    <template <template slot-scope="scope">
                        {{scope.row.recipesName}}{{scope.row.saleNum}}份
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
import StoreSelection from '../common/StoreSelection'
import RecipesSelection from '../common/RecipesSelection'
import MyStoreSelect from '../common/MyStoreSelect'
export default {
    components: {
        StoreSelection,
        RecipesSelection,
        MyStoreSelect
    },
    data() {
        return {
            tableData: [],
            pageNo: 1,
            pageSize: 10,
            totalRows: 0,
            storeCode: '',
            saleDateStart: new Date(),
            saleDateEnd: new Date(),
            syncDate: null,
            recipesCode: '',
            loadingState: false,
            loadingState2: false,
            dialogOrderMaterialShow: false,
            dialogTitle: '',
            orderMaterials: [],
            searchKey: ''
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;
            this.getData();
        },
        formatSaleDate(row) {
            return util.formatDate(row.saleDate)
        },
        keepParam() {
            let p = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
                totalRows: this.totalRows,
                recipesCode: this.recipesCode,
                saleDateStart: this.saleDateStart,
                saleDateEnd: this.saleDateEnd,
                searchKey: this.searchKey
            }
            this.$store.commit("setQueryCond", p)
        },
        loadParam() {
            Object.assign(this.$data, this.$store.state.queryCond)
        },
        getData() {
            this.loadingState = true;
            api.queryWmsOrder({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    storeCode: this.storeCode,
                    recipesCode: this.recipesCode,
                    saleDateStart: util.parseDate(this.saleDateStart),
                    saleDateEnd: util.parseDate(this.saleDateEnd),
                    searchKey: this.searchKey
                })
                .then((page) => {
                    this.tableData = page.values;
                    this.totalRows = page.totalRows;
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always((resp) => {
                    this.loadingState = false;
                })
        },
        syncSaleData() {
            this.loadingState2 = true;
            api.syncOrders({
                date: util.parseDate(this.syncDate)
            }).then((val) => {
                this.$message("同步成功")
                this.saleDateStart = this.syncDate;
                this.saleDateEnd = this.syncDate;
                this.getData();
            }).fail((resp) => {
                this.$message.error(resp.message)
            }).always(() => {
                this.loadingState2 = false;
            })
        },
        search() {
            this.pageNo = 1;
            this.tableData = [];
            this.getData();
        },
        saleChart(item) {
            this.keepParam();
            this.$router.push({
                path: "/recipesDailyChart",
                query: {
                    code: item.recipesCode,
                    store: item.storeCode
                }
            })
        },
        showMaterialDetail(item) {
            this.dialogOrderMaterialShow = true;
            this.dialogTitle = "原料明细-" + item.storeName + "-" + item.recipesName
            api.queryOrderMaterials({
                orderId: item.id,
                recipesCode: item.recipesCode,
                storeCode: item.storeCode
            }).then((list) => {
                this.orderMaterials = list;
            })
        }
    },
    mounted() {
        this.loadParam();
        this.getData();
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

.dialog {
    width: 100%;
}
</style>