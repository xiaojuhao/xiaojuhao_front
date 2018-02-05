<template>
    <div>
        <div style="position:absolute;">
            <div class="handle-box">
                <el-select v-model="queryCond.paidStatus" style="width: 100px;" clearable placeholder="状态">
                    <el-option label="待支付" value="0"></el-option>
                    <el-option label="已支付" value="1"></el-option>
                </el-select>
                <el-select v-model="queryCond.payMode" style="width:100px" clearable placeholder="结账模式">
                    <el-option label="现结" value="ByInTime"></el-option>
                    <el-option label="周结" value="ByWeek"></el-option>
                    <el-option label="月结" value="ByMonth"></el-option>
                </el-select>
                <el-input v-model="queryCond.fromSrc" placeholder="供应商" style="width:130px"></el-input>
                <MyCabinSelect @input="(val)=>{this.queryCond.inCabinCode=val;}"></MyCabinSelect>
                <el-input v-model="queryCond.searchKey" placeholder="原料名称搜索" style="width:120px"></el-input>
                <el-date-picker v-model="startDate" type="date" placeholder="起始日期" style="width:130px">
                </el-date-picker>
                -
                <el-date-picker v-model="endDate" type="date" placeholder="结束日期" style="width:130px">
                </el-date-picker>
                <br/>
                <el-select v-model="queryCond.category" style="width:100px" clearable placeholder="分类">
                    <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                    </el-option>
                </el-select>
                <el-input v-model="queryCond.applyNum" placeholder="采购单号" style="width:200px"></el-input>
                <el-input v-model="queryCond.creatorSearch" placeholder="录入人" style="width:200px"></el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                <el-button type="primary" @click="download">
                    导出EXCEL
                </el-button>
            </div>
            <el-table :data="details" ref="tableRef" border style="width: 150%" :row-style="rowStyle" v-loading="loadingState" @select-all="handleSelectAll" @select="handleSelect" show-summary :summary-method="getSummaries">
                <el-table-column width="65" type="selection" :selectable="checkSelectable">
                </el-table-column>
                <el-table-column label="门店/仓库" width="150">
                    <template slot-scope="scope">
                        {{scope.row.cabinName}}
                    </template>
                </el-table-column>
                <el-table-column label="供应商/仓库" width="120">
                    <template slot-scope="scope">
                        {{scope.row.applyType=='purchase'?scope.row.supplierName:scope.row.fromCabinName}}
                    </template>
                </el-table-column>
                <el-table-column prop="materialName" label="原料名称" width="120">
                </el-table-column>
                <el-table-column prop="realSpecAmt" label="数量" width="100">
                    <template slot-scope="scope">
                        {{scope.row.realSpecAmt}} {{scope.row.specUnit}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="realStockAmt" label="食材库存" width="120">
                    <template slot-scope="scope">
                        {{scope.row.realStockAmt}} {{scope.row.stockUnit}}
                    </template>
                </el-table-column> -->
                <el-table-column prop="specPrice" label="单价" width="80">
                    <template slot-scope="scope">
                        {{scope.row.specPrice}}元
                    </template>
                </el-table-column>
                <el-table-column prop="basePrice" label="基价" width="80">
                    <template slot-scope="scope">
                        <font color="blue">{{scope.row.basePrice}}元</font>
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="100">
                    <template slot-scope="scope">
                        {{scope.row.totalPrice}} 元
                    </template>
                </el-table-column>
                <!-- <el-table-column label="类型" width="100" :formatter="formatApplyType">
                </el-table-column> -->
                <el-table-column label="支付状态" width="100">
                    <template slot-scope="scope">
                        <el-tag :type="formatPaidStatusType(scope.row)">{{formatPaidStatus(scope.row)}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="paidOperatorName" label="支付" width="100">
                </el-table-column>
                <!-- <el-table-column label="状态" width="100" :formatter="formatStatus">
                </el-table-column> -->
                <el-table-column prop="creatorName" label="录入" width="100">
                </el-table-column>
                <el-table-column prop="applyNum" label="单号" width="180">
                </el-table-column>
                <el-table-column label="支付时间" width="180" :formatter="formatePaidTime">
                </el-table-column>
                <el-table-column label="录入时间" width="180" :formatter="formateCreatedTime">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
                </el-pagination>
            </div>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="showMessage">确认支付</el-button>
                <span style="margin-right:20px"></span>
            </div>
        </div>
        <el-dialog :visible.sync="isShowMessage" title="确认入库信息">
            <el-table :data="selectedItems" style="width:100%" max-height="400" row-class-name="info-row">
                <el-table-column prop="materialName" label="原料名称" width="">
                </el-table-column>
                <el-table-column prop="supplierName" label="入库仓库">
                </el-table-column>
                <el-table-column label="总价">
                    <template slot-scope="scope">
                        {{scope.row.totalPrice}} 元
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 20px; margin-left: 30px;">
                数量: {{selectedItems.length}} 总金额:{{sumTotalPrice}}
            </div>
            <div style="margin-top: 10px; margin-left: 250px;">
                <el-button type="primary" @click="onSubmit">支 付</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="()=>{this.isShowMessage = false}">关 闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { api, util, config } from '../common/bus'
import Vue from 'vue'
import MyCabinSelect from '../common/MyCabinSelect'
export default {
    components: {
        MyCabinSelect
    },
    data: function() {
        return {
            queryCond: {
                totalRows: 0,
                pageSize: 20,
                pageNo: 1,
                fromSrc: '',
                applyNum: '',
                applyType: 'purchase', //只有采购单才会支付
                status: '2', //已入库
                paidStatus: '0', //默认查询出待支付的数据,
                category: '',
                payMode: ''
            },
            details: [],
            loadingState: false,
            isShowMessage: false,
            selectedItems: [],
            startDate: null,
            endDate: null,
            categorySel: []
        }
    },
    methods: {
        formatSpec(row) {
            if (row.specUnit != '无') {
                return row.specAmt + row.specUnit
            } else {
                return row.stockAmt + row.stockUnit
            }
        },
        formateCreatedTime(row) {
            return util.formatDateTime(row.gmtCreated)
        },
        formatePaidTime(row) {
            return util.formatDateTime(row.paidTime)
        },
        formatStatus(row) {
            switch (row.status) {
                case "0":
                    return "待提交";
                case "1":
                    return "待入库";
                case "2":
                    return "已入库";
                case "3":
                    return "作废"
            }
        },
        formatPaidStatus(row) {
            switch (row.paidStatus) {
                case "0":
                    return "未支付";
                case "1":
                    return "已支付";
                case "2":
                    return "支付失败";
                case "3":
                    return "无需支付";
            }
        },
        formatPaidStatusType(row) {
            if (row.paidStatus == "0") {
                return 'danger'
            }
            return 'gray'
        },
        formatApplyType(row) {
            switch (row.applyType) {
                case 'purchase':
                    return '采购单';
                case 'allocation':
                    return '调拨单';
                default:
                    return '未知'
            }
        },
        handleCurrentChange(pageNo) {
            this.queryCond.pageNo = pageNo;
            this.getData();
        },
        handleSelectAll(selectedItems) {
            this.selectedItems = selectedItems;
            this.reCalcSelected();
        },
        handleSelect(selectedItems, thisRow) {
            this.selectedItems = selectedItems;
            this.reCalcSelected();
        },
        checkSelectable(row, index) {
            return row.status == '2' && row.paidStatus == '0';
        },
        reCalcSelected() {
            this.details.forEach(it => Vue.set(it, 'isSelected', false))
            this.selectedItems.forEach(it => {
                Vue.set(it, 'isSelected', true && this.checkSelectable(it))
            })
        },
        checked() {
            setTimeout(() => {
                this.details.forEach((row) => {
                    this.$refs.tableRef.toggleRowSelection(row, !!row.isSelected);
                }, 0)
                this.reCalcSelected();
            })
        },
        getSummaries(param) {
            let { columns, data } = param;
            let sums = [];
            columns.forEach((col, idx) => {
                if (idx == 0) {
                    sums[idx] = "总价"
                }
                if (col.property == 'totalPrice') {
                    //计算统计值
                    sums[idx] = this.sumTotalPrice + "元";
                    return;
                }
                //sums[idx] = "N/A";
            })
            return sums;
        },
        onSubmit() {
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.selectedItems),
            }
            api.paidInventoryDetail(param)
                .then((resp) => {
                    this.$message.success("操作成功");
                    this.getData();
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
                .always(() => {
                    this.loadingState = false;
                })
        },
        onBack() {
            this.$router.go(-1)
        },
        showMessage() {
            this.isShowMessage = !this.isShowMessage
        },
        cancelMsg() {
            this.isShowMessage = false
        },
        rowStyle(row) {
            if (row.isSelected == true)
                return 'background:#E0E0E0'
        },
        download() {
            this.queryCond.startCreatedTime = util.formatDateT(this.startDate)
            this.queryCond.endCreatedTime = util.formatDateT(this.endDate)
            let param = Object.keys(this.queryCond).map((k) => k + "=" + this.queryCond[k]).join('&')
            window.open(config.server + "/inventoryApply/queryInventoryDetailPage?download=excel&" + param)
        },
        getData() {
            this.queryCond.startCreatedTime = util.formatDateT(this.startDate)
            this.queryCond.endCreatedTime = util.formatDateT(this.endDate)
            api.queryInventoryDetailPage(this.queryCond)
                .then((page) => {
                    this.details = page.values;
                    this.queryCond.totalRows = page.totalRows;
                    this.selectedItems = [];
                    this.details.forEach(it => {
                        let selecStatus = this.checkSelectable(it);
                        Vue.set(it, 'isSelected', selecStatus)
                        if (selecStatus) this.selectedItems.push(it)
                    })
                    this.checked();
                })
        },
        search() {
            this.getData();
        }
    },
    mounted() {
        this.getData();
        api.queryUnitByGroup('material_category').then((cates) => this.categorySel = cates);
    },
    computed: {
        sumTotalPrice() {
            let sum = this.selectedItems.reduce((sum, item) => {
                return sum + Number(item.totalPrice)
            }, 0)
            return sum.toFixed(2);
        }
    }
}
</script>
<style scoped>
.pagination {
    margin: 20px, 0;
    text-align: left;
}

.pop-message {
    position: fixed;
    top: 0px;
    width: 100%;
    height: 100%;
    z-index: 99998;
    background: gray;
}

.pop-message-sub {
    width: 60%;
    height: 75%;
    margin-left: 40px;
    z-index: 99999;
    background: white;
    border: solid 1px;
}

.info-row {
    background: red;
}
</style>