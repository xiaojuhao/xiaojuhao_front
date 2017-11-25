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
                            <el-option label="天" value="D"></el-option>
                            <el-option label="月" value="M"></el-option>
                        </el-select>
                    </el-input>
                </el-form-item>
                <el-form-item label="采购单位">
                    <el-select v-model="form.specUnit" style="width:80px" placeholder="请选择">
                        <el-option label="无" value="无"></el-option>
                        <el-option label="包" value="包"></el-option>
                        <el-option label="箱" value="箱"></el-option>
                    </el-select>
                    <span v-if="form.specUnit != '无'">
                    <el-input v-model="form.specQty" style="width:140px">
                        <el-select v-model="form.stockUnit" slot="append" style="width:80px" placeholder="请选择">
                            <el-option key="A" label="个" value="个"></el-option>
                            <el-option key="KG" label="千克" value="千克"></el-option>
                            <el-option key="G" label="克" value="克"></el-option>
                        </el-select>
                    </el-input>
                    <span>说明:规格单位，如10KG/包，20个/箱等</span>
                    </span>
                </el-form-item>
                <el-form-item label="使用单位">
                    <el-select v-model="form.stockUnit" style="width:80px" placeholder="请选择">
                        <el-option key="A" label="个" value="个"></el-option>
                        <el-option key="KG" label="千克" value="千克"></el-option>
                        <el-option key="G" label="克" value="克"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="搜索短语">
                    <el-input v-model="form.searchKey"></el-input>
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
                specUnit: 'NONE',
                specQty: 0,
                stockUnit: '',
                searchKey: '',
                storageLifeUnit: 'D',
                storageLifeNum: ''
            },
            rules: {

            },
            loadingState: false,
            splitMaterials: []
        }
    },
    methods: {
        onSubmit() {
            this.loadingState = true;
            api.addMaterials(this.form)
                .then((resp) => {
                    this.$message.success("操作成功");
                    this.$router.go(-1)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onCancel() {
            this.$router.go(-1)
        }
    },
    mounted() {
        api.queryMaterialById(this.form.id)
            .then((v) => {
                let re = /(\d+)(\w)/ig;
                console.log(v)
                this.form.materialName = v.materialName;
                this.form.materialCode = v.materialCode;
                this.form.stockUnit = v.stockUnit;
                this.form.searchKey = v.searchKey;
                this.form.specUnit = v.specUnit;
                this.form.specQty = v.specQty || 0;
                this.form.utilizationRatio = v.utilizationRatio;
                let r = re.exec(v.storageLife)
                if (r) {
                    this.form.storageLifeNum = r[1];
                    this.form.storageLifeUnit = r[2];
                }
            })
    }
}
</script>