<template>
	<div style="display:inline">
		<el-select v-model="selectedCode" 
           placeholder="请选择"
           @change="setValue"
           @visible-change="visualChange">
               <el-option
                    v-for="item in allValues"
                    :key="item.warehouseCode"
                    :label="item.warehouseName"
                    :value="item.warehouseCode">
               </el-option>
         </el-select>
	</div>
</template>
<script>
	import {api} from './bus'
	export default {
		data(){
			return {
				allValues:[],
				valuesShow:[],
				selectedCode:''
			}
		},
		mounted(){
			let $data = this.$data;
			api.getAllWarehouseList()
			.then((list)=>{
				$data.allValues = list;
			});
		},
		methods: {
			setValue(){
				 this.$emit("setValue",this.selectedCode)
			},
			filterMethod(input){
          let $data = this.$data;
          setTimeout(()=>{
              $data.valuesShow =  $data.allValues.filter((item)=>{
              var key = item.searchKey;
              if(!key || key.indexOf(input)>=0){
                  return true;
              }
              return false;
          })
        },10);
      },
      visualChange(visible){
          if(visible)
            	this.$data.valuesShow = this.$data.allValues;
      }
		}
	}
</script>