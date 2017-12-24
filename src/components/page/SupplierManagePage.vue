<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>供应商管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px" v-loading="loadingState">
                <el-form-item label="供应商名称">
                    <el-input v-model="form.supplierName" placeholder="供应商名称"></el-input>
                </el-form-item>
                <el-form-item label="简称">
                    <el-input v-model="form.shortName" placeholder="简称"></el-input>
                </el-form-item>
                <el-form-item label="供应商代码">
                    <el-input disabled v-model="form.supplierCode" placeholder="供应商代码"></el-input>
                </el-form-item>
                <el-form-item label="供应商地址">
                    <el-input v-model="form.supplierAddr" placeholder="供应商手机"></el-input>
                </el-form-item>
                <el-form-item label="供应商手机">
                    <el-input v-model="form.supplierPhone" placeholder="供应商手机"></el-input>
                </el-form-item>
                <el-form-item label="供应商电话">
                    <el-input v-model="form.supplierTel" placeholder="供应商电话"></el-input>
                </el-form-item>
                <el-form-item label="供应商邮箱">
                    <el-input v-model="form.supplierEmail" placeholder="供应商邮箱"></el-input>
                </el-form-item>
                <el-form-item label="有效性">
                    <el-select v-model="form.status" placeholder="有效性">
                        <el-option label="有效" value="1"></el-option>
                        <el-option label="无效" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结账模式">
                    <el-select v-model="form.payMode" style="width:150px" placeholder="请选择">
                        <el-option label="现结" value="ByInTime"></el-option>
                        <el-option label="周结" value="ByWeek"></el-option>
                        <el-option label="月结" value="ByMonth"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付方式">
                    <template>
                        <el-radio-group v-model="form.payWay">
                            <el-radio label="alipay">支付宝</el-radio>
                            <el-radio label="weixin">微信</el-radio>
                            <el-radio label="bank">银行</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="银行信息">
                    <el-input v-model="form.bankName" placeholder="银行名称" ></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="开户行">
                    <el-input v-model="form.depositBank" placeholder="开户行" ></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="银行账户">
                    <el-input v-model="form.bankAccount" placeholder="银行账户" ></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="收款人">
                    <el-input v-model="form.bankAccountName" placeholder="收款人" ></el-input>
                </el-form-item>
                <el-form-item  v-if="form.payWay=='alipay'" label="支付宝账号">
                    <el-input v-model="form.alipayAccount" placeholder="支付宝账号"></el-input>
                </el-form-item>
                <el-form-item  v-if="form.payWay=='alipay'" label="支付宝收款人">
                    <el-input v-model="form.alipayAccountName" placeholder="支付宝收款人"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='weixin'" label="微信账号">
                    <el-input v-model="form.weixinAccount" placeholder="微信账号"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='weixin'" label="微信收款人">
                    <el-input v-model="form.weixinAccountName" placeholder="微信收款人"></el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" placeholder="备注信息"></el-input>
                </el-form-item>
                <el-form-item label="供应原料">
                    <el-row :gutter="5">
                        <el-col :span="12"><span class="span-center">原料</span></el-col>
                        <el-col :span="3"><span class="span-center">操作</span></el-col>
                    </el-row>
                    <el-row v-for="(ff,index) in materials" :key="ff.materialCode" :gutter="5">
                        <el-col :span="12">
                            <MaterialSelection :value="ff.materialCode" :context="ff" :excludes="addedMaterials" v-on:input="materialSelCallback">
                            </MaterialSelection>
                        </el-col>
                        <el-col :span="3">
                            <div class="grid-content">
                                <el-button icon="delete" size="small" @click="removeMaterials(index)"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button type="success" @click="addMaterialItem">增加原料</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
import MaterialSelection from '../common/MaterialSelection'
export default {
    data: function() {
        return {
            form: {
                supplierCode: this.$route.query.supplierCode,
                supplierName: '',
                shortName: '',
                supplierTel: '',
                supplierPhone: '',
                supplierEmail: '',
                payWay: 'alipay',
                bankName:'',
                payMode: '',
                payAccount: '',
                materialJson: '',
                remark:'',
                status:''
            },
            materials: [],
            loadingState: false
        }
    },
    methods: {
        onSubmit() {
            this.form.materialJson = JSON.stringify(this.materials);
            
            api.saveSupplierInfo(this.form)
                .then((val) => {
                    this.form.supplierCode = val.supplierCode;
                    this.$message("提交成功")
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        removeMaterials(index) {
            this.materials.splice(index, 1)
        },
        addMaterialItem() {
            this.materials.push({
                materialCode: ''
            })
        },
        materialSelCallback(val, ctx) {
            let item = this.$store.getters.allMaterialsMap.get(val)
            Object.keys(item).forEach((key) => {
                ctx[key] = item[key]
            })
            ctx.materialUnit = item.stockUnit;
        }
    },
    mounted() {
        api.querySupplierByCode(this.form.supplierCode)
            .then((sp) => {
                Object.assign(this.form,sp);
            });
        api.queryMaterialSupplerByCode({
            supplierCode: this.form.supplierCode
        }).then((values) => {
            values.forEach((item) => {
                this.materials.push({ materialCode: item.materialCode })
            })
        })
    },
    computed: {
        addedMaterials() {
            let ll = [];
            this.materials.forEach((item) => ll.push(item.materialCode))
            return ll;
        }
    },
    components: {
        MaterialSelection
    }
}
</script>
<style scoped>
.span-center {
    display: inline-block;
    width: 100%;
    font-weight: bold;
}

.grid-content {
    min-height: 1px;
}

.el-row {
    margin-bottom: 4px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}
</style>