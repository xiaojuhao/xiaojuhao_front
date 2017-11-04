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
                    <el-input v-model="form.materialName"></el-input>
                </el-form-item>
                <el-form-item label="原料编码">
                    <el-input disabled v-model="form.materialCode" placehoder="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="单位">
                    <el-select v-model="form.stockUnit" placeholder="请选择">
                        <el-option key="bbk" label="个" value="个"></el-option>
                        <el-option key="xtc" label="斤" value="斤"></el-option>
                        <el-option key="imoo" label="克" value="克"></el-option>
                        <el-option key="imoo" label="箱" value="箱"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可拆">
                    <el-switch v-model="form.boolCanSplit" @change="canSplitChange">
                    </el-switch>
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
    export default {
        data: function(){
            return {
                form: {
                    id:this.$route.query.mid,
                    materialName:'',
                    materialCode:'',
                    stockUnit:'',
                    boolCanSplit:'',
                    searchKey:''
                },
                rules: {

                }
            }
        },
        methods: {
            onSubmit() {
                let self = this;
                jquery.ajax({
                    url:config.server+'/busi/addMaterials',
                    data:this.$data.form,
                    dataType:'jsonp'
                }).then((resp)=>{
                    self.$message.success("新增成功")
                })
                
            },
            onCancel(){
                this.$router.go(-1)
            },
            canSplitChange(){
                
            }
        },
        computed:{
            canSplit(){
                return this.$data.form.boolCanSplit?"Y":"N";
            }
        },
        created(){
            
        },
        mounted(){
            let form = this.$data.form;
            jquery.ajax({
                url:config.server+'/busi/queryMaterialById',
                data:{id:this.$data.form.id},
                dataType:'jsonp'
            }).then((resp)=>{
                if(resp.code==200 && resp.value ){
                    var v = resp.value;
                    form.materialName = v.materialName;
                    form.materialCode = v.materialCode;
                    form.stockUnit = v.stockUnit;
                    form.searchKey = v.searchKey;
                }
            })
        }
    }
</script>