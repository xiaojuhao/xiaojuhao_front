<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 基础信息管理</el-breadcrumb-item>
                <el-breadcrumb-item>原料管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form"  label-width="80px">
                <el-form-item label="原料名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="原料编码">
                    <el-input disabled v-model="form.name" placehoder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-select v-model="form.region" placeholder="请选择">
                        <el-option key="bbk" label="个" value="bbk"></el-option>
                        <el-option key="xtc" label="斤" value="xtc"></el-option>
                        <el-option key="imoo" label="克" value="imoo"></el-option>
                        <el-option key="imoo" label="箱" value="imoo"></el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">新增</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

    </div>
</template>

<script>
    var globalcf = require("../../global.json")
    export default {
        data: function(){
            return {
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: true,
                    type: ['步步高'],
                    resource: '小天才',
                    desc: ''
                }
            }
        },
        methods: {
            onSubmit() {
                this.$message.success('提交成功！');
            }
        },
        created(){
            console.log(globalcf)
        }
    }
</script>