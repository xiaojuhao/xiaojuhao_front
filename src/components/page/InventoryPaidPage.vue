<template>
    <div>
        <div style="position:absolute;">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                    <el-breadcrumb-item>采购单支付</el-breadcrumb-item>
                    <el-breadcrumb-item>{{applyNum}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <el-form ref="form" label-width="90px" v-loading="loadingState">
                <el-form-item label="门店/仓库">
                    {{apply.cabinName}}
                </el-form-item>
                <el-form-item label="供应商">
                    {{supplier.supplierName}}
                </el-form-item>
                <el-form-item label="应付金额">
                    {{apply.payables}}元
                </el-form-item>
                <el-form-item label="实付金额">
                    <el-input v-model="apply.paidAmt" style="width:150px">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                </el-form-item>
                <el-form-item label="支付方式">
                    <el-radio-group v-model="apply.paidWay" disabled>
                        <el-radio label="alipay">支付宝</el-radio>
                        <el-radio label="weixin">微信</el-radio>
                        <el-radio label="bank">银行</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-show="apply.paidWay == 'bank'" label="银行名称">
                    {{apply.paytoBank}}
                </el-form-item>
                <el-form-item label="收款账户">
                    {{apply.paytoAccount}}
                </el-form-item>
                <el-form-item label="收款人">
                    {{apply.paytoAccountName}}
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="apply.paidRemark"></el-input>
                </el-form-item>
            </el-form>
            <div style="margin-top: 10px; margin-left: 300px;">
                <el-button type="primary" v-show="apply.paidStatus == '0'" @click="comfirmPay">确认支付</el-button>
                <span style="margin-right:20px"></span>
                <el-button @click="onBack">取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import { api, util } from '../common/bus'
import Vue from 'vue'
export default {
    data: function() {
        return {
            applyNum: this.$route.query.applyNum,
            apply: {},
            applyDetails: [],
            supplier: {},
            loadingState: false,
        }
    },
    methods: {
        initSupplier() {
            api.querySupplierByCode(this.apply.supplierCode)
                .then((sp) => {
                    this.supplier = sp;
                    Vue.set(this.apply, 'paidWay', sp.payWay)
                    if (sp.payWay == 'bank') {
                        Vue.set(this.apply, 'paytoBank', sp.bankName)
                        Vue.set(this.apply, 'paytoAccount', sp.bankAccount)
                        Vue.set(this.apply, 'paytoAccountName', sp.bankAccountName)
                    }
                    if (sp.payWay == 'alipay') {
                        Vue.set(this.apply, 'paytoAccount', sp.alipayAccount)
                        Vue.set(this.apply, 'paytoAccountName', sp.alipayAccountName)
                    }
                    if (sp.payWay == 'weixin') {
                        Vue.set(this.apply, 'paytoAccount', sp.weixinAccount)
                        Vue.set(this.apply, 'paytoAccountName', sp.weixinAccountName)
                    }
                    //默认设置支付金额为应付款额
                    this.apply.paidAmt = this.apply.payables;
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
        },
        comfirmPay() {
            let self = this;
            this.$confirm('是否确认提交支付信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.paidInventory();
            }).catch(() => {
                //取消
            });
        },
        paidInventory() {
            this.loadingState = true;
            api.paidInventory(this.apply)
                .then((resp) => {
                    this.$message.success("操作成功");
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onBack() {
            this.$router.go(-1)
        }
    },
    mounted() {
        api.queryInventoryApplyPage({
            applyNum: this.applyNum
        }).then((page) => {
            this.apply = page.values[0];
            this.initSupplier();
        }).fail((resp) => {
            this.$message.error(resp.message)
        })
        api.queryInventoryApplyDetailByApplyNum(this.applyNum)
            .then((list) => {
                this.applyDetails = list;
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