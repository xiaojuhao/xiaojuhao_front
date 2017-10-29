<template>
    <div class="table">
        <div class="handle-box">
            <el-autocomplete class="inline-input" v-model="query.name"
      			:fetch-suggestions="querySearch" placeholder="原料名称"
      			:trigger-on-focus="false"
      			@select="handleSelect">
      		</el-autocomplete>
            <el-input v-model="query.code" placeholder="原料编码" class="handle-input mr5" style="width:150px"></el-input>
            <el-select v-model="select_cate" placeholder="库存类型" class="handle-select mr10">
                <el-option key="1" label="总库" value="1"></el-option>
                <el-option key="2" label="分库" value="2"></el-option>
            </el-select>
            <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable" @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="ID" sortable width="100">
            </el-table-column>
            <el-table-column prop="materialName" label="原料名称" width="120">
            </el-table-column>
            <el-table-column prop="materialCode" label="原料编码" width="100">
            </el-table-column>
            <el-table-column prop="currStock" label="当前库存" width="100">
            </el-table-column>
            <el-table-column prop="usedStock" label="已用数量" width="100">
            </el-table-column>
            <el-table-column prop="stockUnit" label="库存单位" width="100">
            </el-table-column>
            <el-table-column prop="stockType" label="库存类型" width="100" :formatter="formatStockType">
            </el-table-column>
            <el-table-column prop="modifier" label="修改人" width="100">
            </el-table-column>
            <el-table-column label="操作"fixed="right" width="150">
                <template scope="scope">
                	<el-button size="small" type="primary" @click="outstock(scope.$index, scope.row)">盘点库存</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="512">
            </el-pagination>
        </div>
    </div>
</template>

<script>
	import config from '../common/config.vue'
	import OutStock from './OutStock.vue'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                del_list: [],
                is_search: false,
                query:{
                	code:'0001',
                	name:'鱼头'
                },
                showOutStock:false
            }
        },
        created(){
            
        },
        mounted(){
			this.getData();
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                	//console.log(d)
                	return d;
                    // let is_del = false;
                    // for (let i = 0; i < self.del_list.length; i++) {
                    //     if(d.name === self.del_list[i].name){
                    //         is_del = true;
                    //         break;
                    //     }
                    // }
                    // if(!is_del){
                    //     if(d.address.indexOf(self.select_cate) > -1 && 
                    //         (d.name.indexOf(self.select_word) > -1 ||
                    //         d.address.indexOf(self.select_word) > -1)
                    //     ){
                    //         return d;
                    //     }
                    // }
                })
            }
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            getData(){
                let self = this;
                var jsonp = require('jsonp')
                jsonp(config.server+'/queryMaterialsStock',null,function(err,resp){
                	//console.log('load data success!!!!!!!!!!')
                	//console.log(data.value)
                	self.tableData = resp.value;
                });
            },
            search(){
                this.is_search = true;
            },
            formatStockType(row, column) {
                return row.stockType==1?"总库":"分库";
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            outstock(index, item) {
                // this.$message('编辑第'+(index+1)+'行');
                //console.log(row)
                this.$router.push({path:"/outStock",query:{stockId:item.id}})
               // this.$data.showOutStock=true;
            },
            instock(index, item) {
                this.$router.push({path:"/inStock",query:{stockId:item.id}})
            },
            handleEdit(index, row) {
                this.$message('编辑第'+(index+1)+'行');
            },
            handleDelete(index, row) {
                this.$message.error('删除第'+(index+1)+'行');
            },
            delAll(){
                const self = this,
                    length = self.multipleSelection.length;
                let str = '';
                self.del_list = self.del_list.concat(self.multipleSelection);
                for (let i = 0; i < length; i++) {
                    str += self.multipleSelection[i].name + ' ';
                }
                self.$message.error('删除了'+str);
                self.multipleSelection = [];
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleSelect(item){
            	this.$data.query.name=item.value;
            },
            querySearch(queryString,cb){
            	var data = [];
            	data.push({id:1,value:'aaaaa'})
            	data.push({id:2,value:'bbbbb'})
            	data.push({id:3,value:'ccccc'})
            	console.log(this.$data.query)
            	cb(data)
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 20px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>