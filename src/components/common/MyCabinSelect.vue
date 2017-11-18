<template>
    <div>
        <el-select v-model="selectedCode" placeholder="请选择" filterable clearable :filter-method="filterMethod" @keyup.enter.native="enterkey" @change="setValue" @visible-change="visualChange">
            <el-option v-for="item in valuesShow" :key="item.code" :label="item.name" :value="item.code">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { api } from './bus'
export default {
    props: ["excludes", "value", "context"],
    data() {
        return {
            allValues: [],
            valuesShow: [],
            selectedCode: ''
        }
    },
    mounted() {
        this.initData();
    },
    watch: {
        value(nval, oval) {
            this.initData();
        }
    },
    methods: {
        setValue() {
            this.$emit("input", this.selectedCode, this.$props.context)
        },
        initData() {
            api.queryMyStores()
                .then((list) => {
                    list.forEach((item) => {
                        let ii = {};
                        ii.code = item.storeCode;
                        ii.name = item.storeName;
                        ii.type = "门店";
                        this.allValues.push(ii);
                    })
                });
            api.queryMyWarehouse()
                .then((list) => {
                    list.forEach((item) => {
                        let ii = {};
                        ii.code = item.warehouseCode;
                        ii.name = item.warehouseName;
                        ii.type = "仓库";
                        this.allValues.push(ii);
                    })
                })
        },
        filterMethod(input) {
            let $data = this.$data;
            setTimeout(() => {
                $data.valuesShow = $data.allValues.filter((item) => {
                    var key = [item.code, item.name, item.searchKey].join(',')
                    if (key.indexOf(input) >= 0) {
                        return true;
                    }
                    return false;
                })
            }, 10);
        },
        visualChange(visible) {
            if (visible) {
                this.$data.valuesShow = this.$data.allValues.filter((item) => {
                    if (this.excludesMap[item.code]) {
                        return false;
                    }
                    return true;
                })
            }
        }
    },
    computed: {
        excludesMap() {
            let map = {};
            this.$props.excludes && this.$props.excludes.forEach((item) => {
                map[item] = 1;
            })
            return map;
        }
    }
}
</script>