<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="4">
                    <MaterialSelection @input="(v)=>{this.query.materialCode=v}"></MaterialSelection>
                </el-col>
                <el-col :span="4">
                    <MyCabinSelect @input="(val)=>{this.query.cabinCode=val}"></MyCabinSelect>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="data" border style="width: 100%" v-loading="loadingState" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgb(0, 0, 0, 0.8)">
            <el-table-column prop="materialCode" label="原料编码" width="100">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="120">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="100">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="cabinName" label="仓库" width="200">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="100">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template scope="scope">
                    <el-button size="small" type="primary" @click="correctStock(scope.$index, scope.row)">盘点库存</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page.sync="cur_page" layout="prev, pager, next" :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import config from '../common/config.vue'
import OutStock from './OutStock.vue'
import jquery from 'jquery'
import { api } from '../common/bus'
import MyCabinSelect from '../common/MyCabinSelect'
import MaterialSelection from '../common/MaterialSelection'
export default {
    components: {
        MyCabinSelect,
        MaterialSelection
    },
    data() {
        return {
            tableData: [],
            cur_page: 1,
            pageSize: 5,
            totalRows: 0,
            loadingState: false,
            query: {
                cabinCode: '',
                materialCode: ''
            },
            showOutStock: false
        }
    },
    created() {
        console.log('created......')
    },
    mounted() {
        this.getData()
    },
    activated() {
        console.log("activated......");
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
        handleCurrentChange(val) {
            this.cur_page = val;
            this.getData();
        },
        getData() {
            let self = this;
            self.$data.loadingState = true;
            let param = {
                pageSize: self.pageSize,
                pageNo: self.cur_page,
                materialCode: self.query.materialCode,
                cabinCode: self.query.cabinCode,
                stockType: '2'
            };

            api.queryMaterialsStockPage(param)
                .then((page) => {
                    self.tableData = page.values;
                    self.totalRows = page.totalRows;
                }).fail(function(resp) {
                    self.$message.error("请求出错")
                }).always(function(resp) {
                    self.$data.loadingState = false;
                })
        },
        search() {
            this.cur_page = 1;
            this.tableData = [];
            this.getData();
        },
        formatStockType(row, column) {
            return row.stockType == 1 ? "总库" : "分库";
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        correctStock(index, item) {
            this.$prompt("请输入【" + item.materialName + "-" + item.materialCode + "】的真实库存", '判断库存', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\d+(\.\d{1,2})?$/,
                inputErrorMessage: '库存数字不正确'
            }).then(({ value }) => {
                //确定提交
                api.correctStock({
                        id: item.id,
                        materialCode: item.materialCode,
                        realStock: value
                    })
                    .then((value) => {
                        this.$message("任务提交成功")
                    }).fail((resp) => {
                        this.$message.error("系统异常")
                    })
            }).catch(() => {
                //取消操作     
            });
        },
        instock(index, item) {
            this.$router.push({ path: "/inStock", query: { stockId: item.id } })
        },
        handleEdit(index, row) {
            this.$message('编辑第' + (index + 1) + '行');
        },
        handleDelete(index, row) {
            this.$message.error('删除第' + (index + 1) + '行');
        },
        delAll() {
            const self = this,
                length = self.multipleSelection.length;
            let str = '';
            self.del_list = self.del_list.concat(self.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += self.multipleSelection[i].name + ' ';
            }
            self.$message.error('删除了' + str);
            self.multipleSelection = [];
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