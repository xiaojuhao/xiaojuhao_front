<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 进销存管理</el-breadcrumb-item>
                <el-breadcrumb-item>入库</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :inline="true" :model="formInline" label-width="80px">
                <el-form-item label="原料名称">
                    <el-input readonly v-model="item.materialName" ></el-input>
                </el-form-item>
                <el-form-item label="原料编码">
                    <el-input readonly v-model="item.materialCode"></el-input>
                </el-form-item>
                <el-form-item label="当前库存">
                    <el-input readonly v-model="item.currStock"></el-input>
                </el-form-item>
                <el-form-item label="已用数量">
                    <el-input readonly v-model="item.usedStock"></el-input>
                </el-form-item>
                <el-form-item label="库存类型">
                    <el-input readonly v-model="stockTypeName"></el-input>
                </el-form-item>
                <el-row>
                	<el-col>
                		<el-form-item label="入库数量">
                    		<el-input v-model="outStockAmt"></el-input>
                		</el-form-item>
                	</el-col>
                </el-row>
                <el-row>
                	<el-col>
		                <el-form-item inline="false">
		                    <el-button type="primary" @click="onSubmit">提交</el-button>
		                    <el-button>取消</el-button>
		                </el-form-item>
                	</el-col>
            	</el-row>
            </el-form>
        </div>
    </div>
</template>

<script>
	import config from '../common/config.vue'
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
                },
                item:{},
                outStockAmt:0
            }
        },
        methods: {
            onSubmit() {
                //this.$message.success('提交成功！');
                this.$router.go(-1)
            },
            initData() {
            	var jsonp = require('jsonp')
            	var $data = this;
            	jsonp(config.server+"/queryMaterialsStockById?id=1",null,function(err,data){
            		// console.log(data)
            		$data.item = data.value;
            	})
            }
        },
        computed:{
        	stockTypeName:function(){
        		if(this.item.stockType && this.item.stockType==1){
        			return '总库'
        		}else{
        			return '分库'
        		}
        	}
        },
        mounted(){
        	this.initData();
        }
    }
</script>
<style>
.noborder {
	border-left:0px;
	border-top:0px;
	border-right:0px;
	border-bottom:1px;
}
</style>