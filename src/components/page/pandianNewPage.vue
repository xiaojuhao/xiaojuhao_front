<template>
    <div class="container">
    	<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>盘点库存</el-breadcrumb-item>
                <el-breadcrumb-item>{{cabin.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" size="small" @click="switchStatus">{{btnText}}</el-button>
        </div>
        <el-row>
            <el-col :span="10">
                <div style="text-align:center">
                    <h4>待盘点</h4>
                </div>
                <div class="waitingList">
                    <div>
                        <el-row style="margin-bottom:10px;">
                            <el-col :span="5">原料名称</el-col>
                            <el-col :span="5">库存记录</el-col>
                            <el-col :span="5">盘点数量</el-col>
                            <el-col :span="5">库存单位</el-col>
                            <el-col :span="4">操作</el-col>
                        </el-row>
                        <transition-group name="list" tag="p">
                            <el-row v-for="(item, index) in waitingList" :key="item.id" class="list-item row-item">
                                <el-col :span="5">{{item.materialName}}</el-col>
                                <el-col :span="5">{{item.currStock}}</el-col>
                                <el-col :span="5">
                                    <el-input size="mini" v-model="item.realStock"></el-input>
                                </el-col>
                                <el-col :span="5">{{item.stockUnit}}</el-col>
                                <el-col :span="4">
                                    <el-button size="small" @click="confirm(item,index)">确认</el-button>
                                </el-col>
                            </el-row>
                        </transition-group>
                    </div>
                </div>
            </el-col>
            <el-col :span="10" :offset="1">
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
                            <el-col :span="5">库存单位</el-col>
                        </el-row>
                        <transition-group name="list" tag="p">
                            <el-row v-for="(item, index) in doneList" :key="item.id" class="list-item row-item">
                                <el-col :span="5">{{item.materialName}}</el-col>
                                <el-col :span="5">{{item.currStock}}</el-col>
                                <el-col :span="5">{{item.realStock}}</el-col>
                                <el-col :span="4">{{item.realStock-item.currStock}}</el-col>
                                <el-col :span="5">{{item.stockUnit}}</el-col>
                            </el-row>
                        </transition-group>
                    </div>
                </div>
            </el-col>
        </el-row>
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
            waitingList: [],
            doneList: []
        }
    },

    methods: {
        switchStatus() {
            if (this.cabin.status == "2") {
                api.finishCorrect(this.$route.query.CODE)
                    .always(() => {
                        this.getData()
                    });
            } else {
                api.startCorrect(this.$route.query.CODE)
                    .always(() => {
                        this.getData()
                    });
            }
        },
        confirm(row, index) {
            this.waitingList.splice(index, 1).forEach((item) => {
                api.correctStock({
                    id: item.id,
                    materialCode: item.materialCode,
                    realStock: item.realStock
                }).then((value) => {
                    this.doneList.unshift(item)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
            })
        },
        getData() {
            api.getCabinByCode(this.$route.query.CODE)
                .then((val) => {
                    this.cabin = val;

                })
            api.queryMaterialsStockPage({
                cabinCode: this.$route.query.CODE,
                pageSize: 1000
            }).then((page) => {
                this.waitingList = [];
                this.doneList = [];
                page.values.forEach((item) => {
                    Vue.set(item, "realStock", item.currStock < 0 ? 0 : item.currStock)
                    if (item.status == '3') {
                        this.doneList.push(item);
                    } else if (item.status == '2') {
                        this.waitingList.push(item)
                    }
                })
            })
        }
    },
    mounted() {
        this.getData();
        let $this = this;
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
            if (this.cabin && "2" == this.cabin.status) {
                return "结束盘点"
            } else {
                return "开始盘点"
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