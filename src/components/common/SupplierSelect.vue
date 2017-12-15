<template>
    <div style="display:inline">
        <el-select v-model="selectedCode" placeholder="供应商" filterable clearable :filter-method="filterMethod" @keyup.enter.native="enterkey" @change="setValue" @visible-change="visualChange">
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
            api.querySupplierPage({
                pageSize: 2000
            }).then((page) => {
                page.values.forEach((item) => {
                    let ii = {};
                    ii.code = item.supplierCode;
                    ii.name = item.supplierName;
                    ii.type = "供应商"
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