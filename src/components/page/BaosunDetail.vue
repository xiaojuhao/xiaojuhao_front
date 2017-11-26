<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存</el-breadcrumb-item>
                <el-breadcrumb-item>原料报损</el-breadcrumb-item>
                <el-breadcrumb-item>{{form.cabinName}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{form.materialName}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="80px" v-loading="loadingState">
                <el-form-item label="原料名称">
                    <el-input disabled v-model="form.materialName"></el-input>
                </el-form-item>
                <el-form-item label="原料编码">
                    <el-input disabled v-model="form.materialCode" placehoder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="报损额">
                    <el-input v-model="form.lossAmt" placehoder="报损额" style="width:120px">
                        <template slot="append">
                            {{form.stockUnit}}
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="form.remark" placehoder="备注"></el-input>
                </el-form-item>
                <el-form-item label="添加图片">
                    <el-upload class="upload-demo" :action="actionUrl" :on-remove="handleRemove" 
                    accept="image/*"
                    :on-success="handleSuccess" :file-list="fileList" :data="form">
                        <el-button size="small" type="primary">添加文件</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
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
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            form: {
                id: this.$route.query.id,
                cabinCode:'',
                cabinName:'',
                materialName: '',
                materialCode: '',
                stockUnit: '',
                lossAmt:0,
                busiNo:'',
                remark:''
            },
            rules: {

            },
            actionUrl: config.server+'/file/upload',
            fileList: [],
            loadingState: false,
            splitMaterials: []
        }
    },
    methods: {
        onSubmit() {
            this.loadingState = true;
            api.claimLoss(this.form)
                .then((resp) => {
                    this.$message.success("操作成功");
                    this.$router.go(-1)
                }).always(() => {
                    this.loadingState = false;
                })
        },
        onCancel() {
            this.$router.go(-1)
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleSuccess(resp, fileList) {
            this.form.busiNo = resp.value.busiNo;
        }
    },
    mounted() {
        api.queryMaterialsStockById(this.form.id)
            .then((v) => {
                console.log(v)
                let re = /(\d+)(\w)/ig;
                console.log(v)
                this.form.materialName = v.materialName;
                this.form.materialCode = v.materialCode;
                this.form.cabinCode = v.cabinCode;
                this.form.cabinName = v.cabinName;
                this.form.stockUnit = v.stockUnit;
                let r = re.exec(v.storageLife)
                if (r) {
                    this.form.storageLifeNum = r[1];
                    this.form.storageLifeUnit = r[2];
                }
            })
    }
}
</script>
<style>
.upload-demo {}

.el-upload {
    height: 100px;
    display: inline-block;
    text-align: center;
    cursor: pointer;
}

.el-upload {
    height: 40px;
    width: 100px;
    border: 0;
    display: inline;
}
.el-upload__tip{
    display: inline;
}
</style>