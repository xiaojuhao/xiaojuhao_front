<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-date"></i> 系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色编辑</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" label-width="100px" v-loading="loadingState">
                <el-form-item label="角色名称">
                    <el-input v-model="form.roleName" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色编码">
                    <el-input :disabled="codeDisabled" v-model="form.roleCode" placeholder="角色编码"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-select v-model="form.status" style="width:160px" placeholder="请选择">
                        <el-option label="有效" value="1"></el-option>
                        <el-option label="无效" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单授权">
                    <el-tree :data="menuTree" show-checkbox node-key="id" :default-checked-keys="checkedKeys" ref="tree">
                    </el-tree>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button @click="onCancel">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
import { api } from '../common/bus'
export default {
    data: function() {
        return {
            form: {
                id: this.$route.query.ID,
                roleName: '',
                roleCode: '',
                status: '',
                menuCodesStr: ''
            },
            loadingState: false,
            menuTree: [],
            checkedKeys: []
        }
    },
    methods: {
        onSubmit() {
            this.form.menuCodesStr = this.$refs.tree.getCheckedKeys().join(',');
            this.loadingState = true;
            api.saveRole(this.form)
                .then((role) => {
                    this.$message("保存成功")
                    this.form.id = role.id;
                    this.form.roleName = role.roleName;
                    this.form.roleCode = role.roleCode;
                }).always(() => {
                    setTimeout(() => this.loadingState = false, 500);
                });
        },
        onCancel() {
            this.$router.go(-1)
        }
    },
    mounted() {
        api.queryRoleById(this.$route.query.ID)
            .then((role) => {
                this.form.roleName = role.roleName;
                this.form.status = role.status;
                this.form.roleCode = role.roleCode;
            })
        api.menuTree()
            .then((menus) => {
                this.menuTree = menus;
            })
        api.queryRoleMenuByRoleId(this.$route.query.ID)
            .then((list) => {
                list.forEach((item) => this.checkedKeys.push(item.menuCode))
            })
    },
    computed:{
        codeDisabled(){
            if(this.form.roleCode) return true;
            return false;
        }
    }
}
</script>
<style scoped>
.span-center {
    display: inline-block;
    width: 100%;
    font-weight: bold;
}

.grid-content {
    min-height: 1px;
}

.el-row {
    margin-bottom: 4px;
    &:last-child {
        margin-bottom: 0;
    }
}

.el-col {
    border-radius: 4px;
}
</style>