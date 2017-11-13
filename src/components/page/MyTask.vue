<template>
    <div>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue" initValue="M00003"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue" initValue="M00003"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <el-button @click="click">点击</el-button>
    </div>
</template>

<script>
    import StoreSelection from '../common/StoreSelection'
    import MaterialSelection from '../common/MaterialSelection'
    import RecipesSelection from '../common/RecipesSelection'
    import WarehouseSelection from '../common/WarehouseSelection'
    export default {
        data(){
            return {
                msg:'ASSDDSDS vcvcvc',
                excludes:["aaaa","bbbb","ccccc"]
            }
        },
        components: {
        	StoreSelection,
            MaterialSelection,
            RecipesSelection,
            WarehouseSelection
        },
        methods:{
            click(){
                console.log(this.$store.state.allMaterials)
                console.log(this.$store.state.allRecipes)
                console.log(this.$store.state.allWarehouses)
                console.log(this.$store.state.allStores)
            },
        	setValue(code){
        		this.$data.excludes.push(code)
        	}
        },
        mounted(){
            this.$store.dispatch('loadAllData');
        }
    }
</script>
