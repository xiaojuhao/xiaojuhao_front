<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 费用管理</el-breadcrumb-item>
                <el-breadcrumb-item>费用明细</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="0" v-loading="loadingState">
                <el-form-item>
                    <span class="span-title">
                        申请单号
                    </span>
                    <el-input disabled v-model="form.payNo" placeholder="自动生成"></el-input>
                    <span class="span-title">
                        申请部门
                    </span>
                    <el-select v-model="form.department">
                        <el-option v-for="item in mycabins" :key="item.cabinCode" :label="item.cabinName" :value="item.cabinCode"></el-option>
                    </el-select>
                    <span class="span-title">
                        申请单状态
                    </span>
                    <el-select disabled v-model="form.status" clearable placeholder="状态">
                        <el-option v-for="item in paymentStatusSels" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <span class="span-title">
                        费用类型
                    </span>
                    <el-select :disabled="isEditPage" v-model="form.type">
                        <el-option label="采购单" value="inventory"></el-option>
                        <el-option label="报销" value="reim"></el-option>
                        <el-option label="备用金" value="fund"></el-option>
                        <el-option label="付款申请" value="expense"></el-option>
                        <el-option label="工资" value="salary"></el-option>
                    </el-select>
                    <span class="span-title">
                        申请金额
                    </span>
                    <span class="span-content">
                        <el-input v-model="form.payables" style="width:120px;">
                            <template  slot="append">元</template>
                        </el-input>
                    </span>
                    <span class="span-title">
                        已付金额
                    </span>
                    <span class="span-content">
                        {{form.paidAmt}} 元
                    </span>
                </el-form-item>
                <el-form-item>
                    <div style="text-align:center; width: 60%;">
                        <el-button type="primary " @click="">提交</el-button>
                        <el-button type="primary " @click="onCancle">返回</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import config from '../common/config.vue'
import jquery from 'jquery'
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            form: {
                payNo: this.$route.query.payno,
                status: '0',
                payables: 0,
                paidAmt: 0
            },
            rules: {

            },
            loadingState: false,
            stockUnits: [],
            categorySel: [],
            mycabins: [],
            paymentStatusSels: []
        }
    },
    methods: {
        onCancle() {
            this.$router.go(-1)
        }
    },
    mounted() {
        if (this.$route.query.payno) {
            api.queryPaymentByPayNo(this.$route.query.id, this.$route.query.payno)
                .then((val) => {
                    Object.assign(this.form, val)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
        }
        api.queryMycabins()
            .then((list) => {
                this.mycabins = list;
            });
        api.queryUnitByGroup('payment_status').then((vals) => this.paymentStatusSels = vals);
    },
    computed: {
        isEditPage() {
            return !!this.$route.query.payno
        }
    }
}
</script>
<style scoped>
.form-box {
    width: 100%;
}

.span-title {
    display: -moz-inline-box;
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 10px;
}

.span-content {
    display: -moz-inline-box;
    display: inline-block;
    width: 200px;
}

.el-input {
    width: 200px;
}
</style>