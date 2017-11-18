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
            <span style="float:right;position:relative;margin-right:20%;margin-top:10px;">
                {{storage.code}} {{storage.name}}
            </span>
    	</div>
        <div class="form-box">
            <el-row>
                <el-col :span="4"><div class="grid-content bg-purple head-row">品名</div></el-col>
                <el-col :span="4"><div class="grid-content bg-purple head-row">供应商</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple head-row">数量</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple head-row">单价</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple head-row">单位</div></el-col>
                <el-col :span="3"><div class="grid-content bg-purple head-row">生产日期</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple head-row">保质期</div></el-col>
                <el-col :span="2"><div class="grid-content bg-purple head-row">金额</div></el-col>
                <el-col :span="3"><div class="grid-content bg-purple head-row">仓库/门店</div></el-col>
            </el-row>
            <el-row v-for="(item,index) in recipesList">
                <el-col class="grid-content" :span="4">{{item.materialName}}</el-col>
                <el-col class="grid-content" :span="4">{{item.supplierName}}</el-col>
                <el-col class="grid-content" :span="2">
                    <el-input v-model="item.amt" style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-input v-model="item.unitPrice" style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col class="grid-content" :span="2">{{item.stockUnit}}</el-col>
                <el-col class="grid-content" :span="3">{{item.productDate}}</el-col>
                <el-col class="grid-content" :span="2">{{item.keepDays}}</el-col>
                <el-col class="grid-content" :span="2">
                    <el-input readonly :value="calcTotalPrice(item.amt , item.unitPrice)" 
                        style="width:100%" size="mini"></el-input>
                </el-col>
                <el-col class="grid-content" :span="2">{{item.cabinName}}</el-col>
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
                timeout: null,
                storeCode:'',
                recipesList:[],
                currSelectAlts:[],
                loadingState:false,
                currDate:'20171113',
                storage:{
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
                    this.submitToServer();
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
            submitToServer(){
                http.post("/busi/batchInstock",{
                    dataJson:JSON.stringify(this.recipesList)
                }).then((resp)=>{
                    console.log(resp)
                })
            },
            removeRows(index){
            	this.$data.recipesList.splice(index,1)
            },
            querySearchAsync(queryString, cb){
                clearTimeout(this.timeout)
                this.timeout = setTimeout(()=>{
                    queryString = jquery.trim(queryString)
                    let counter = 0;
                    let result = this.allMaterialSupplier.map((item)=>{
                        Vue.set(item,'value',item.materialName+"-"+item.supplierName)
                        return item;
                    }).filter((item)=>{
                        counter ++;
                        return  counter <= 20 && item.value.indexOf(queryString) >=0;
                    })

                    this.$data.currSelectAlts = result;
                    cb(result)
                })
                
            },
            addAltsToList(){
                let date = new Date();
                let today = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
                if(this.recipesList.length>10){
                    this.$message.error("添加记录太多,请先入库")
                    return
                }
                let self = this;
                this.currSelectAlts.forEach((item)=>{
                    if(!this.recipesListMap[item.id]){
                        Vue.set(item,'amt',0)
                        Vue.set(item,'price',0)
                        Vue.set(item,'cabinCode',this.storage.code)
                        Vue.set(item,'cabinName',this.storage.name)
                        Vue.set(item,'cabinType',this.storage.type)
                        Vue.set(item,'productDate',today)
                        Vue.set(item,'keepDays','1天')
                        Vue.set(item,'materialCode',item.materialCode)
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
                    this.storage.code = val.warehouseCode;
                    this.storage.type = "1";
                    this.storage.name = val.warehouseName;
                })
            }else if(new RegExp("^MD").test(this.$route.query.CODE)){
                api.queryStoreByCode(this.$route.query.CODE)
                .then((val)=>{
                    this.storage.code = val.storeCode;
                    this.storage.type = "2";
                    this.storage.name = val.storeName;
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
        width: 100%;
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
    .head-row {
        height: 30px;
    }
</style>