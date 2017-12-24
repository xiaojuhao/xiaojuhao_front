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
            <el-table :data="details" border style="width: 150%">
                <el-table-column prop="materialName" label="原料名称" width="200">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="130">
                </el-table-column>
                <el-table-column prop="cabinName" label="门店/仓库" width="130">
                </el-table-column>
                <el-table-column label="采购规格" width="100" :formatter="formatSpec">
                </el-table-column>
                <el-table-column label="采购数量" width="100" :formatter="formatPurchaseAmt">
                </el-table-column>
                <el-table-column label="实际入库" width="150" :formatter="formatRealAmt">
                </el-table-column>
                <el-table-column prop="specPrice" label="采购价" width="80">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="80">
                </el-table-column>
                <el-table-column label="生产日期" width="130" :formatter="formateProdDate">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button @click="onBack">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
export default {
    data: function() {
        return {
            applyNum: this.$route.query.applyNum,
            details: [],
            loadingState: false,
            splitMaterials: [],
            isShowMessage: false

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
        formatRealAmt(row){
            return row.realStockAmt+row.stockUnit;
        },
        onSubmit() {
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.details),
                applyNum: this.applyNum
            }
            api.confirmInventory(param)
                .then((resp) => {
                    this.$message.success("操作成功");
                    this.$router.go(-1)
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
        }
    },
    mounted() {
        api.queryInventoryApplyDetailByApplyNum(this.applyNum)
            .then((list) => {
                this.details = list;
            })
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