<template>
    <div v-loading="loadingState">
        <div class="handbox">
            <el-row>
                <el-col :span="7">
                    拨出单位：
                    <MyCabinSelect @input="onSelectOutCabin"></MyCabinSelect>
                </el-col>
                <el-col :span="7">
                    拨入单位：
                    <MyCabinSelect @input="(val)=>{this.inCabinCode=val;}"></MyCabinSelect>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
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
                <el-table-column prop="currStock" label="当前库存" width="100">
                </el-table-column>
                <el-table-column label="拨出数量" width="100">
                    <template scope="scope">
                        <el-input size="small" v-model="scope.row.outAmt"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="stockUnit" label="单位" width="100">
                </el-table-column>
                <el-table-column label="操作" width="">
                    <template scope="scope">
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
import MyCabinSelect from '../common/MyCabinSelect'
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
            outCabinCode: '',
            inCabinCode: '',
            cabinMaterialStock: []
        }
    },
    methods: {
        formatSpec(row) {
            if (row.specUnit == '无') return row.stockUnit
            return row.specQty + row.stockUnit;
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
                return ;
            }
            let self = this;
            this.$confirm('是否提交入库?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.loadingState = true;
                this.submitToServer();
                self.materialList = [];
                setTimeout(() => {
                    this.loadingState = false;
                    this.$message("提交采购单成功")
                }, 1000)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消入库'
                });
            });
        },
        submitToServer() {
            let param = {
                inCabinCode: this.inCabinCode,
                outCabinCode: this.outCabinCode,
                dataJson: JSON.stringify(this.materialList)
            }
            api.commitDiaobo(param)
                .then((val) => {})
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
                let counter = 0;
                let result = this.cabinMaterialStock.map((item) => {
                    let sk = item.materialName + "," + item.cabinName + "," + item.searchKey;
                    Vue.set(item, "sk", sk)
                    Vue.set(item, 'value', item.materialName + "-" + item.cabinName)
                    return item;
                }).filter((item) => {
                    counter++;
                    return counter <= 20 && item.sk.indexOf(queryString) >= 0;
                })

                this.$data.currSelectAlts = result;
                cb(result)
            })

        },
        addAltsToList() {
            if (this.materialList.length > 10) {
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
                        Vue.set(item, "specUnit", mm.specUnit)
                        Vue.set(item, "specQty", mm.specQty)
                        Vue.set(item, "stockUnit", mm.stockUnit)
                    }
                    Vue.set(item, 'outAmt', 0)
                    Vue.set(item, 'outCabinCode', this.outCabinCode)
                    Vue.set(item, 'materialCode', item.materialCode)
                    self.materialList.push(item)
                }
            })
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
                return total.toFixed(2);
            }
            return total;
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
        }
    },
    mounted() {
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