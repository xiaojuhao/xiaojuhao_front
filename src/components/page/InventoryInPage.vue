<template>
    <div v-loading="loadingState">
    	<div class="handbox" >
    		<el-autocomplete id="handbox"
			  v-model="storeCode"
			  :fetch-suggestions="querySearchAsync"
			  placeholder="请输入内容"
			  @select="handleSelect">
			</el-autocomplete> 
            <span>搜索内容后回车或选中添加记录</span>
    	</div>
        <div class="form-box">
            <el-row>
                <el-col  :span="4"><div class="grid-content bg-purple">品名</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple">供应商</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">数量</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">单价</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">单位</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">生产日期</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">保质期</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple">金额</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple">仓库/门店</div></el-col>
            </el-row>
            <el-row v-for="(item,index) in recipesList">
                <el-col class="grid-content" :span="4">{{item.material}}</el-col>
                <el-col class="grid-content" :span="4">{{item.supplier}}</el-col>
                <el-col class="grid-content" :span="2">
                    <el-input v-model="item.amt" style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="item.price" style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col class="grid-content" :span="2">{{item.stockUnit}}</el-col>
                <el-col class="grid-content" :span="2">{{currDate}}</el-col>
                <el-col class="grid-content" :span="2">3天</el-col>
                <el-col class="grid-content" :span="2">
                    <el-input readonly :value="calcTotalPrice(item.amt , item.price)" 
                        style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col class="grid-content" :span="3">{{storeage.name}}</el-col>
                <el-col :span="1"><el-button icon="delete" size="mini" @click="removeRows(index)"></el-button></el-col>
            </el-row>
            <el-row style="margin-top:20px;">
                <el-col :offset="6">
                    <el-button type="primary" :disabled="recipesList.length==0" @click="onSubmit">提交入库</el-button>
                    <el-button type="primary" @click="onClear">清空</el-button>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
    import {api,http} from '../common/bus'
    import StoreSelection from '../common/StoreSelection'
    import RecipesSelection from '../common/RecipesSelection'
    import jquery from 'jquery'
    import Vue from 'vue'
    export default {
        data(){
            return {
                storeCode:'',
                recipesList:[],
                currSelectAlts:[],
                loadingState:false,
                currDate:'20171113',
                storeage:{
                    code:'',
                    type:'',//1:仓库 2:门店
                    name:''
                },
                allMaterialSupplier:[]
             }
        },
        methods: {
            onClear(){
                let self = this;
                this.$confirm('是否清空当前页内容?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  self.recipesList = [];
                })
            },
            onSubmit(){
                let self = this;
                this.$confirm('是否提交入库?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                    this.loadingState = true;
                    this.$message({
                      type: 'success',
                      message: '入库成功!'
                    });
                    self.recipesList = [];
                    setTimeout(()=>{
                        this.loadingState = false;
                    },2000)
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '取消入库'
                  });          
                });
            },
            removeRows(index){
            	this.$data.recipesList.splice(index,1)
            },
            querySearchAsync(queryString, cb){
                queryString = jquery.trim(queryString)
            	
            	let result = this.allMaterialSupplier.map((item)=>{
                    return {
                        id:item.id,
                        value:item.materialName+"-"+item.supplierName,
                        supplier:item.supplierName,
                        material:item.materialName
                    }
                }).filter((item)=>{
                    return item.value.indexOf(queryString) >=0;
                })

                this.$data.currSelectAlts = result;
            	cb(result)
            },
            addAltsToList(){
                if(this.recipesList.length>10){
                    this.$message.error("添加记录太多,请先入库")
                    return
                }
                let self = this;
                this.currSelectAlts.forEach((item)=>{
                    if(!this.recipesListMap[item.id]){
                        Vue.set(item,'amt',0)
                        Vue.set(item,'price',0)
                        self.recipesList.push(item)
                    }
                })
            },
            handleSelect(item){
            	this.currSelectAlts = [item]
                this.storeCode = '';
                this.addAltsToList();
            },
            onEnterKeyPressed(){
                if(this.loadingState){
                    return;
                } 
                this.loadingState = true;
                setTimeout(()=>{
                    this.addAltsToList()
                    this.loadingState = false;
                }, 0)
            },
            calcTotalPrice(amt,price){
                var total = 0.00;
                if(amt && price){
                    total = amt * price;
                    return total.toFixed(2);
                }
                return total;
            }
        },
        mounted(){
            if(new RegExp("^WH").test(this.$route.query.CODE)){
                api.getWarehouseByCode(this.$route.query.CODE)
                .then((val)=>{
                    this.storeage.code = val.warehouseCode;
                    this.storeage.type = "1";
                    this.storeage.name = val.warehouseName;
                })
            }else if(new RegExp("^MD").test(this.$route.query.CODE)){
                api.queryStoreByCode(this.$route.query.CODE)
                .then((val)=>{
                    this.storeage.code = val.storeCode;
                    this.storeage.type = "1";
                    this.storeage.name = val.storeName;
                })
            }
            
            api.queryAllMaterialSuppler()
            .then((values)=>{
                this.allMaterialSupplier = values;
            })
            //添加回车监听
            jquery("#handbox").keyup((event)=>{
              if(event.keyCode ==13){
                 this.onEnterKeyPressed();
              }
            });
        },
        computed: {
            recipesListMap(){
                let map = {};
                this.recipesList.forEach((item)=>map[item.id]=item)
                return map;
            }
        },
        components:{
          StoreSelection,
          RecipesSelection
        }
    }
</script>
<style scoped>
	.form-box{
		margin-top: 20px;
        width: 90%;
	}
    .border-table {   
        border-collapse: collapse;   
        border: none;   
    }   
    .border-table td {   
        border: solid #000 1px;   
    }
    .border-table th {   
        border: solid #000 1px;   
    }
    .el-input {
	    width: 150px;
	}
    .el-row {
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
    }
    .bg-purple {
        background: #d3dce6;
    }
    .grid-content{
        min-height: 1px;
        text-align: center;
        
    }
</style>