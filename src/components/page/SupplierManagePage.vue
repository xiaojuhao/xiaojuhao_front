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
                <el-form-item label="全称">
                    <el-input v-model="form.supplierFullName" placeholder="供应商全称"></el-input>
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
                    <el-input v-model="form.bankName" placeholder="银行名称"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="开户行">
                    <el-input v-model="form.depositBank" placeholder="开户行"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="银行账户">
                    <el-input v-model="form.bankAccount" placeholder="银行账户"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='bank'" label="收款人">
                    <el-input v-model="form.bankAccountName" placeholder="收款人"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='alipay'" label="支付宝账号">
                    <el-input v-model="form.alipayAccount" placeholder="支付宝账号"></el-input>
                </el-form-item>
                <el-form-item v-if="form.payWay=='alipay'" label="支付宝收款人">
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
                    <el-row>
                        <el-col>
                            <span class="span-material" v-for="item in selectedMaterials" :key="item.materialCode">
                                {{item.materialName}}
                            </span>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-button size="small" :type="showMaterialsButton.type" @click="showMaterials">{{showMaterialsButton.title}}</el-button>
                            <el-radio-group v-if="isShowMaterials"  v-model="category" size="small" @change="selectCatagory">
                                <el-radio-button v-for="c in categorySel" :key="c.unitCode" :label="c.unitCode" >
                                </el-radio-button>
                            </el-radio-group>
                            <el-checkbox v-if="isShowMaterials"  v-model="isSelectAllChecked" @change="selectAll">全选</el-checkbox>
                        </el-col>
                    </el-row>
                    <el-row v-if="isShowMaterials" >
                        <el-col>
                            <el-checkbox v-for="item in filteredMaterials" :key="item.id" v-model="item.isSelected">
                                {{item.materialName}}
                            </el-checkbox>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button @click="onCancel">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
import MaterialSelection from '../common/MaterialSelection'
import Vue from 'vue'
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
                bankName: '',
                payMode: '',
                payAccount: '',
                materialJson: '',
                remark: '',
                status: ''
            },
            allMaterials: [],
            loadingState: false,
            categorySel: [],
            category: '',
            isShowMaterials: false,
            isSelectAllChecked : false,
            showMaterialsButton: {
                title: '显示原料',
                type: 'success'
            }

        }
    },
    methods: {
        onSubmit() {
            let materials = [];
            this.selectedMaterials.forEach((it) => {
                materials.push({ materialCode: it.materialCode })
            })
            this.form.materialJson = JSON.stringify(materials);
            api.saveSupplierInfo(this.form)
                .then((val) => {
                    Object.assign(this.form, val);
                    this.$message("保存成功")
                    //this.$router.go(-1)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        showMaterials() {
            if (this.isShowMaterials) {
                this.isShowMaterials = false;
                this.showMaterialsButton.title = "显示原料";
                this.showMaterialsButton.type = "success"
            } else {
                this.isShowMaterials = true;
                this.showMaterialsButton.title = "隐藏原料";
                this.showMaterialsButton.type = "danger";
            }
        },
        querySuppliedMaterials() {
            //查询供应商已经供应的原材料
            api.queryMaterialSupplerByCode({
                supplierCode: this.form.supplierCode
            }).then((values) => {
                let map = new Map();
                values.forEach((it) => {
                    map.set(it.materialCode, it)
                })
                //将已经供应的原材料的isSelected设置为true
                this.allMaterials.forEach((it) => {
                    if (map.get(it.materialCode)) {
                        Vue.set(it, 'isSelected', true)
                    }
                })
            });
        },
        selectCatagory(){
            this.isSelectAllChecked = false;
        },
        selectAll(cb){
            var checked = cb.target.checked;
            this.filteredMaterials.forEach(it=>{
                Vue.set(it,'isSelected', checked)
            })
        }
    },
    mounted() {
        //供应商信息
        api.querySupplierByCode(this.form.supplierCode)
            .then((sp) => {
                Object.assign(this.form, sp);
            });
        //所有原材料信息，供用户选择
        api.queryAllMaterials()
            .then((page) => {
                this.allMaterials = page.values;
                this.allMaterials.forEach((it) => Vue.set(it, 'isSelected', false))
                //供应商供应原材料信息
                this.querySuppliedMaterials();
            }).fail((resp) => {
                this.$message.error(resp.message)
            })
        //原料的分类配置信心
        api.queryUnitByGroup('material_category').then((cates) => {
            this.categorySel = cates;
            this.category = cates[0].unitCode;
        })
    },
    computed: {
        filteredMaterials() {
            return this.allMaterials.filter((it) => {
                this.isSelectAll = this.isSelectAll && it.isSelected; //计算全部选中状态
                if (this.category && it.category == this.category) {
                    return true;
                } else {
                    return false;
                }
            })
        },
        selectedMaterials() {
            return this.allMaterials.filter((it) => {
                return it.isSelected
            })
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

.span-material {
    margin-right: 6px;
}
.form-box {
    width: 100%;
}
.el-input {
    width: 50%;
}
</style>