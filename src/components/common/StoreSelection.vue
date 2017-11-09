<template>
	<div>
		<el-select v-model="selectedStoreCode" 
           placeholder="请选择"
           @change="setValue"
           @visible-change="visualChange">
               <el-option
                    v-for="item in allStores"
                    :key="item.storeCode"
                    :label="item.storeName"
                    :value="item.storeCode">
               </el-option>
         </el-select>
	</div>
</template>
<script>
	import {api} from './bus'
	export default {
		data(){
			return {
				allStores:[],
				storesShow:[],
				selectedStoreCode:''
			}
		},
		mounted(){
			let $data = this.$data;
			api.getAllStoreList()
			.then((value)=>{
				$data.allStores = value;
			});
			$data.storesShow = $data.allStores;
		},
		methods: {
			setValue(){
				this.$emit("setValue",this.selectedStoreCode)
			},
			filterStore(input){
                let $data = this.$data;
                setTimeout(()=>{
                    $data.storesShow =  $data.allStores.filter((item)=>{
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
            	this.$data.storesShow = this.$data.allStores;
            }
		}
	}
</script>