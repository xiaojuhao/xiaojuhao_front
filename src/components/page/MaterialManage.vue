<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="4">
                    <MaterialSelection @input="(val)=>{this.queryCond.materialCode=val;}"></MaterialSelection>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
                <el-col :span="16">
                    <div style="position:relative; float:right; ">
                        <el-button round @click="edit()">增加原料</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-table :data="queryList" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="materialCode" label="原料编码" width="150">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="200">
            </el-table-column>
            <el-table-column v-if="userRole == '1'" prop="utilizationRatio" label="利用率(%)" width="120">
            </el-table-column>
            <el-table-column prop="storageLife" label="保质期" width="120" :formatter="formatStorageLife">
            </el-table-column>
            <el-table-column prop="warningThreshold" label="预警" width="150" :formatter="formatWarning">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="120">
            </el-table-column>
            <el-table-column prop="canSplit" label="是否可拆" width="120">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="100">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
import MaterialSelection from '../common/MaterialSelection'

export default {
    components: {
        MaterialSelection
    },
    data() {
        return {
            tableData: [],
            pageNo: 1,
            pageSize: 5,
            totalRows: 0,
            loadingState: false,
            queryCond: {
                materialCode: ''
            },
            queryList: [],
            userRole: this.$store.state.userRole
        }
    },
    mounted() {
        this.queryData();
    },
    methods: {
        handleCurrentChange(val) {
            this.pageNo = val;
            this.queryData();
        },
        formatStorageLife(row) {
            let re = /(\d+)(\w)/ig;
            let r = re.exec(row.storageLife);
            let ret = "";
            if (r) {
                ret = r[1];
                switch (r[2]) {
                    case "D":
                        ret = ret + "天";
                        break;
                    case "M":
                        ret = ret + "月";
                        break;
                }
            }
            return ret;
        },
        formatWarning(row) {
            if (row.warningThreshold) {
                let w = JSON.parse(row.warningThreshold)
                return "高峰:" + w.high + ",低峰:" + w.low;
            }
            return "";
        },
        queryData() {
            let self = this;
            self.$data.loadingState = true;
            api.queryMaterialsPage({
                    pageSize: self.$data.pageSize,
                    pageNo: self.$data.pageNo,
                    materialCode: self.queryCond.materialCode
                })
                .then((page) => {
                    this.queryList = page.values;
                    this.totalRows = page.totalRows;
                }).fail(function(resp) {
                    self.$message.error("请求出错")
                }).always(function(resp) {
                    self.$data.loadingState = false;
                })
        },
        search() {
            this.queryList = [];
            this.queryData();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSelect(item) {
            this.$data.query.name = item.value;
        },
        querySearch(queryString, cb) {
            var data = [];
            data.push({ id: 1, value: 'aaaaa' })
            data.push({ id: 2, value: 'bbbbb' })
            data.push({ id: 3, value: 'ccccc' })
            console.log(this.$data.query)
            cb(data)
        },
        edit(index, item) {
            this.$router.push({ path: "/materialManagePage", query: { mid: item && item.id } })
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
</style>