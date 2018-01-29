<template>
    <div class="container" v-loading="loadingShow" element-loading-text="正在处理.....">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>盘点库存</el-breadcrumb-item>
                <el-breadcrumb-item>{{cabin.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <el-button :type="btnType" size="small" @click="btnClick">{{btnText}}</el-button>
        </div>
        <el-row>
            <el-col :span="13" style="margin-right:10px">
                <div style="text-align:center">
                    <h4>待盘点</h4>
                </div>
                <div class="waitingList">
                    <div>
                        <el-row style="margin-bottom:10px;">
                            <el-col :span="5">原料名称</el-col>
                            <el-col :span="5">库存记录</el-col>
                            <el-col :span="5">盘点数量</el-col>
                            <el-col :span="6" :offset="1">操作</el-col>
                        </el-row>
                        <transition-group name="list" tag="p">
                            <el-row v-for="(item, index) in waitingList" :key="item.id" class="list-item row-item">
                                <el-col :span="5">{{item.materialName}}</el-col>
                                <el-col :span="5">{{item.oriStockAmt}} {{item.stockUnit}}</el-col>
                                <el-col :span="5">
                                    <el-input size="mini" v-model="item.stockAmt">
                                        <template slot="append">
                                            <span style="display:inline-block;width:20px">{{item.stockUnit}}</span>
                                        </template>
                                    </el-input>
                                </el-col>
                                <el-col :span="6" :offset="1">
                                    <el-button size="small" @click="inputdetail(item,index)">详细</el-button>
                                    <el-button size="small" @click="confirm(item,index)">确认</el-button>
                                </el-col>
                            </el-row>
                        </transition-group>
                    </div>
                </div>
            </el-col>
            <el-col :span="10">
                <div style="text-align:center">
                    <h4>已盘点</h4>
                </div>
                <div class="doneList">
                    <div>
                        <el-row style="margin-bottom:10px;">
                            <el-col :span="5">原料名称</el-col>
                            <el-col :span="5">库存记录</el-col>
                            <el-col :span="5">盘点数量</el-col>
                            <el-col :span="4">差额</el-col>
                            <el-col :span="2">单位</el-col>
                            <el-col :span="3"></el-col>
                        </el-row>
                        <transition-group name="list" tag="p">
                            <el-row v-for="(item, index) in doneList" :key="item.id" class="list-item row-item">
                                <el-col :span="5">{{item.materialName}}</el-col>
                                <el-col :span="5">{{item.oriStockAmt}}</el-col>
                                <el-col :span="5">{{item.stockAmt}}</el-col>
                                <el-col :span="4">{{item.stockAmt-item.oriStockAmt}}</el-col>
                                <el-col :span="2">{{item.stockUnit}}</el-col>
                                <el-col :span="3">
                                    <el-button size="mini" @click="recover(item,index)">撤销</el-button>
                                </el-col>
                            </el-row>
                        </transition-group>
                    </div>
                </div>
            </el-col>
        </el-row>
        <el-dialog :title="dialogTitle" v-model="detailInputDialogShow" class="dialog">
            <el-table :data="currentItem.specList" border>
                <el-table-column prop="specName" label="规格名称" width="150">
                </el-table-column>
                <el-table-column label="规格" :formatter="formatSpec" width="120">
                </el-table-column>
                <el-table-column label="利用率" width="80">
                    <template slot-scope="scope">
                        {{scope.row.utilizationRatio}}%
                    </template>
                </el-table-column>
                <el-table-column prop="specAmt" label="剩余" width="140">
                    <template slot-scope="scope">
                        <el-input size="mini" v-model="scope.row.leftAmt">
                            <template slot="append">
                                <span style="display:inline-block;width:20px">{{scope.row.specUnit}}</span>
                            </template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column label="折算数量" :formatter="calcStockAmt" width="180">
                </el-table-column>
            </el-table>
            <div style="text-align:center;margin-top:10px;">
                <el-button type="primary" size="small" @click="confirmItem">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { api } from '../common/bus'
import Vue from 'vue'
import jq from 'jquery'
export default {
    data() {
        return {
            cabin: {},
            checkMain: {},
            waitingList: [],
            doneList: [],
            detailInputDialogShow: false,
            loadingShow: false,
            dialogTitle: '',
            currentItem: ''
        }
    },

    methods: {
        btnClick() {
            if (this.checkMain.status == '1') {
                this.finishCheck();
            } else {
                this.startCheck();
            }
        },
        formatSpec(item) {
            return item.transRate + item.stockUnit + "/" + item.specUnit;
        },
        calcStockAmt(item) {
            let stockAmt = item.leftAmt * item.transRate * item.utilizationRatio / 100;
            Vue.set(item, 'stockAmt', stockAmt);
            return item.stockAmt + item.stockUnit;
        },
        inputdetail(row, index) {
            this.currentItem = row;
            this.dialogTitle = row.materialName + " 系统库存 " + row.realStock + " " + row.stockUnit;
            this.detailInputDialogShow = true;
            if (!row.specList) {
                api.querySpecDetailByMaterialCode(row.materialCode)
                    .then((list) => {
                        let specList = [];
                        let hadSS = false;
                        //规格
                        list && list.forEach((it) => {
                            let s = {};
                            Vue.set(s, 'leftAmt', 0)
                            Vue.set(s, 'specCode', it.specCode);
                            Vue.set(s, 'specName', it.specName);
                            Vue.set(s, 'specUnit', it.specUnit);
                            Vue.set(s, 'stockUnit', it.stockUnit);
                            Vue.set(s, 'transRate', it.transRate);
                            Vue.set(s, 'utilizationRatio', it.utilizationRatio)
                            if (it.transRate == 1 && it.stockUnit == it.specUnit) {
                                hadSS = true;
                            }
                            specList.push(s)
                        })
                        //本身
                        if (!hadSS) {
                            let ss = {};
                            Vue.set(ss, 'leftAmt', 0)
                            Vue.set(ss, 'specCode', row.materialCode);
                            Vue.set(ss, 'specName', row.materialName);
                            Vue.set(ss, 'specUnit', row.stockUnit);
                            Vue.set(ss, 'stockUnit', row.stockUnit);
                            Vue.set(ss, 'transRate', 1);
                            Vue.set(ss, 'utilizationRatio', 100);
                            specList.push(ss);
                        }


                        Vue.set(row, 'specList', specList)
                    }).fail((resp) => {
                        this.$message.error(resp.message)
                    })
            }
        },
        confirmItem() {
            let realStock = 0;
            this.currentItem.specList && this.currentItem.specList.forEach((it) => {
                if (it.stockAmt) {
                    realStock += it.stockAmt;
                }
            })
            this.currentItem.stockAmt = realStock;
            this.detailInputDialogShow = false;
        },
        confirm(row, index) {
            this.loadingShow = true;
            this.waitingList.splice(index, 1).forEach((item) => {
                api.doCheckStock({
                    id: item.id,
                    mainId: item.mainId,
                    cabinCode: item.cabinCode,
                    materialCode: item.materialCode,
                    stockAmt: item.stockAmt,
                    detail: JSON.stringify(item.specList)
                }).then((value) => {
                    //将盘点好的记录添加到已盘点队列中
                    this.doneList.unshift(item)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingShow = false;
                })
            })
        },
        recover(row, index) {
            this.loadingShow = true;
            this.doneList.splice(index, 1).forEach((item) => {
                api.cancelCheckDetail({
                    id: item.id,
                    mainId: item.mainId,
                    cabinCode: item.cabinCode,
                    materialCode: item.materialCode
                }).then((value) => {
                    //将盘点好的记录添加到已盘点队列中
                    this.waitingList.unshift(item)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                }).always(() => {
                    this.loadingShow = false;
                })
            })
        },
        queryCheckDetail() {
            api.queryCheckDetail(this.checkMain.id, this.checkMain.cabinCode)
                .then((list) => {
                    list && list.forEach((it) => {
                        if (it.status == 0) {
                            this.waitingList.push(it)
                        } else {
                            this.doneList.push(it)
                        }
                    })
                })
        },
        startCheck() {
            this.loadingShow = true;
            api.startCheck(this.cabin.code)
                .then((val) => {
                    this.checkMain = val;
                    this.queryCheckDetail();
                }).always(() => {
                    this.loadingShow = false;
                })
        },
        finishCheck() {
            this.loadingShow = true;
            api.finishCheck(this.checkMain.id, this.checkMain.cabinCode)
                .then((val) => {
                    this.checkMain = {};
                    this.waitingList = [];
                    this.doneList = [];
                }).always(() => {
                    this.loadingShow = false;
                })
        }
    },
    mounted() {
        api.getCabinByCode(this.$route.query.CODE)
            .then((val) => {
                this.cabin = val;
            })
        //查询当前是否有正在盘点的任务
        api.currentStockCheck(this.$route.query.CODE)
            .then((main) => {
                this.checkMain = main
                this.queryCheckDetail();
            })
        //给列表加上高亮事件
        jq(".container")
            .on("mouseover", ".row-item", function(i) {
                jq(i.currentTarget).addClass("selectedRow")
            })
            .on("mouseout", ".row-item", function(e) {
                jq(e.currentTarget).removeClass("selectedRow")
            })
    },
    computed: {
        btnText() {
            if (this.checkMain.status == '1') {
                return "结束盘点"
            } else {
                return "开始盘点"
            }
        },
        btnType() {
            if (this.checkMain.status == '1') {
                return 'danger'
            } else {
                return "primary"
            }
        }
    }
}
</script>
<style scoped>
.container {
    height: 100%;
}

.el-row,
.el-col {
    height: 100%;
}

.waitingList {
    border: solid 1px;
    width: 100%;
    height: 100%;
    display: inline-block;
    overflow-y: scroll;
    overflow-x: hidden;
}

.doneList {
    border: solid 1px;
    width: 100%;
    display: inline-block;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
}

.selectedRow {
    background: #EAEAEA;
}

.list-item {
    margin-right: 10px;
}

.list-enter-active,
.list-leave-active {
    transition: all 0.5s;
}

.list-enter,
.list-leave-to
/* .list-leave-active for below version 2.1.8 */

{
    opacity: 0;
    transform: translateX(30px);
}
</style>