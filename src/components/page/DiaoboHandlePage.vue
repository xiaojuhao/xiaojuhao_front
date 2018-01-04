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
                <el-table-column prop="materialName" label="原料名称" width="150">
                </el-table-column>
                <el-table-column prop="cabinName" label="拨入单位" width="130">
                </el-table-column>
                <el-table-column prop="fromCabinName" label="拨出单位" width="130">
                </el-table-column>
                <el-table-column label="拨出数量" width="100" :formatter="formatStockAmt">
                </el-table-column>
                <el-table-column label="实际入库数量" width="130">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.realStockAmt">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注" width="200">
                </el-table-column>
                <el-table-column label="操作日期" width="130" :formatter="formatCreateDate">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="showMessage">确认入库</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="onBack">取消</el-button>
            </div>
        </div>
        <el-dialog :visible.sync="isShowMessage" title="确认入库信息">
            <el-table :data="details" style="width:100%" max-height="400" row-class-name="info-row">
                <el-table-column prop="materialName" label="原料名称" width="">
                </el-table-column>
                <el-table-column label="拨出数量" width="" :formatter="formatStockAmt">
                </el-table-column>
                <el-table-column prop="realStockAmt" label="实际入库数量" width="">
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" @click="onSubmit">确认提交</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="()=>{this.isShowMessage = false}">取消</el-button>
            </div>
        </el-dialog>
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
        formatStockAmt(row) {
            return row.stockAmt + row.stockUnit
        },
        formatPurchaseAmt(row) {
            return row.stockAmt + row.stockUnit
        },
        formatCreateDate(row) {
            return util.formatDate(row.gmtCreated)
        },
        onSubmit() {
            this.isShowMessage = false;
            this.loadingState = true;
            let param = {
                dataJson: JSON.stringify(this.details),
                applyNum: this.applyNum
            }
            api.confirmDiaobo(param)
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
    top: 80px;
    width: 100%;
    height: 100%;
    z-index: 99998;
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