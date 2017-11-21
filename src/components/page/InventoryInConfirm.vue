<template>
    <div>
        <div style="position:absolute;">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                    <el-breadcrumb-item>入库</el-breadcrumb-item>
                    <el-breadcrumb-item>采购单{{ordernum}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-table :data="details" border style="width: 150%">
                <el-table-column prop="materialName" label="原料名称" width="200">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="130">
                </el-table-column>
                <el-table-column prop="cabinName" label="门店/仓库" width="130">
                </el-table-column>
                <el-table-column label="规格数量" width="100" :formatter="formatSpec">
                </el-table-column>
                <el-table-column label="采购数量" width="100" :formatter="formatPurchaseAmt">
                </el-table-column>
                <el-table-column label="接收数量" width="150">
                    <template scope="scope">
                        <el-input size="small" v-model="scope.row.realStockAmt">
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
                <el-button @click="onBack">取消</el-button>
            </div>
        </div>
        <div v-if="isShowMessage" class="pop-message">
            <div class="pop-message-sub">
                <el-table :data="details" style="width:100%" max-height="400">
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
                    <el-button @click="()=>{this.isShowMessage = false}">取消</el-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
export default {
    data: function() {
        return {
            ordernum: this.$route.query.ordernum,
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
                return '无'
            }
        },
        formatPurchaseAmt(row) {
            return row.stockAmt + row.stockUnit
        },
        formateProdDate(row) {
            return util.formatDate(row.prodDate)
        },
        onSubmit() {
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.details),
                orderNum: this.ordernum
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
        api.queryPurchaseOrderDetailByOrderNum(this.ordernum)
            .then((list) => {
                this.details = list;
            })
    }
}
</script>
<style scoped>
.pop-message {
    position: fixed;
    top: 80px;
    width: 100%;
    height: 100%;
    z-index: 99998;
    border: solid 1px;
}

.pop-message-sub {
    width: 80%;
    height: 90%;
    z-index: 99999;
    background: white;
}
</style>