<template>
	<div>
		<el-select v-model="selectedCode" 
           placeholder="请选择" 
           :filterable="true"
           :filter-method="filterMethod"
           @change="setValue"
           @visible-change="visualChange">
               <el-option
                    v-for="item in valuesShow"
                    :key="item.materialCode"
                    :label="item.materialName"
                    :value="item.materialCode">
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
			api.queryAllMaterials()
			.then((value)=>{
				$data.allValues = value.values;
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