<template>
    <div class="table">
        <div class="handle-box">
            报损单状态
            <el-select v-model="query.status">
                <el-option label="配送中" value="4"></el-option>
                <el-option label="已入库" value="5"></el-option>
                <el-option label="撤销" value="6"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索采购单</el-button>
        </div>
        <el-card v-for="item in data" :body-style="{ padding: '0px' }" class="card">
            <div style="position:relative;margin:20px;">
                <span><strong>门店：</strong>{{item.cabinName}}</span>
                <span><strong>原料：</strong>{{item.materialName}}</span>
                <br>
                <br>
                <span><strong>报损时间：</strong>{{item.createTime}}</span>
                <br>
                <br>
                <span><strong>损失：</strong>{{item.stockAmt}}{{item.stockUnit}}</span>
                <span><strong>报损人: </strong>{{item.creator}}</span>
            </div>
            <div style="position:relative;">
                <img v-for="img in item.images" :src="server+'/file/show?image='+img" class="image">
            </div>
        </el-card>
        <div>
            <el-button type="primary" :disabled="isDisabled" @click="getData">加载更多</el-button>
        </div>
    </div>
</template>
<script>
import { api, config } from '../common/bus'
export default {
    data() {
        return {
            tableData: [],
            pageSize: 5,
            pageNo: 1,
            server: config.server,
            query: {
                status: ''
            },
            isDisabled: false
        }
    },
    mounted() {
        this.getData();
    },
    computed: {
        data() {
            const self = this;
            return self.tableData.filter(function(d) {
                return d;
            })
        }
    },
    methods: {
        getData() {
            let param = {
                pageNo: this.pageNo,
                pageSize: this.pageSize
            }
            api.queryMyLossApplyDetail(param)
                .then((list) => {
                    if (!list || !list.length) {
                        this.isDisabled = true;
                    } else {
                        list.forEach((item) => this.tableData.push(item))
                        this.pageNo = this.pageNo + 1;
                    }
                })
        },
        search() {
            this.tableData = [];
            this.pageNo = 1;
            this.isDisabled = false;
            this.getData();
        }
    }
}
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.image {
    width: 130px;
    height: 100px;
    margin: 10px;
}

.card {
    width: 50%;
    margin: 10px;
}
</style>