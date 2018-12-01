<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px" v-loading="loadingState" element-loading-text="数据加载中。。。">
                <el-form-item label="原料名称" style="width:60%">
                    <el-input v-model="form.materialName"></el-input>
                </el-form-item>
                <el-form-item label="原料编码" style="width:60%">
                    <el-input disabled v-model="form.materialCode" placehoder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="默认利用率" style="width:60%">
                    <el-slider v-model="form.utilizationRatio" :min="0" :max="100" :show-input="true"></el-slider>
                </el-form-item>
                <el-form-item label="保质期">
                    <el-input v-model="form.storageLifeNum" style="width:160px">
                        <el-select v-model="form.storageLifeUnit" slot="append" style="width:80px" placeholder="请选择">
                            <el-option label="天" value="D"></el-option>
                            <el-option label="月" value="M"></el-option>
                        </el-select>
                    </el-input>
                    <span class="span-title" style="text-align:right;margin-right:10px; width:40px;">
                        分类
                    </span>
                    <el-select v-model="form.category" style="width:80px" placeholder="请选择">
                        <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                    <span class="span-title" style="text-align:right;margin-right:10px;">
                        库存单位
                    </span>
                    <el-select v-model="form.stockUnit" style="width:80px" placeholder="请选择">
                        <el-option v-for="item in stockUnits" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预警下限系数">
                    <el-input size="small" v-model="form.warningCoeffient1" style="width:150px">
                    </el-input>
                    <span class="span-title" style="text-align:right;margin-right:10px; width:120px;">
                        预警上限系数
                    </span>
                    <el-input size="small" v-model="form.warningCoeffient2" style="width:150px">
                    </el-input>
                </el-form-item>
                <!-- 供应商管理 -->
                <el-form-item label="供应商">
                    <el-button type="primary" @click="showAddNewSupplierDialog">添 加</el-button>
                    <br/>
                    <span v-for="item in addedSuppliers" :key="item.supplierCode">
                        {{item.supplierName}}({{item.supplierCode}}) &nbsp&nbsp
                    </span>
                </el-form-item>
                <el-form-item label="搜索字符" style="width:60%">
                    <el-input v-model="form.searchKey"></el-input>
                </el-form-item>
                <!-- 规格管理 -->
                <el-form-item label="采购规格">
                    <el-button type="primary" size="mini" icon="plus" @click="addSpec">添加规格</el-button>
                    备注：入库数量在采购入库的时用来计算入库的原料数量，谨慎填写
                    <div v-for="(spec,index) in specList" :key="index" style="border:dotted #D4D4D4 0px; margin-top:5px;">
                        <el-row>
                            <el-col>
                                <span class="span-title">规格名称</span>
                                <span class="span-content">
                                    <el-input size="small" style="width:160px" v-model="spec.specName" placeholder="规格名称">
                                    </el-input>
                                </span>
                                <span class="span-title">规格单位</span>
                                <span class="span-content">
                                <el-select v-model="spec.specUnit" size="small" style="width:100px" placeholder="规格单位">
                                    <el-option
                                        v-for="item in purchaseUnits"
                                        :key="item.unitCode"
                                        :label="item.unitName"
                                        :value="item.unitCode">
                                   </el-option>
                                </el-select>
                            </span>
                                <span class="span-title">入库数量</span>
                                <span class="span-content">
                                <el-input v-model="spec.transRate" size="small" style="width:100px" placeholder="入库">
                                    <template slot="append">{{form.stockUnit}}</template>
                                </el-input>
                            </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <span class="span-title">参考净重</span>
                                <span class="span-content">
                                    <el-input v-model="spec.weight" size="small" style="width:160px" placeholder="净重">
                                        <template slot="append">千克</template>
                                    </el-input>
                                </span>
                                <span class="span-title ">利用率</span>
                                <span class="span-content">
                                    <el-input v-model="spec.utilizationRatio" size="small" style="width:90px " 
                                    placeholder="利用率">
                                        <template slot="append">%</template>
                                    </el-input>
                                </span>
                                <span class="span-title ">品牌</span>
                                <span class="span-content">
                                <el-input v-model="spec.brandName" size="small" style="width:100px" placeholder="品牌">
                                </el-input>
                                </span>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col>
                                <span class="span-title ">产地</span>
                                <span class="span-content">
                                <el-input v-model="spec.homeplace" size="small" style="width:160px" placeholder="产地">
                                </el-input>
                                </span>
                                <span class="span-title ">基础价格</span>
                                <span class="span-content">
                                <el-input v-model="spec.basePrice" size="small" style="width:100px" placeholder="基础价格">
                                    <template slot="append">元</template>
                                </el-input>
                                </span>
                                <span class="span-title "></span>
                                <span class="span-content">
                                <el-button type="danger " size="mini " icon="delete " @click="removeSpec(index) ">删除</el-button>
                                </span>
                            </el-col>
                        </el-row>
                    </div>
                </el-form-item>
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button type="primary " @click="onSubmit ">保存</el-button>
                            <el-button type="primary " @click="onCancel ">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <el-dialog title="供应商信息" v-model="addNewSupplierDialogShow" class="dialog">
            <el-row >
                <el-col>
                    <el-checkbox v-for="item in allSuppliers" :key="item.supplierCode" @change="supplierCheckChange(item)" v-model="item.checked">
                        {{item.supplierName}}
                    </el-checkbox>
                </el-col>
            </el-row>
        </el-dialog>
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
                id: this.$route.query.mid,
                materialName: '',
                materialCode: '',
                utilizationRatio: 100,
                specUnit: 'NONE',
                specQty: 0,
                stockUnit: '',
                searchKey: '',
                storageLifeUnit: 'D',
                storageLifeNum: '',
                specDetail: '',
                category: '',
                suppliers: '',
                warningCoeffient2: 0,
                warningCoeffient1: 0
            },
            rules: {

            },
            loadingState: false,
            splitMaterials: [],
            specList: [],
            subList: [],
            purchaseUnits: [],
            stockUnits: [],
            categorySel: [],
            varNewSupplier:null,
            addNewSupplierDialogShow:false,
            allSuppliers:[],
            addedSuppliers:[]
        }
    },
    methods: {
        onSubmit() {
            this.loadingState = true;
            this.form.specDetail = JSON.stringify(this.specList)
            this.form.suppliers = JSON.stringify(this.addedSuppliers)
            api.addMaterials(this.form)
                .then((resp) => {
                    this.$message.success("保存成功 ");
                    //this.$router.go(-1)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        showAddNewSupplierDialog(){
            this.loadingState = true;
            this.queryAllSuppliers(()=>{
                this.loadingState = false;
                this.addNewSupplierDialogShow = true;
            });
        },
        addSpec() {
            this.specList.push({ utilizationRatio: this.form.utilizationRatio })
        },
        removeSpec(index) {
            this.specList.splice(index, 1)
        },
        queryAllSuppliers(cb){
            if(this.allSuppliers.length > 0){
                this.allSuppliers.forEach(it=>{
                    if(this.addedSuppliersCodeSet.has(it.supplierCode)){
                        it.checked = true;
                    }else{
                        it.checked = false;
                    }
                })
                cb && cb();
                return;
            }
            api.querySupplierPage({
                pageSize: 2000
            }).then((page) => {
                page.values.forEach((item) => {
                    let ii = {};
                    ii.supplierCode = item.supplierCode;
                    ii.supplierName = item.supplierName;
                    ii.type = "供应商"
                    if(this.addedSuppliersCodeSet.has(item.supplierCode)){
                        ii.checked = true;
                    }else{
                        ii.checked = false;
                    }
                    this.allSuppliers.push(ii);
                })
                cb && cb()
            })
        },
        supplierCheckChange(item,e){
            var index = this.addedSuppliers.findIndex((it)=>it.supplierCode == item.supplierCode)
            console.log(index)
            //添加
            if(item.checked && index == -1){
                this.addedSuppliers.push({
                    supplierCode:item.supplierCode,
                    supplierName:item.supplierName,
                    checked:true,
                    type:"供应商"
                })
            }
            //删除
            else if(!item.checked && index >=0){
                this.addedSuppliers.splice(index, 1)
            }
        }
    },
    mounted() {
        api.queryMaterialById(this.form.id)
            .then((v) => {
                let re = /(\d+)(\w)/ig;
                this.form.materialName = v.materialName;
                this.form.materialCode = v.materialCode;
                this.form.stockUnit = v.stockUnit;
                this.form.searchKey = v.searchKey;
                this.form.specUnit = v.specUnit;
                this.form.specQty = v.specQty || 0;
                this.form.utilizationRatio = v.utilizationRatio;
                this.form.warningCoeffient1 = v.warningCoeffient1;
                this.form.warningCoeffient2 = v.warningCoeffient2;
                this.form.category = v.category;
                let r = re.exec(v.storageLife)
                if (r) {
                    this.form.storageLifeNum = r[1];
                    this.form.storageLifeUnit = r[2];
                }

                api.querySpecDetailByMaterialCode(v.materialCode)
                    .then((specs) => {
                        this.specList = specs;
                    })
                api.querySuppliersByMaterialCodes({
                    materialCodes: this.form.materialCode
                }).then((list) => {
                    this.addedSuppliers = list;
                })
            })
        api.queryUnitByGroup('purchase_unit_group').then((units) => this.purchaseUnits = units)
        api.queryUnitByGroup('stock_unit_group').then((units) => this.stockUnits = units)
        api.queryUnitByGroup('material_category').then((cates) => this.categorySel = cates)
    },
    computed:{
        addedSuppliersCodeSet:function(){
            var s = new Set();
            this.addedSuppliers.forEach((it)=>s.add(it.supplierCode))
            return s;
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
    width: 66px;
}

.span-content {
    display: -moz-inline-box;
    display: inline-block;
    width: 165px;
}
</style>