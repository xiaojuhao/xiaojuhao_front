<template>
    <div>
        <div style="position:absolute;">
            <div class="handle-box" style="margin-bottom: 5px;">
                <el-select v-model="queryCond.applyType" style="width: 100px;" placeholder="类型">
                    <el-option label="采购单" value="purchase"></el-option>
                    <el-option label="调拨单" value="allocation"></el-option>
                </el-select>
                <el-select v-model="queryCond.status" style="width: 100px;" clearable placeholder="状态">
                    <el-option label="待入库" value="1"></el-option>
                    <el-option label="已入库" value="2"></el-option>
                </el-select>
                <el-select v-model="queryCond.category" style="width:100px" clearable placeholder="分类">
                    <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                    </el-option>
                </el-select>
                <el-input v-model="queryCond.fromSrc" placeholder="供应商或拨出仓库" style="width:130px"></el-input>
                <MyCabinSelect @input="(val)=>{this.queryCond.inCabinCode=val;}"></MyCabinSelect>
                <el-input v-model="queryCond.searchKey" placeholder="原料名称搜索" style="width:120px"></el-input>
                <el-date-picker v-model="startDate" type="date" placeholder="起始日期" style="width:130px">
                </el-date-picker>
                -
                <el-date-picker v-model="endDate" type="date" placeholder="结束日期" style="width:130px">
                </el-date-picker>
                <br/>
                <el-input v-model="queryCond.applyNum" size="small" placeholder="采购单号" style="width:200px">
                </el-input>
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <el-table :data="details" ref="tableRef" border style="width: 150%" :row-style="rowStyle" v-loading="loadingState" @select-all="handleSelectAll" @select="handleSelect">
                <el-table-column width="65" type="selection">
                </el-table-column>
                <el-table-column label="门店/仓库" width="120">
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
                <el-table-column prop="realSpecAmt" label="数量" width="130">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.realSpecAmt" @change="onSpecAmtChange(scope.row)">
                            <template slot="append">{{scope.row.specUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="specPrice" label="单价" width="130">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.specPrice" @change="specPriceChg(scope.row)">
                            <template slot="append">元</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="130">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.totalPrice">
                            <template slot="append">元</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="realStockAmt" label="食材库存" width="130">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.realStockAmt">
                            <template slot="append">{{scope.row.stockUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="类型" width="100" :formatter="formatApplyType">
                </el-table-column>
                <el-table-column label="状态" width="100" :formatter="formatStatus">
                </el-table-column>
                <el-table-column label="录入时间" width="180" :formatter="formateCreatedTime">
                </el-table-column>
                <el-table-column prop="creatorName" label="录入人" width="100">
                </el-table-column>
                <el-table-column prop="confirmUserName" label="入库人" width="100">
                </el-table-column>
                <el-table-column label="入库时间" width="180" :formatter="formateConfirmTime">
                </el-table-column>
                <el-table-column prop="applyNum" label="单号" width="180">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
                </el-pagination>
            </div>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="onSubmit">修正数据</el-button>
            </div>
        </div>
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
                applyType: 'purchase',
                status: '1',
                startCreatedTime: null,
                endCreatedTime: null,
                category: '',
                applyNum: ''
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
        formateConfirmTime(row) {
            return util.formatDateTime(row.confirmTime)
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
        },
        handleSelect(selectedItems, thisRow) {
            this.selectedItems = selectedItems;
        },
        onSubmit() {
            if (this.selectedItems.length == 0) {
                this.$message.error("请选择记录")
                return;
            }
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.selectedItems),
            }
            api.modifyInventoryDetail(param)
                .then((resp) => {
                    this.$message.success("修改成功");
                    this.getData();
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
                .always(() => {
                    this.loadingState = false;
                })
        },
        rowStyle(row) {
            if (row.isSelected == true)
                return 'background:#E0E0E0'
        },
        onSpecAmtChange(row) {
            let realStockAmt = row.realSpecAmt * row.transRate * row.utilizationRatio / 100;
            Vue.set(row, 'realStockAmt', realStockAmt)
            this.specPriceChg(row)
        },
        specPriceChg(row) {
            let totalPrice = Math.ceil(row.realSpecAmt * row.specPrice);
            Vue.set(row, 'totalPrice', totalPrice)
        },
        getData() {
            this.queryCond.startCreatedTime = util.formatDateT(this.startDate)
            this.queryCond.endCreatedTime = util.formatDateT(this.endDate)
            api.queryInventoryDetailPage(this.queryCond)
                .then((page) => {
                    this.details = page.values;
                    this.queryCond.totalRows = page.totalRows;
                    this.selectedItems = [];
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