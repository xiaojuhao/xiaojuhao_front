<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>调拨单录入</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <header>
            <div class="title">请选择对应的仓库或门店进行操作</div>
        </header>
        <section>
            <router-link v-for="item in mywarehouse" :key="item.id" :to="'diaoboPage?CODE='+item.warehouseCode">
                <el-card :body-style="{ padding: '0px' }" class="card">
                    <img src="../../assets/warehouse.jpg" class="image">
                    <div style="padding: 14px;">
                        <div class="bottom clearfix align-center">
                            <span>{{item.warehouseName}}</span>
                        </div>
                    </div>
                </el-card>
            </router-link>
            <router-link v-for="item in myStores" :key="item.id" :to="'diaoboPage?CODE='+item.storeCode">
                <el-card :body-style="{ padding: '0px' }" class="card">
                    <img :src="item.storeImg" class="image">
                    <div style="padding: 14px;">
                        <div class="bottom clearfix align-center">
                            <span>{{item.storeName}}</span>
                        </div>
                    </div>
                </el-card>
            </router-link>
        </section>
        <footer>
        </footer>
    </div>
</template>
<script>
import { api } from '../common/bus'
export default {
    data() {
        return {
            message: 'messsage',
            mywarehouse: [],
            myStores: [],
            currentDate: '2017-11-12'
        }
    },
    mounted() {
        api.queryMyWarehouse()
            .then((list) => {
                this.$data.mywarehouse = list;
            })
        api.queryMyStores()
            .then((list) => {
                this.$data.myStores = list;
            })
    }
}
</script>
<style scoped>
.title {
    width: 100%;
    margin-left: 60px;
}

header,
section {
    width: 80%;
}

.card {
    width: 200px;
    height: 200px;
    float: left;
    margin-left: 10px;
    margin-top: 10px;
}

.time {
    font-size: 13px;
    color: #999;
}

.bottom {
    margin-top: 13px;
    line-height: 12px;
}

.button {
    padding: 0;
    float: right;
}

.image {
    width: 100%;
    height: 140px;
    display: inline;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}
.align-center {
    text-align: center;
}
</style>