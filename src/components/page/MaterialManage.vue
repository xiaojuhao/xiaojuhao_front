<template>
    <div class="table">
        <div class="handle-box">
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-select v-model="queryCond.category" style="width:100px" clearable placeholder="分类">
                        <el-option v-for="item in categorySel" :key="item.unitCode" :label="item.unitName" :value="item.unitCode">
                        </el-option>
                    </el-select>
                    <el-input v-model="queryCond.searchKey" style="width:180px" placeholder="搜索条件"></el-input>
                    <el-button type="primary" icon="search" @click="search">搜索</el-button>支持原料名称、配音搜索
                </el-col>
                <el-col :span="8">
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
            <el-table-column prop="category" label="分类" width="200">
            </el-table-column>
            <el-table-column v-if="userRole == '1'" prop="utilizationRatio" label="利用率(%)" width="120">
            </el-table-column>
            <el-table-column prop="storageLife" label="保质期" width="120" :formatter="formatStorageLife">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="">
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="primary" @click="edit(scope.$index, scope.row)">
                        编辑
                    </el-button>
                    <el-button size="small" type="primary" @click="delMaterial(scope.$index, scope.row)">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="queryCond.totalRows" :page-size="queryCond.pageSize" :current-page.sync="queryCond.pageNo">
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
            loadingState: false,
            queryCond: {
                pageNo: 1,
                pageSize: 10,
                totalRows: 0,
                materialCode: '',
                searchKey: '',
                category: ''
            },
            queryList: [],
            categorySel: [],
            userRole: this.$store.state.userRole
        }
    },
    mounted() {
        this.loadParam();
        this.queryData();
        api.queryUnitByGroup('material_category').then((cates) => this.categorySel = cates);
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
        formatSpec(row) {
            if (row.specUnit == '无') {
                return '无'
            }
            return row.specQty + row.stockUnit + "/" + row.specUnit;
        },
        queryData() {
            this.loadingState = true;
            api.queryMaterialsPage({
                    pageSize: this.queryCond.pageSize,
                    pageNo: this.queryCond.pageNo,
                    materialCode: this.queryCond.materialCode,
                    searchKey: this.queryCond.searchKey,
                    category: this.queryCond.category,
                    status: '1'
                })
                .then((page) => {
                    this.queryList = page.values;
                    this.queryCond.totalRows = page.totalRows;
                }).fail((resp) => {
                    this.$message.error("请求出错")
                }).always((resp) => {
                    this.loadingState = false;
                })
        },
        search() {
            this.queryList = [];
            this.queryData();
        },
        edit(index, item) {
            this.keepParam();
            this.$router.push({ path: "/materialManagePage", query: { mid: item && item.id } })
        },
        delMaterial(index, item) {
            let tips = "是否删除" + item.materialName + "?"
            this.$confirm(tips, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteMaterials(item.materialCode)
                    .then(() => {
                        this.queryData();
                    }).fail((resp) => {
                        this.$message.error(resp.message)
                    })
            })

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