<template>
    <div class="table" v-loading="loadingState2" element-loading-text="正在计算需求信息">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <MyCabinSelect @input="(v)=>{queryCond.cabinCode=v;}"></MyCabinSelect>
                    <el-select v-model="queryCond.category" clearable style="width:80px" placeholder="分类">
                        <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索条件"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="8">
                    <div style="position:relative; float:right; ">
                        <el-button round @click="createRequire()">计算需求</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="tableData" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)" @select="handleSelect" @select-all="handleSelectAll" :row-style="rowStyle">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="150">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="150">
            </el-table-column>
            <el-table-column prop="requireDateStr" label="申请日期" width="120">
            </el-table-column>
            <el-table-column label="当前库存" width="120">
                <template slot-scope="scope">
                    <a :href="'#/stockHistory?cabin='+scope.row.cabinCode+'&mcode='+scope.row.materialCode">
                    {{scope.row.currStock}}
                    </a>
                </template>
            </el-table-column>
            <el-table-column prop="requireAmtAndUnit" label="需求量" width="100">
            </el-table-column>
            <el-table-column label="规格单位" width="160">
                <template slot-scope="scope">
                    <el-select size="small" v-model="scope.row.specCode" slot="append" style="width:140px" @change="onSelectSpec(scope.row, scope.row.specCode)">
                        <el-option v-for="item in scope.row.specSelection" :key="item.specCode" :label="item.specName" :value="item.specCode">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="规格" width="100">
                <template slot-scope="scope">
                    {{scope.row.transRate}}{{scope.row.stockUnit}}/{{scope.row.specUnit}}
                </template>
            </el-table-column>
            <el-table-column label="采购量" width="160">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.specAmt">
                        <template slot="append">{{scope.row.specUnit}}</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="采购价" width="160">
                <template slot-scope="scope">
                    <el-input size="small" v-model="scope.row.specPrice">
                        <template slot="append">元/{{scope.row.specUnit}}</template>
                    </el-input>
                </template>
            </el-table-column>
            <el-table-column label="采购类型" width="150">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.purchaseType" slot="append" style="width:80px" placeholder="请选择">
                        <el-option label="采购" value="1"></el-option>
                        <el-option label="调拨" value="2"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="供应商/仓库" width="150">
                <template slot-scope="scope">
                    <el-select v-show="scope.row.purchaseType == '1'" v-model="scope.row.supplierCode" style="width:140px" @change="onSelectSupplier(scope.row)">
                        <el-option v-for="item in scope.row.supplierSelection" :key="item.supplierCode" :label="item.supplierName" :value="item.supplierCode">
                        </el-option>
                    </el-select>
                    <el-select v-show="scope.row.purchaseType == '2'" v-model="scope.row.fromCabinCode" style="width:140px" @change="onSelectCabin(scope.row)">
                        <el-option v-for="item in cabinSels" :key="item.cabinCode" :label="item.cabinName" :value="item.cabinCode">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="需求备注" width="120">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
            </el-pagination>
        </div>
        <el-row style="margin-top:20px;">
            <el-col :offset="6">
                <el-button type="primary" :disabled="selectItems.length==0" @click="submitSelectedData(1)">
                    暂存
                </el-button>
                <span style="margin-right:20px"></span>
                <el-button type="primary" :disabled="selectItems.length==0" @click="showConfirmDialog">
                    确认提交
                </el-button>
                <span style="margin-right:20px"></span>
                <el-button type="danger" :disabled="selectItems.length==0" @click="submitCancel">
                    删除需求
                </el-button>
                <span style="margin-right:20px"></span>
                <el-button type="primary" :disabled="selectItems.length==0" @click="submitSelectedData(3)">
                    导出EXCEL
                </el-button>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="isShowMessage" title="确认入库信息">
            <el-table :data="selectItems" style="width:100%" max-height="400" row-class-name="info-row">
                <el-table-column prop="materialName" label="原料名称" width="">
                </el-table-column>
                <el-table-column label="原料名称" width="100">
                    <template slot-scope="scope">
                        <span v-show="scope.row.purchaseType == '1'">采购</span>
                        <span v-show="scope.row.purchaseType == '2'">调拨</span>
                    </template>
                </el-table-column>
                <el-table-column label="供应商" width="">
                    <template slot-scope="scope">
                        <span v-show="scope.row.purchaseType == '1'">{{scope.row.supplierName}}</span>
                        <span v-show="scope.row.purchaseType == '2'">{{scope.row.fromCabinName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格数量">
                    <template slot-scope="scope">
                        {{scope.row.specAmt}}{{scope.row.specUnit}}
                    </template>
                </el-table-column>
                <el-table-column label="入库数量" width="">
                    <template slot-scope="scope">
                        {{(scope.row.specAmt * scope.row.transRate).toFixed(0)}} {{scope.row.stockUnit}}
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 10px; text-align: center; ">
                <el-button @click="()=>{this.isShowMessage = false}">关闭</el-button>
                <el-button type="primary" :disabled="selectItems.length==0" @click="submitSelectedData(2)">
                    提交采购
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { api, util, config } from '../common/bus'
import MaterialSelection from '../common/MaterialSelection'
import MyCabinSelect from '../common/MyCabinSelect'
import Vue from 'vue'
export default {
    components: {
        MaterialSelection,
        MyCabinSelect
    },
    data() {
        return {
            queryCond: {
                pageNo: 1,
                pageSize: 40,
                totalRows: 0,
                materialCode: '',
                cabinCode: '',
                searchKey: '',
                status: '0',
                category: ''
            },
            tableData: [],
            loadingState: false,
            loadingState2: false,
            userRole: this.$store.state.userRole,
            isShowMessage: false,
            selectItems: [],
            categorySel: [],
            cabinSels: []
        }
    },
    mounted() {
        this.loadParam();
        api.queryUnitByGroup('material_category').then((cates) => this.categorySel = cates)
        api.getAllWarehouseList().then((list) => {
            list.forEach((it) => {
                this.cabinSels.push({
                    "cabinCode": it.warehouseCode,
                    "cabinName": it.warehouseName
                })
            })
        })
    },
    methods: {
        handleCurrentChange(val) {
            this.queryCond.pageNo = val;
            this.queryData();
        },
        keepParam() {
            this.$store.commit("setQueryCond", this.queryCond)
        },
        loadParam() {
            Object.assign(this.queryCond, this.$store.state.queryCond)
        },
        formatRequireDate(row) {
            return util.formatDate(row.requireDate)
        },
        onSelectSpec(item) {
            item.specSelection && item.specSelection.forEach((it) => {
                if (it.specCode == item.specCode) {
                    Vue.set(item, 'specName', it.specName)
                    Vue.set(item, 'specUnit', it.specUnit)
                    Vue.set(item, 'stockUnit', it.stockUnit)
                    Vue.set(item, 'transRate', it.transRate)
                    Vue.set(item, 'brandName', it.brandName)
                    Vue.set(item, 'homeplace', it.homeplace)
                    Vue.set(item, 'selectedSpec', it)
                }
                //没有规则信息，将第一个规格作为默认规格
                if (!item.specCode) {
                    Vue.set(item, 'specCode', item.specSelection[0].specCode)
                    Vue.set(item, 'specName', item.specSelection[0].specName)
                    Vue.set(item, 'specUnit', item.specSelection[0].specUnit)
                    Vue.set(item, 'stockUnit', item.specSelection[0].stockUnit)
                    Vue.set(item, 'transRate', item.specSelection[0].transRate)
                    Vue.set(item, 'brandName', item.specSelection[0].brandName)
                    Vue.set(item, 'homeplace', item.specSelection[0].homeplace)
                    Vue.set(item, 'selectedSpec', item.specSelection[0])
                }
            })
            this.calcSpecAmt(item);
        },
        onSelectSupplier(item) {
            item.supplierSelection && item.supplierSelection.forEach((it) => {
                if (it.supplierCode == item.supplierCode) {
                    Vue.set(item, 'supplierName', it.supplierName)
                }
            })
        },
        onSelectCabin(item) {
            this.cabinSels.forEach((it) => {
                if (it.cabinCode == item.fromCabinCode) {
                    Vue.set(item, 'fromCabinName', it.cabinName)
                }
            })
        },
        queryData() {
            this.selectItems = [];
            this.loadingState = true;
            api.queryMaterialRequire(this.queryCond)
                .then((page) => {
                    this.tableData = page.values;
                    this.queryCond.totalRows = page.totalRows;
                    //this.initTableData(this.tableData);
                }).fail((resp) => {
                    this.$message.error("请求出错")
                }).always((resp) => {
                    this.loadingState = false;
                })
        },
        // initTableData(tableData) {
        //     try {
        // let start = new Date().getTime();
        // this.tableData.forEach((it) => {
        //     let spSel = it.supplierSelection || []
        //     if (!it.supplierCode && !it.fromCabinCode && spSel.length > 0) {
        //         Vue.set(it, 'supplierCode', spSel[0].supplierCode)
        //         Vue.set(it, 'supplierName', spSel[0].supplierName)
        //     }
        // })
        // console.log("cost", new Date().getTime() - start)
        //计算推荐采购数量
        // setTimeout(() => {
        //     this.tableData.forEach((it) => this.onSelectSpec(it))
        // }, 0)
        //初始化最近记录的供应商信息
        // this.tableData.forEach((it) => {
        //     setTimeout(() => {
        //         api.getRecentSupplier(it.cabinCode, it.materialCode)
        //             .then((val) => {
        //                 Vue.set(it, 'supplierCode', val)
        //                 this.onSelectSupplier(it)
        //             })
        //     }, 0)
        // })
        // } catch (e) {
        //     console.log(e)
        //     this.$message.error("初始化记录异常")
        // }
        // },
        search() {
            this.tableData = [];
            this.queryData();
        },
        rowStyle(row) {
            if (row.isSelected == true)
                return 'background:#E0E0E0'
        },
        calcSpecAmt(item) {
            if (!item.transRate) {
                Vue.set(item, 'transRate', 1)
            }
            let specAmt = item.requireAmt / item.transRate;
            if (specAmt) {
                specAmt = Math.ceil(specAmt);
            }
            Vue.set(item, 'specAmt', specAmt);
            this.initSpecPrice(item);
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
        handleSelect(sels, item) {
            this.selectItems = sels;
            Vue.set(item, 'isSelected', false)
            setTimeout(() => sels.forEach((it) => Vue.set(it, 'isSelected', true)), 0)
        },
        handleSelectAll(sels) {
            this.selectItems = sels;
            setTimeout(() => {
                this.tableData.forEach((it) => Vue.set(it, 'isSelected', false));
                sels.forEach((it) => Vue.set(it, 'isSelected', true))
            }, 0)
        },
        showConfirmDialog() {
            this.isShowMessage = true;
        },
        submitSelectedData(type) {
            let inputType = type;
            if (type == 3) {
                type = 1;
            }
            this.loadingState = true;
            api.handleRequire({
                requires: JSON.stringify(this.selectItems),
                handleType: type
            }).then((resp) => {
                if (inputType == 3) {
                    this.exportExcel();
                } else {
                    this.$message("提交成功");
                    this.queryData();
                }
            }).fail((resp) => {
                this.$message.error(resp.message)
            }).always(() => {
                this.isShowMessage = false;
                this.loadingState = false;
            })
        },
        submitCancel() {
            api.cancelRequire({
                items: JSON.stringify(this.selectItems)
            }).then((resp) => {
                this.$message("处理成功");
                this.queryData();
            }).fail((resp) => {
                this.$message.error(resp.message)
            }).always(() => {
                this.isShowMessage = false;
            })
        },
        createRequire() {
            this.loadingState2 = true;
            api.createMaterialRequre({})
                .then((val) => {
                    this.$message("生成需求单成功");
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingState2 = false;
                })
        },
        exportExcel() {
            let ids = [];
            this.selectItems.forEach((it) => {
                ids.push(it.id);
            })
            window.open(config.server + "/require/downloadRequire?ids=" + ids.join(','))
        }
    }
}
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.bg-selected {
    background: red;
}
</style>