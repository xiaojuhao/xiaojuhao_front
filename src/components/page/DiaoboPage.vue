<template>
    <div v-loading="loadingState">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>调拨单录入</el-breadcrumb-item>
                <el-breadcrumb-item>{{outCabinName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handbox">
            <el-row>
                <el-col :span="7">
                    拨入单位：
                    <CabinSelect @input="(val)=>{this.inCabinCode=val;}"></CabinSelect>
                </el-col>
                <el-col :span="16">
                    添加原料：
                    <el-autocomplete id="handbox" v-model="storeCode" :fetch-suggestions="querySearchAsync" placeholder="搜索原料" @select="handleSelect">
                    </el-autocomplete>
                    <span>搜索内容后回车或选中添加记录</span>
                </el-col>
            </el-row>
        </div>
        <div class="form-box">
            <el-table :data="materialList" border style="width: 120%">
                <el-table-column prop="materialName" label="原料名称" width="150">
                </el-table-column>
                <el-table-column prop="cabinName" label="拨出仓库" width="150">
                </el-table-column>
                <el-table-column label="当前库存" width="120">
                    <template slot-scope="scope">
                        {{scope.row.currStock}} {{scope.row.stockUnit}}
                    </template>
                </el-table-column>
                <el-table-column label="调拨规格" width="120">
                    <template slot-scope="scope">
                        <el-select size="small" v-model="scope.row.specCode" style="width:100px" @change="onSelectSpec(scope.row, scope.row.specCode)">
                            <el-option v-for="item in scope.row.specCodeSel" :key="item.specCode" :label="item.specName" :value="item.specCode">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="拨出数量" width="140">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.specAmt">
                            <template slot="append">{{scope.row.specUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="单价" width="160">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.specPrice">
                            <template slot="append">元/{{scope.row.specUnit}}</template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="基价" :formatter="formatBasePrice" width="100">
                </el-table-column>
                <el-table-column label="总价" width="160" :formatter="calcTotalPrice">
                </el-table-column>
                <el-table-column label="备注" width="140">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.remark">
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="采购库存" width="160" :formatter="calcStockAmt">
                </el-table-column>
                <el-table-column label="利用率" width="100" prop="utilizationRatio">
                    <template slot-scope="scope">
                        {{scope.row.utilizationRatio}}%
                    </template>
                </el-table-column>
                <el-table-column label="食材库存" width="160" :formatter="calcInStockAmt">
                </el-table-column>
                <el-table-column label="备注" width="250">
                    <template slot-scope="scope">
                        <el-input size="small" v-model="scope.row.remark"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="removeRows(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top:20px;">
                <el-col :offset="6">
                    <el-button type="primary" :disabled="materialList.length==0" @click="onSubmit">提交调拨</el-button>
                    <el-button type="primary" @click="onClear">清空</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { api, http } from '../common/bus'
import CabinSelect from '../common/CabinSelect'
import jquery from 'jquery'
import Vue from 'vue'
export default {
    data() {
        return {
            timeout: null,
            storeCode: '',
            materialList: [],
            currSelectAlts: [],
            loadingState: false,
            outCabinCode: this.$route.query.CODE,
            outCabinName: '',
            inCabinCode: '',
            cabinMaterialStock: []
        }
    },
    methods: {
        formatSpec(row) {
            if (row.specUnit == '无') return row.stockUnit
            return row.transRate + row.stockUnit;
        },
        onClear() {
            let self = this;
            this.$confirm('是否清空当前页内容?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.materialList = [];
            })
        },
        formatBasePrice(row) {
            let basePrice = row.selectedSpec && row.selectedSpec.basePrice;
            if(!basePrice) basePrice = 0;
            return basePrice + "元"
        },
        onSubmit() {
            if (!this.inCabinCode) {
                this.$message.error("请拨入单位")
                return
            }
            let check = true;
            this.materialList.forEach((item) => {
                if (item.cabinCode != this.outCabinCode) {
                    check = false;
                }
            })
            if (!check) {
                this.$message.error("拨出仓库和数据不一致")
                return;
            }
            let self = this;
            this.$confirm('是否提交入库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.submitToServer();
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消入库'
                });
            });
        },
        submitToServer() {
            this.loadingState = true;
            let param = {
                inCabinCode: this.inCabinCode,
                outCabinCode: this.outCabinCode,
                dataJson: JSON.stringify(this.materialList)
            }
            api.commitDiaobo(param)
                .then((val) => {
                    this.$message("提交成功")
                    this.materialList = [];
                })
                .fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onSelectSpec(item) {
            item.specCodeSel && item.specCodeSel.forEach((it) => {
                if (it.specCode == item.specCode) {
                    Vue.set(item, 'specName', it.specName)
                    Vue.set(item, 'specUnit', it.specUnit)
                    Vue.set(item, 'stockUnit', it.stockUnit)
                    Vue.set(item, 'transRate', it.transRate)
                    Vue.set(item, 'brandName', it.brandName)
                    Vue.set(item, 'homeplace', it.homeplace)
                    Vue.set(item, 'utilizationRatio', it.utilizationRatio)
                    Vue.set(item, 'selectedSpec', it)
                }
            })
            //this.calcSpecAmt(item);
            this.initSpecPrice(item)
        },
        removeRows(index) {
            this.$data.materialList.splice(index, 1)
        },
        querySearchAsync(queryString, cb) {
            if (!this.outCabinCode) {
                this.$message.error("请选选择拨出单位")
                return;
            }
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                queryString = jquery.trim(queryString)
                let counter = 1;
                let result = this.cabinMaterialStock.map((item) => {
                    let sk = item.materialName + "," + item.cabinName + "," + item.searchKey;
                    Vue.set(item, "sk", sk)
                    Vue.set(item, 'value', item.materialName)
                    Vue.set(item, 'totalPrice', 0)
                    return item;
                }).filter((item) => {
                    if (counter <= 20 && item.sk.indexOf(queryString) >= 0) {
                        counter++;
                        return true;
                    } else {
                        return false;
                    }
                })

                this.$data.currSelectAlts = result;
                cb(result)
            })

        },
        addAltsToList() {
            if (this.materialList.length > 20) {
                this.$message.error("添加记录太多,请先提交")
                return
            }
            let self = this;
            this.currSelectAlts.forEach((item) => {
                if (!this.materialListMap[item.materialCode]) {
                    let mm = this.$store.getters.allMaterialsMap.get(item.materialCode)
                    if (mm) {
                        let re = /(\d+)(\w)/ig;
                        let r = re.exec(mm.storageLife)
                        if (r) {
                            Vue.set(item, 'storageLifeUnit', r[2])
                            Vue.set(item, 'storageLifeNum', r[1])
                        }
                    }
                    Vue.set(item, 'outAmt', 0)
                    Vue.set(item, 'outCabinCode', this.outCabinCode)
                    Vue.set(item, 'materialCode', item.materialCode)
                    self.materialList.push(item)
                }
            })
            this.initTableDate(this.materialList)
        },
        handleSelect(item) {
            this.currSelectAlts = [item]
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
        calcStockAmt(row) {
            return (row.transRate * row.specAmt).toFixed(2) + row.stockUnit;
        },
        calcInStockAmt(row) {
            return (row.transRate * row.specAmt * row.utilizationRatio / 100).toFixed(2) + row.stockUnit;
        },
        onSelectOutCabin(val) {
            this.outCabinCode = val;
            let param = {
                cabinCode: val,
                pageSize: 1000
            }
            api.queryMaterialsStockPage(param)
                .then((page) => {
                    this.cabinMaterialStock = page.values;
                    if (!this.cabinMaterialStock || this.cabinMaterialStock.length == 0) {
                        this.$message.error("仓库没有库存数据")
                    }
                })
        },
        initTableDate(tableData) {
            let codes = [];
            tableData.forEach((it) => {
                codes.push(it.materialCode)
            })
            api.querySpecsByMaterialCodes({
                materialCodes: codes.join(',')
            }).then((list) => {
                //将list按mateiralCode分组
                let map = new Map();
                list.forEach((it) => {
                    let mc = it.materialCode;
                    if (!map.get(mc)) {
                        map.set(mc, [])
                    }
                    map.get(mc).push(it);
                })
                for (let entry of map) {
                    let entryVals = entry[1];
                    let oneVal = entryVals[0];
                    let s = {};
                    Vue.set(s, 'specCode', 'MS000000');
                    Vue.set(s, 'specName', oneVal.stockUnit);
                    Vue.set(s, 'specUnit', oneVal.stockUnit);
                    Vue.set(s, 'stockUnit', oneVal.stockUnit);
                    Vue.set(s, 'transRate', 1);
                    Vue.set(s, 'utilizationRatio', 100);
                    entryVals.push(s);
                }
                //遍历每条记录，设置规则
                tableData.forEach((it) => {
                    if (map.get(it.materialCode)) {
                        Vue.set(it, 'specCodeSel', map.get(it.materialCode))
                    }
                    //如果记录本身没有规格信息，就将第一个设置为默认规格
                    if (!it.specCode && it.specCodeSel.length > 0) {
                        Vue.set(it, 'specCode', it.specCodeSel[0].specCode)
                        Vue.set(it, 'specUnit', it.specCodeSel[0].specUnit)
                        Vue.set(it, 'stockUnit', it.specCodeSel[0].stockUnit)
                        Vue.set(it, 'transRate', it.specCodeSel[0].transRate)
                        Vue.set(it, 'brandName', it.specCodeSel[0].brandName)
                        Vue.set(it, 'homeplace', it.specCodeSel[0].homeplace)
                        Vue.set(it, 'utilizationRatio', it.specCodeSel[0].utilizationRatio)
                        Vue.set(it, 'selectedSpec', it.specCodeSel[0])
                        this.initSpecPrice(it)
                    }
                    if (!it.transRate && it.specUnit == it.stockUnit) {
                        Vue.set(it, 'transRate', 1);
                    }
                })
            })
        },
        initSpecInfo(item) {

        },
        initSpecPrice(item) {
            Vue.set(item, 'specPrice', 0);
            let cabinCode = item.cabinCode;
            if (item.selectedSpec && item.selectedSpec.priceInfo) {
                let pi = JSON.parse(item.selectedSpec.priceInfo)
                if (pi && pi[cabinCode]) {
                    Vue.set(item, 'specPrice', pi[cabinCode]);
                }
            }
        }
    },
    mounted() {
        this.onSelectOutCabin(this.outCabinCode)
        api.getCabinByCode(this.outCabinCode)
            .then((vo) => {
                this.outCabinName = vo.name;
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
            let map = {};
            this.materialList.forEach((item) => map[item.id] = item)
            return map;
        }
    },
    components: {
        CabinSelect
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