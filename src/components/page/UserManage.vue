<template>
    <div class="table">
        <el-table :data="data" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            
            <el-table-column prop="userCode" label="用户编码" width="120">
            </el-table-column>
            <el-table-column prop="userName" label="用户名称">
            </el-table-column>
            <el-table-column prop="userRole" label="角色">
            </el-table-column>
            <el-table-column prop="status" label="用户状态">
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template scope="scope">
                	<el-button size="small" type="primary" @click="update(scope.$index, scope.row)">修改</el-button>
                    <el-button size="small" type="primary" @click="resetpassword(scope.$index, scope.row)">重置密码</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination
                    @current-change ="handleCurrentChange"
                    layout="prev, pager, next"
                    :total="totalRows" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
	import config from '../common/config.vue'
	import OutStock from './OutStock.vue'
    import jquery from 'jquery'
    export default {
        data() {
            return {
                url: './static/vuetable.json',
                tableData: [],
                cur_page: 1,
                pageSize:5,
                totalRows:0,
                multipleSelection: [],
                select_cate: '',
                select_word: '',
                loadingState: false,
                del_list: [],
                is_search: false,
                query:{
                	materialCode:'',
                    stockType:'',
                    storeCode:''
                },
                storeSelection:[],
                showOutStock:false
            }
        },
        created(){
            console.log('created......')
        },
        mounted(){
			this.getData();
            var $this = this;
            jquery.ajax({
                url:config.server+"/store/getAllStore",
                dataType:'jsonp'
            }).then((resp)=>{
                console.log(resp)
                $this.storeSelection = resp.value.values;
            })
        },
        activated(){
            console.log("activated......");
        },
        computed: {
            data(){
                const self = this;
                return self.tableData.filter(function(d){
                	return d;
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
                config.queryUsers(null,(resp)=>{
                    console.log(resp)
                    self.tableData = resp.value.values;
                })
            },
            search(){
                this.tableData = [];
                this.getData();
            },
            formatStockType(row, column) {
                return row.stockType==1?"总库":"分库";
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            update(index, item) {
                this.$message.error('修改功能尚未实现');
                
            },
            resetpassword(index, item) {
                this.$message.error('重置密码功能尚未实现');
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