<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="80px" v-loading="loadingState">
                <el-form-item label="原料名称">
                    <el-input v-model="form.materialName"></el-input>
                </el-form-item>
                <el-form-item label="原料编码">
                    <el-input disabled v-model="form.materialCode" placehoder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="利用率(%)">
                    <el-slider v-model="form.utilizationRatio" :min="50" :max="100" :show-input="true"></el-slider>
                </el-form-item>
                <el-form-item label="保质期">
                    <el-input v-model="form.storageLifeNum" style="width:160px">
                        <el-select v-model="form.storageLifeUnit" slot="append" style="width:80px" placeholder="请选择">
                            <el-option label="小时" value="H"></el-option>
                            <el-option label="天" value="D"></el-option>
                            <el-option label="月" value="M"></el-option>
                            <el-option label="年" value="Y"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-select v-model="form.stockUnit" style="width:160px" placeholder="请选择">
                        <el-option key="A" label="个" value="个"></el-option>
                        <el-option key="KG" label="千克" value="千克"></el-option>
                        <el-option key="G" label="克" value="克"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="预警值">
                    <el-row :gutter="6">
                        <el-col :span="6">
                            <el-input v-model="highThreshold">
                                <template slot="prepend">高峰</template>
                            </el-input>
                        </el-col>
                        <el-col :span="6">
                            <el-input v-model="lowThreashold">
                                <template slot="prepend">低峰</template>
                            </el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="搜索短语">
                    <el-input v-model="form.searchKey"></el-input>
                </el-form-item>
                <el-form-item label="是否可拆">
                    <el-switch v-model="form.canSplit" on-text="是" off-text="否" on-value="Y" off-value="N">
                    </el-switch>
                </el-form-item>
                <el-form-item label="拆分原料" v-if="form.canSplit == 'Y'">
                    <ul>
                        <li v-for="ss in splitMaterials" style="list-style-type:none">
                            <el-row>
                                <el-col :span="6">
                                    <MaterialSelection :value="ss.materialCode" :context="ss" @input="onSelectMaterial">
                                    </MaterialSelection>
                                </el-col>
                                <el-col :span="6">
                                    <el-input v-model="ss.splitAmt">
                                        <template slot="prepend">每</template>
                                        <template slot="append">单位</template>
                                    </el-input>
                                </el-col>
                            </el-row>
                        </li>
                    </ul>
                    <el-button type="primary" @click="addSplitMaterial">增加原料</el-button>
                </el-form-item>
                <el-row>
                    <el-col>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">提交</el-button>
                            <el-button type="primary" @click="onCancel">取消</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
    </div>
</template>
<script>
import MaterialSelection from '../common/MaterialSelection'
import config from '../common/config.vue'
import jquery from 'jquery'
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            form: {
                id: this.$route.query.mid,
                materialName: '',
                materialCode: '',
                utilizationRatio: 100,
                stockUnit: '',
                canSplit: '',
                searchKey: '',
                formulaStr: '',
                storageLifeUnit: 'D',
                storageLifeNum: '',

            },
            rules: {

            },
            loadingState: false,
            splitMaterials: [],
            highThreshold: 0,
            lowThreashold: 0
        }
    },
    methods: {
        onSubmit() {
            this.loadingState = true;
            let self = this;
            this.form.splitMaterialsStr = JSON.stringify(this.splitMaterials);
            this.form.warningThreshold = JSON.stringify({ high: this.highThreshold, low: this.lowThreashold })
            api.addMaterials(this.form)
                .then((resp) => {
                    self.$message.success("操作成功");
                    self.$router.go(-1)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        addSplitMaterial() {
            this.splitMaterials.push({
                id: 0,
                materialName: '',
                materialCode: '',
                splitAmt: 0
            })
        },
        onSelectMaterial(ctx, value) {
            ctx.materialCode = value;
        }
    },
    computed: {

    },
    created() {

    },
    mounted() {
        let form = this.$data.form;
        jquery.ajax({
            url: config.server + '/busi/queryMaterialById',
            data: { id: this.$data.form.id },
            dataType: 'jsonp'
        }).then((resp) => {
            console.log(resp)
            if (resp.code == 200 && resp.value) {
                let re = /(\d+)(\w)/ig;
                let v = resp.value;
                form.materialName = v.materialName;
                form.materialCode = v.materialCode;
                form.stockUnit = v.stockUnit;
                form.searchKey = v.searchKey;
                form.canSplit = v.canSplit;
                form.utilizationRatio = v.utilizationRatio;
                if (v.warningThreshold) {
                    let threshold = JSON.parse(v.warningThreshold)
                    this.lowThreashold = threshold.low;
                    this.highThreshold = threshold.high;
                }

                let r = re.exec(v.storageLife)
                if (r) {
                    form.storageLifeNum = r[1];
                    form.storageLifeUnit = r[2];
                }
                api.queryMaterialSplitByMaterialCode(this.form.materialCode)
                    .then((list) => {
                        console.log(list)
                        this.splitMaterials = list;
                    })
            }
        })


    },
    components: {
        MaterialSelection
    }
}
</script>