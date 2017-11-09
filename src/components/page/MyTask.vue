<template>
    <div>
        <StoreSelection v-on:setValue="setValue"></StoreSelection>
        <MaterialsSelection></MaterialsSelection>
        <RecipesSelection></RecipesSelection>
        <WarehouseSelection></WarehouseSelection>
    </div>
</template>

<script>
    import StoreSelection from '../common/StoreSelection'
    import MaterialsSelection from '../common/MaterialsSelection'
    import RecipesSelection from '../common/RecipesSelection'
    import WarehouseSelection from '../common/WarehouseSelection'
    export default {
        data(){
            return {
                msg:'ASSDDSDS vcvcvc'
            }
        },
        components: {
        	StoreSelection,
            MaterialsSelection,
            RecipesSelection,
            WarehouseSelection
        },
        methods:{
        	setValue(code){
        		console.log(code)
        	}
        }
    }
</script>
