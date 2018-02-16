<template>
    <div class="table">
        <div class="handle-box">
            <MyCabinSelect @input="(val)=>{this.queryCond.cabinCode=val;}"></MyCabinSelect>
            <el-input v-model="queryCond.materialName" placeholder="原料名称搜索" style="width:120px"></el-input>
            <el-date-picker v-model="startDate" type="date" placeholder="起始日期" style="width:130px">
            </el-date-picker>
            -
            <el-date-picker v-model="endDate" type="date" placeholder="结束日期" style="width:130px">
            </el-date-picker>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-card v-for="item in data" :key="item.id" :body-style="{ padding: '0px' }" class="card">
            <div style="position:relative;margin:0px;">
                <span><strong>仓库：</strong>{{item.cabinName}}</span>
                <span><strong>原料：</strong>{{item.materialName}}</span>
                <span><strong>损失：</strong>{{item.stockAmt}}{{item.stockUnit}}</span>
                <span><strong>报损人: </strong>{{item.creatorName}}</span>
                <span><strong>报损时间：</strong>{{item.createTime}}</span>
                <br>
                <span><strong>损耗原因：</strong>{{item.remark}}</span>
            </div>
            <div style="position:relative;">
                <img v-for="img in item.images" :src="server+'/file/show?image='+img" class="image">
            </div>
        </el-card>
        <div>
            <el-button type="primary" :disabled="isDisabled" @click="getData(2)">加载更多</el-button>
        </div>
    </div>
</template>
<script>
import { api, config, util } from '../common/bus'
import MyCabinSelect from '../common/MyCabinSelect'
export default {
    components: {
        MyCabinSelect
    },
    data() {
        return {
            tableData: [],
            pageSize: 10,
            pageNo: 1,
            server: config.server,
            queryCond: {
                cabinCode: '',
                materialName: ''
            },
            isDisabled: false,
            startDate: null,
            endDate: null
        }
    },
    mounted() {
        this.getData(1);
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
        getData(type) {
            if (type == 1) {
                this.pageNo = 1
            }
            let param = {
                pageNo: this.pageNo,
                pageSize: this.pageSize,
            }
            this.queryCond.startCreatedTime = util.formatDateT(this.startDate)
            this.queryCond.endCreatedTime = util.formatDateT(this.endDate)
            Object.assign(param, this.queryCond)
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
    width: 90%;
    margin: 10px;
}
</style>