<template>
    <div v-loading="loadingState">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>采购单录入</el-breadcrumb-item>
                <el-breadcrumb-item>{{cabin.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handbox">
            <span>
            采购单位：{{cabin.name}}
            </span> &nbsp&nbsp&nbsp&nbsp 采购原料：
            <el-autocomplete id="handbox" v-model="storeCode" 
                :fetch-suggestions="querySearchAsync" 
                placeholder="搜索原料(回车或选中添加记录)" 
                @select="handleSelect">
            </el-autocomplete>
            <!-- <el-button type="primary" @click="showSearchDialog">高级搜索</el-button> -->
        </div>
        <div class="form-box">
            <el-table :data="addedMaterialList" border style="width: 120%">
                <el-table-column prop="materialName" label="原料名称" width="180">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="150">
                </el-table-column>
                <el-table-column label="采购规格" width="150">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.specCode" slot="append" style="width:140px" @change="onSelectSpec(scope.row, scope.row.specCode)">
                            <el-option v-for="item in scope.row.specCodeSel" :key="item.specCode" :label="item.specName" :value="item.specCode">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="采购数量" width="140">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.specAmt">
                            <template slot="append">{{scope.row.specUnit=='无'?scope.row.stockUnit:scope.row.specUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="采购单价" width="130">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.specPrice">
                            <template slot="append">元</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="基价" :formatter="formatBasePrice" width="100">
                </el-table-column>
                <el-table-column prop="totalPrice" label="总价" width="120" :formatter="calcTotalPrice">
                </el-table-column>
                <el-table-column label="备注" width="140">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.remark">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="规格" :formatter="formatSpec" width="100">
                </el-table-column>
                <el-table-column label="采购入库" :formatter="formatStockAmt" width="100">
                </el-table-column>
                <el-table-column label="食材入库" :formatter="formatInStockAmt" width="100">
                </el-table-column>
                <el-table-column prop="brandName" label="品牌" width="100">
                </el-table-column>
                <el-table-column label="生产日期" width="150">
                    <template slot-scope="scope">
                        <el-date-picker v-model="scope.row.prodDate" class="data-picker" size="small" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="removeRows(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top:20px;">
                <el-col :offset="6">
                    <el-button type="primary" :disabled="addedMaterialList.length==0" @click="onSubmit">提交采购单</el-button>
                    <el-button type="primary" @click="onClear">清空</el-button>
                </el-col>
            </el-row>
        </div>
        <el-dialog title="供应商原料信息" v-model="isSupplierMaterialDialogShow" class="dialog">
            <el-row >
                <el-col>
                    <el-input v-model="supplierMaterialSearchWord" placeholder="供应商名称or原料名称"></el-input>
                    <br/><br/>
                    
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { api, http, util } from '../common/bus'
import MyCabinSelect from '../common/MyCabinSelect'
import jquery from 'jquery'
import Vue from 'vue'
export default {
    data() {
        return {
            timeout: null,
            storeCode: '',
            addedMaterialList: [],
            loadingState: false,
            cabinCode: this.$route.query.CODE,
            cabin: {},
            cabinSupplierCodes:new Set(),
            isSupplierMaterialDialogShow:false,
            supplierMaterialSearchWord:'',
            materialSupplierDOList: [],
            materialSupplierDOAlternatives: [], //下拉框带选项
            materialsDOList:[]
        }
    },
    methods: {
        formatBasePrice(row) {
            return row.selectedSpec && row.selectedSpec.basePrice + "元"
        },
        formatSpec(row) {
            if (row.transRate && row.stockUnit && row.specUnit) {
                if (row.stockUnit != row.specUnit)
                    return row.transRate + row.stockUnit + "/" + row.specUnit;
                else
                    return row.stockUnit
            }
        },
        formatStockAmt(row) {
            let amt = eval(row.specAmt + "*" + row.transRate).toFixed(2);
            let intamt = parseInt(amt);
            if (amt == intamt) {
                return intamt + row.stockUnit;
            }
            return amt + row.stockUnit;
        },
        formatInStockAmt(row) {
            let amt = (eval(row.specAmt + "*" + row.transRate) * row.utilizationRatio / 100).toFixed(2);
            let intamt = parseInt(amt);
            if (amt == intamt) {
                return intamt + row.stockUnit;
            }
            return amt + row.stockUnit;
        },
        onClear() {
            let self = this;
            this.$confirm('是否清空当前页内容?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.addedMaterialList = [];
            })
        },
        onSubmit() {
            if (!this.cabinCode) {
                this.$message.error("请先选择采购仓库或门店")
                return
            }
            let self = this;
            this.$confirm('是否提交采购单?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loadingState = true;
                let param = {
                    cabinCode: this.cabinCode,
                    dataJson: JSON.stringify(this.addedMaterialList)
                }
                api.commitPurchaseOrder(param)
                    .then((val) => {
                        self.addedMaterialList = [];
                        this.$message("提交采购单成功")
                    }).fail((resp) => {
                        this.$message.error(resp.message)
                    }).always(() => {
                        this.loadingState = false;
                    })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消入库'
                });
            });
        },
        removeRows(index) {
            this.$data.addedMaterialList.splice(index, 1)
        },
        querySearchAsync(queryString, cb) {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                queryString = jquery.trim(queryString)
                let counter = 1;
                let result = this.materialSupplierDOList.filter((item) => {
                    if (counter <= 20 
                        && this.matchSpecificSupplier(item)
                        && !this.hasAdded(item) 
                        && item.sk.indexOf(queryString) >= 0) {
                        counter++;
                        return true;
                    } else {
                        return false;
                    }
                })
                this.materialSupplierDOAlternatives = result;
                cb(result)
            })
        },
        matchSpecificSupplier(materialSupplierDO){
            if(materialSupplierDO && this.cabinSupplierCodes.size>0){
                return this.cabinSupplierCodes.has(materialSupplierDO.supplierCode)
            }
            return true;
        },
        hasAdded(materialSupplierDO){
            if(materialSupplierDO){
                let key = materialSupplierDO.supplierCode+"_"+materialSupplierDO.materialCode;
                if(this.addedMaterialKeys.has(key)){
                    return true;
                }
            }
            return false;
        },
        addSupplierMaterial(materialSupplierDO){
            let today = util.formatDateT(util.today());
            let item = materialSupplierDO;
            let mm = this.materialsDOMap.get(item.materialCode)
            if (mm) {
                let re = /(\d+)(\w)/ig;
                let r = re.exec(mm.storageLife)
                if (r) {
                    Vue.set(item, 'storageLifeUnit', r[2])
                    Vue.set(item, 'storageLifeNum', r[1])
                }
                Vue.set(item, "specUnit", '')
                Vue.set(item, "transRate", 0)
                Vue.set(item, "stockUnit", mm.stockUnit)
            }
            Vue.set(item, 'specAmt', 0)
            Vue.set(item, 'totalPrice', 0)
            Vue.set(item, 'specPrice', 0)
            Vue.set(item, 'cabinCode', this.cabinCode)
            Vue.set(item, 'prodDate', today)
            Vue.set(item, 'materialCode', item.materialCode)
            this.setSpecCode(item);
            this.addedMaterialList.push(item);
            this.initSpecPrice(item);
        },
        addAltsToList() {
            if (this.addedMaterialList.length > 20) {
                this.$message.error("添加记录太多,请先入库")
                return
            }
            let self = this;
            this.materialSupplierDOAlternatives.forEach((item) => {
                if (!this.hasAdded(item)) {
                    this.addSupplierMaterial(item)
                }
            })
        },
        setSpecCode(item) {
            setTimeout(() => {
                api.querySpecDetailByMaterialCode(item.materialCode)
                    .then((list) => {
                        if (list && list.length > 0) {
                            Vue.set(item, 'specCode', list[0].specCode)
                            Vue.set(item, 'psecName', list[0].specName)
                            Vue.set(item, 'specUnit', list[0].specUnit)
                            Vue.set(item, 'transRate', list[0].transRate)
                            Vue.set(item, 'brandName', list[0].brandName)
                            Vue.set(item, 'homeplace', list[0].homeplace)
                            Vue.set(item, 'utilizationRatio', list[0].utilizationRatio)
                            Vue.set(item, 'selectedSpec', list[0])
                            this.initSpecPrice(item);
                        }
                        Vue.set(item, 'specCodeSel', list)
                    })
            }, 0)

        },
        onSelectSpec(item, selectedCode) {
            item.specCodeSel.forEach((it) => {
                if (it.specCode == selectedCode) {
                    Vue.set(item, 'specCode', it.specCode)
                    Vue.set(item, 'specName', it.specName)
                    Vue.set(item, 'specUnit', it.specUnit)
                    Vue.set(item, 'transRate', it.transRate)
                    Vue.set(item, 'brandName', it.brandName)
                    Vue.set(item, 'homeplace', it.homeplace)
                    Vue.set(item, 'utilizationRatio', it.utilizationRatio)
                    Vue.set(item, 'selectedSpec', it);
                    this.initSpecPrice(item);
                }
            })
        },
        handleSelect(item) {
            this.materialSupplierDOAlternatives = [item]
            this.storeCode = '';
            this.addAltsToList();
        },
        onEnterKeyPressed() {
            if (this.loadingState) {
                return;
            }
            this.loadingState = true;
            setTimeout(() => {
                this.addAltsToList()
                this.loadingState = false;
            }, 0)
        },
        calcTotalPrice(row) {
            var total = 0.00;
            if (row.specAmt && row.specPrice) {
                total = row.specAmt * row.specPrice;
                return total.toFixed(2) + "元";
            }
            return total + "元";
        },
        initSpecPrice(item) {
            Vue.set(item, 'specPrice', 0);
            let cabinCode = item.cabinCode;
            if (item.selectedSpec && item.selectedSpec.priceInfo) {
                try {
                    let pi = JSON.parse(item.selectedSpec.priceInfo)
                    if (pi && pi[cabinCode]) {
                        Vue.set(item, 'specPrice', pi[cabinCode]);
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        },
        showSearchDialog(){
            this.isSupplierMaterialDialogShow = true;
        }
    },
    mounted() {
        api.queryAllMaterialSuppler()
            .then((values) => {
                this.materialSupplierDOList = values;
                if(this.materialSupplierDOList){
                    this.materialSupplierDOList.forEach((item)=>{
                        let sk = item.materialName + "," + item.supplierName + "," + item.searchKey;
                        Vue.set(item, "sk", sk)
                        Vue.set(item, "value", item.supplierName + "-" + item.materialName)
                    })
                }
            });
        api.queryAllMaterials()
            .then((resp)=>{
                this.materialsDOList = resp.values;
            })
        api.getCabinByCode(this.cabinCode)
            .then((vo) => {
                this.cabin = {
                    name:vo.name,
                    code:this.cabinCode,
                    supplierCodes:vo.supplierCodes
                };
                if(this.cabin.supplierCodes){
                    this.cabin.supplierCodes.split(",").forEach((code)=>this.cabinSupplierCodes.add(code))
                }
            })
        //添加回车监听
        jquery("#handbox").keyup((event) => {
            if (event.keyCode == 13) {
                this.onEnterKeyPressed();
            }
        });
    },
    computed: {
        materialListMap() {
            let map = new Map();
            this.addedMaterialList.forEach((item) => map.set(item.id,item))
            return map;
        },
        materialsDOMap() {
            let map = new Map();
            this.materialsDOList.forEach((it)=>{
                map.set(it.materialCode, it)
            })
            return map;
        },
        addedMaterialKeys() {
            let set = new Set();
            this.addedMaterialList.forEach(it=>{
                set.add(it.supplierCode+"_"+it.materialCode)
            })
            return set;
        }
    },
    components: {
        MyCabinSelect
    }
}
</script>
<style scoped>
.form-box {
    margin-top: 20px;
    width: 100%;
}

.border-table {
    border-collapse: collapse;
    border: none;
}

.border-table td {
    border: solid #000 1px;
}

.border-table th {
    border: solid #000 1px;
}

.el-row {
    margin-bottom: 5px;
    &:last-child {
        margin-bottom: 0;
    }
}

.data-picker {
    width: 120px;
}

.bg-purple {
    background: #d3dce6;
}

.grid-content {
    min-height: 1px;
    text-align: center;
}

.head-row {
    height: 30px;
}
</style>