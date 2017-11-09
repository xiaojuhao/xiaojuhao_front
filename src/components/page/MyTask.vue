<template>
    <div>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
        <MaterialSelection :excludes="excludes" v-on:setValue="setValue"></MaterialSelection>
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
        	setValue(code){
        		this.$data.excludes.push(code)
        	}
        }
    }
</script>
