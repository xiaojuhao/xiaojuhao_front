<template>
    <div class="table">
        <div class="handle-box">
            <div style="position:relative; float:right; margin-bottom: 5px;">
                <el-button round @click="addNewUser()">新增用户</el-button>
            </div>
        </div>
        <el-table :data="tableData" border style="width: 100%"
            v-loading="loadingState"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgb(0, 0, 0, 0.8)">
            
            <el-table-column prop="userCode" label="用户编码" width="120">
            </el-table-column>
            <el-table-column prop="userName" label="用户名称">
            </el-table-column>
            <el-table-column prop="userRole" label="角色" :formatter="formatRole">
            </el-table-column>
            <el-table-column prop="status" label="用户状态" :formatter="formatStatus">
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
    import jquery from 'jquery'
    import {api} from '../common/bus'
    export default {
        data() {
            return {
                tableData: [],
                cur_page: 1,
                pageSize:5,
                totalRows:0,
                loadingState: false,
            }
        },
        mounted(){
            this.$data.loadingState = true;
            try{
                this.getData();
            }catch(e){}
            this.$data.loadingState = false;
        },
        computed: {
            
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
                this.getData();
            },
            formatRole(row){
                switch(row.userRole){
                    case "1": return "管理员";
                    case "2": return "店长";
                    case "3": return "店员";
                    case "4": return "仓管"
                }
            },
            formatStatus(row){
                switch(row.status){
                    case "1": return "有效";
                    case "2": return "无效";
                }
            },
            getData(){
                let self = this;
                config.queryUsers(null,(resp)=>{
                    console.log(resp)
                    self.tableData = resp.value.values;
                })
            },
            update(index, item) {
                this.$router.push({path:"/userManagePage",query:{userCode:item.userCode}})
            },
            addNewUser(index, item) {
                this.$router.push({path:"/userManagePage"})
            },
            resetpassword(index, item) {
                api.resetPassword(item.userCode)
                .then((resp)=>{
                    this.$message("操作成功")
                }).fail((resp)=>{
                    this.$message.error(resp.message)
                })
            }
        }
    }
</script>

<style scoped>
.handle-box{
    margin-bottom: 0px;
}
.handle-select{
    width: 120px;
}
.handle-input{
    width: 300px;
    display: inline-block;
}
</style>