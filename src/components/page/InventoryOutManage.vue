<template>
    <div>
     <el-radio-group v-model="radio" @change="change">
        <el-radio :label="1">按菜单出库</el-radio>
        <el-radio :label="2">按原料出库</el-radio>
      </el-radio-group>
      <component :is="currentView"></component>
    </div>
</template>

<script>
    import byMaterial from './inventoryOutByMaterial'
    import byRecipes from './inventoryOutByRecipes'
    export default {
        data(){
            return {
                radio:1,
                currentView:byRecipes
            }
        },
        methods:{
            change(i){
                if(i == 1){
                    this.$data.currentView = byRecipes;
                }else{
                    this.$data.currentView = byMaterial;
                }
            }
        }
    }
</script>