<template>
    <div class="container">
        <div>
            <div class="handle-box">
                <el-row :gutter="10">
                    <el-col :span="16">
                        <MyStoreSelect @input="(v)=>{this.queryCond.storeCode=v;}"></MyStoreSelect>
                        <el-input v-model="queryCond.recipesName" style="width:140px;" placeholder="菜名">
                        </el-input>
                        <el-input v-model="queryCond.recipesType" style="width:140px;" placeholder="菜名">
                        </el-input>
                        <el-button type="primary" icon="search" @click="testRecipes">测试</el-button>
                        <el-button type="primary" icon="search" @click="syncMenu">同步</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column prop="dishes_id" label="外部编码">
                </el-table-column>
                <el-table-column prop="dishes_name" label="菜品名称">
                </el-table-column>
                <el-table-column prop="dishes_type_name" label="菜品类型">
                </el-table-column>
                <el-table-column prop="price" label="价格">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus.js'
import MyStoreSelect from '../common/MyStoreSelect'
import Vue from 'vue'


export default {
    components: {
        MyStoreSelect
    },
    data() {
        return {
            queryCond: {
                storeCode: '',
                recipesName: '',
                recipesType: ''
            },
            queryList: []
        }
    },
    computed: {
        tableData() {
            return this.queryList.filter((t) => {
                return t.dishes_name.indexOf(this.queryCond.recipesName) >= 0 &&
                    t.dishes_type_name.indexOf(this.queryCond.recipesType) >= 0
            })
        }
    },
    methods: {
        testRecipes() {
            api.getRecipesFromRemote(this.queryCond)
                .then((value) => {
                    console.log(value)
                    this.queryList = value.allDishes;
                    this.queryList.sort((a,b) => a.dishes_id - b.dishes_id)
                }).fail((resp) => {
                    this.$message.error(resp.message)
                })
        },
        syncMenu() {
            api.syncRecipes(this.queryCond)
                .then(() => {
                    this.$message("同步菜单成功")
                })
        }
    }
}
</script>
<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.el-select {
    width: 120px;
}

.el-input {
    width: 180px;
    display: inline-block;
}

.el-row {
    margin-bottom: 4px;
    &:last-child {
        margin-bottom: 0;
    }
}

.container {
    position: relative;
    width: 100%;
}
</style>