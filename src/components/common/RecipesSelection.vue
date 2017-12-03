<template>
    <div>
        <el-select v-model="selectedCode" placeholder="请选择" filterable clearable :filter-method="filterMethod" @change="setValue" @visible-change="visualChange">
            <el-option v-for="item in valuesShow" :key="item.recipesCode" :label="item.recipesName" :value="item.recipesCode">
            </el-option>
        </el-select>
    </div>
</template>
<script>
import { api, util } from './bus'
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
            api.queryAllRecipes()
                .then((value) => {
                    this.allValues = value;
                    this.selectedCode = this.$props.value;
                });
        },
        filterMethod(input) {
            setTimeout(() => {
                this.valuesShow = this.allValues.filter((item) => {
                    var key = [item.recipesCode, item.recipesName, item.searchKey].join(',')
                    return util.matchSearch(key, input)
                })
            }, 10);
        },
        visualChange(visible) {
            if (visible) {
                this.$data.valuesShow = this.$data.allValues.filter((item) => {
                    if (this.excludesMap[item.recipesCode]) {
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