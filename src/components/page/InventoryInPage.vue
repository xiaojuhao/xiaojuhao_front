<template>
    <div v-loading="loadingState">
        <div class="handbox">
            <el-autocomplete id="handbox" v-model="storeCode" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" @select="handleSelect">
            </el-autocomplete>
            <span>搜索内容后回车或选中添加记录</span>
            <span style="float:right;position:relative;margin-right:20%;margin-top:10px;">
                {{storage.code}} {{storage.name}}
            </span>
        </div>
        <div class="form-box">
            <el-table :data="materialList" border style="width: 120%">
                <el-table-column prop="materialName" label="原料名称" width="200">
                </el-table-column>
                <el-table-column prop="supplierName" label="供应商" width="130">
                </el-table-column>
                <el-table-column label="数量" width="120">
                    <template scope="scope">
                        <el-input size="small" v-model="scope.row.amt"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="单价" width="130">
                    <template scope="scope">
                        <el-input size="small" v-model="scope.row.unitPrice"></el-input>
                    </template>
                </el-table-column>
                <el-table-column label="生产日期" width="130">
                    <template scope="scope">
                        <el-date-picker v-model="scope.row.productDate" class="data-picker" size="small" type="date" placeholder="选择日期">
                        </el-date-picker>
                    </template>
                </el-table-column>
                <el-table-column label="保质期" width="150">
                    <template scope="scope">
                        <el-input v-model="scope.row.storageLifeNum" style="width:120px">
                            <el-select v-model="scope.row.storageLifeUnit" slot="append" style="width:60px">
                                <el-option label="天" value="D"></el-option>
                                <el-option label="月" value="M"></el-option>
                            </el-select>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="price" label="总金额" width="120" :formatter="calcTotalPrice">
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="100">
                    <template scope="scope">
                        <el-button size="small" type="primary" @click="removeRows(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row style="margin-top:20px;">
                <el-col :offset="6">
                    <el-button type="primary" :disabled="materialList.length==0" @click="onSubmit">提交入库</el-button>
                    <el-button type="primary" @click="onClear">清空</el-button>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { api, http } from '../common/bus'
import StoreSelection from '../common/StoreSelection'
import RecipesSelection from '../common/RecipesSelection'
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
            currDate: '20171113',
            storage: {
                code: '',
                type: '', //1:仓库 2:门店
                name: ''
            },
            allMaterialSupplier: []
        }
    },
    methods: {
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
                }, 2000)

            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消入库'
                });
            });
        },
        submitToServer() {
            http.post("/busi/batchInstock", {
                dataJson: JSON.stringify(this.materialList)
            }).then((resp) => {
                console.log(resp)
            })
        },
        removeRows(index) {
            this.$data.materialList.splice(index, 1)
        },
        querySearchAsync(queryString, cb) {
            clearTimeout(this.timeout)
            this.timeout = setTimeout(() => {
                queryString = jquery.trim(queryString)
                let counter = 0;
                let result = this.allMaterialSupplier.map((item) => {
                    Vue.set(item, 'value', item.materialName + "-" + item.supplierName)
                    return item;
                }).filter((item) => {
                    counter++;
                    return counter <= 20 && item.value.indexOf(queryString) >= 0;
                })

                this.$data.currSelectAlts = result;
                cb(result)
            })

        },
        addAltsToList() {
            let date = new Date();
            let today = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
            if (this.materialList.length > 10) {
                this.$message.error("添加记录太多,请先入库")
                return
            }
            let self = this;
            this.currSelectAlts.forEach((item) => {
                if (!this.recipesListMap[item.id]) {
                    let mm = this.$store.getters.allMaterialsMap.get(item.materialCode)
                    if (mm) {
                        let re = /(\d+)(\w)/ig;
                        let r = re.exec(mm.storageLife)
                        if (r) {
                            Vue.set(item, 'storageLifeUnit', r[2])
                            Vue.set(item, 'storageLifeNum', r[1])
                        }
                    }
                    Vue.set(item, 'amt', 0)
                    Vue.set(item, 'price', 0)
                    Vue.set(item, 'unitPrice', 0)
                    Vue.set(item, 'cabinCode', this.storage.code)
                    Vue.set(item, 'cabinName', this.storage.name)
                    Vue.set(item, 'cabinType', this.storage.type)
                    Vue.set(item, 'productDate', today)
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
            if (row.amt && row.unitPrice) {
                total = row.amt * row.unitPrice;
                return total.toFixed(2);
            }
            return total;
        }
    },
    mounted() {
        if (new RegExp("^WH").test(this.$route.query.CODE)) {
            api.getWarehouseByCode(this.$route.query.CODE)
                .then((val) => {
                    this.storage.code = val.warehouseCode;
                    this.storage.type = "1";
                    this.storage.name = val.warehouseName;
                })
        } else if (new RegExp("^MD").test(this.$route.query.CODE)) {
            api.queryStoreByCode(this.$route.query.CODE)
                .then((val) => {
                    this.storage.code = val.storeCode;
                    this.storage.type = "2";
                    this.storage.name = val.storeName;
                })
        }

        api.queryAllMaterialSuppler()
            .then((values) => {
                this.allMaterialSupplier = values;
            })
        //添加回车监听
        jquery("#handbox").keyup((event) => {
            if (event.keyCode == 13) {
                this.onEnterKeyPressed();
            }
        });
    },
    computed: {
        recipesListMap() {
            let map = {};
            this.materialList.forEach((item) => map[item.id] = item)
            return map;
        }
    },
    components: {
        StoreSelection,
        RecipesSelection
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