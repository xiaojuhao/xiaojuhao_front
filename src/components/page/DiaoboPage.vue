<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>调拨</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :inline="true" label-width="80px" class="table-simple">
                <el-form-item label="原料名称">
                    <span>{{item.materialName}}</span>
                </el-form-item>
                <el-form-item label="原料编码">
                    <span>{{item.materialCode}}</span>
                </el-form-item>
                <el-form-item label="当前库存">
                    <span>{{item.currStock}}</span>
                </el-form-item>
                <el-form-item label="仓库/门店">
                    <span>{{item.cabinName}}</span>
                </el-form-item>
                <el-form-item label="调拨数量">
                    <el-input v-model="diaoboAmt"></el-input>
                </el-form-item>
                <el-form-item label="拨入">
                    <el-select v-model="toCabinCode" placeholder="请选择">
                        <el-option v-for="item in allCabins" :key="item.cabinCode" :label="item.cabinName" :value="item.cabinCode">
                            <span style="float: left">{{ item.cabinName }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="el-form-item-button">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <span style="margin-right:20px"></span>
                    <el-button @click="onBack">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import config from '../common/config.vue'
import { api } from '../common/bus'

export default {
    data: function() {
        return {
            item: {},
            diaoboAmt: 0,
            allCabins: [],
            toCabinCode: ''
        }
    },
    methods: {
        onSubmit() {
            api.diaobo({
                materialCode: this.item.materialCode,
                diaoboAmt: this.diaoboAmt,
                fromCabCode: this.item.cabinCode,
                toCabCode: this.toCabinCode
            }).then((val) => {
                this.$message("提交成功")
                this.$router.go(-1)
            }).fail((resp) => {
                this.$message.error(resp.message)
            })
        },
        onBack() {
            this.$router.go(-1)
        },
        initData() {
            var stockId = this.$route.query.stockId;
            config.queryMaterialsStockById(stockId, (resp) => {
                this.item = resp.value;
            })
        }
    },
    computed: {

    },
    mounted() {
        this.initData();
        api.getAllStoreList()
            .then((stores) => {
                stores.forEach((s) => {
                    let c = {};
                    c.cabinCode = s.storeCode;
                    c.cabinName = s.storeName;
                    c.type = "门店"
                    this.allCabins.push(c);
                })
            })

        api.getAllWarehouseList()
            .then((wares) => {
                wares.forEach((w) => {
                    let c = {}
                    c.cabinCode = w.warehouseCode;
                    c.cabinName = w.warehouseName;
                    c.type = "仓库"
                    this.allCabins.push(c)
                })
            })
    },
    activated() {

    }
}
</script>
<style scoped>
.table-simple {
    font-size: 0;
}

.table-simple label {
    width: 90px;
    color: #99a9bf;
    background-color: red;
}

.table-simple .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.table-simple .el-form-item2 {
    width: 90%;
}

.el-form-item-button {
    margin-top: 10px;
    margin-left: 20%;
    width: 90%;
}
</style>