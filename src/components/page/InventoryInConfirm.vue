<template>
    <div>
        <div style="position:absolute;">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                    <el-breadcrumb-item>入库</el-breadcrumb-item>
                    <el-breadcrumb-item>单号{{applyNum}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-table :data="details" border style="width: 150%" :row-style="rowStyle" v-loading="loadingState">
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isSelected" @change="doCheck" :disabled="scope.row.status!='1'">
                        </el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column prop="materialName" label="原料名称" width="150">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="130">
                </el-table-column>
                <el-table-column prop="cabinName" label="门店/仓库" width="130">
                </el-table-column>
                <el-table-column label="状态" width="100" :formatter="formatStatus">
                </el-table-column>
                <el-table-column label="采购数量" width="100" :formatter="formatSpec">
                </el-table-column>
                <el-table-column label="规格" width="120">
                    <template slot-scope="scope">
                        {{scope.row.transRate}}{{scope.row.stockUnit}}/{{scope.row.specUnit}}
                    </template>
                </el-table-column>
                <el-table-column label="利用率" width="100">
                    <template slot-scope="scope">
                        {{scope.row.utilizationRatio}}%
                    </template>
                </el-table-column>
                <el-table-column label="理论入库数量" width="150" :formatter="formatPurchaseAmt">
                </el-table-column>
                <el-table-column label="实际入库数量" width="150">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.realStockAmt">
                            <template slot="append">{{scope.row.stockUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="specPrice" label="采购价" width="80">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="80">
                </el-table-column>
                <el-table-column label="生产日期" width="130" :formatter="formateProdDate">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="showMessage">确认入库</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="onBack">返回</el-button>
            </div>
        </div>
        <el-dialog :visible.sync="isShowMessage" title="确认入库信息">
            <el-table :data="selectItems" style="width:100%" max-height="400" row-class-name="info-row">
                <el-table-column prop="materialName" label="原料名称" width="">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="">
                </el-table-column>
                <el-table-column label="规格数量" width="" :formatter="formatSpec">
                </el-table-column>
                <el-table-column prop="realStockAmt" label="接收数量" width="">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="onSubmit">确认提交</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="()=>{this.isShowMessage = false}">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
import Vue from 'vue'
export default {
    data: function() {
        return {
            applyNum: this.$route.query.applyNum,
            details: [],
            loadingState: false,
            splitMaterials: [],
            isShowMessage: false,
            selectItems: []

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
        formatPurchaseAmt(row) {
            return row.stockAmt + row.stockUnit
        },
        formateProdDate(row) {
            return util.formatDate(row.prodDate)
        },
        formatStatus(row) {
            switch (row.status) {
                case "0":
                    return "待提交";
                case "1":
                    return "待入库";
                case "2":
                    return "已入库";
            }
        },
        onSubmit() {
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.selectItems),
                applyNum: this.applyNum
            }
            api.confirmInventory(param)
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
            if (this.isShowMessage)
                this.isShowMessage = false;
            else
                this.isShowMessage = true;
        },
        cancelMsg() {
            this.isShowMessage = false
        },
        rowStyle(row) {
            if (row.isSelected == true)
                return 'background:#E0E0E0'
        },
        doCheck() {
            this.selectItems = [];
            this.details.forEach((it) => {
                if (it.isSelected) this.selectItems.push(it)
            })
        },
        getData() {
            api.queryInventoryApplyDetailByApplyNum(this.applyNum)
                .then((list) => {
                    this.details = list;
                    //将为入库的原料排到前面
                    list.sort((a, b) => {
                        if (a.status == '1') {
                            return 0;
                        } else {
                            return 1;
                        }
                    })
                    //设置选中状态
                    list.forEach((it) => {
                        Vue.set(it, 'isSelected', false)
                    })
                })
        }
    },
    mounted() {
        this.getData();
    }
}
</script>
<style scoped>
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