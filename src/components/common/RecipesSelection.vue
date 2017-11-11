<template>
	<div>
		    <el-select v-model="selectedCode"
           placeholder="请选择" 
           filterable
           :filter-method="filterMethod"
           @keyup.enter.native="enterkey"
           @change="setValue"
           @visible-change="visualChange">
               <el-option
                    v-for="item in valuesShow"
                    :key="item.recipesCode"
                    :label="item.recipesName"
                    :value="item.recipesCode">
               </el-option>
         </el-select>
	</div>
</template>
<script>
	import {api} from './bus'
	export default {
    props:["excludes","value","context"],
		data(){
			return {
				allValues:[],
				valuesShow:[],
				selectedCode:''
			}
		},
		mounted(){
       this.initData();
		},
    watch: {
      value(nval, oval){
        this.initData();
      }
    },
		methods: {
			setValue(){
				this.$emit("input",this.$props.context,this.selectedCode)
			},
      initData(){
        let $data = this.$data;
        api.queryAllRecipes()
        .then((value)=>{
          $data.allValues = value;
          $data.selectedCode = this.$props.value;
        });
      },
      enterkey(e){

      },
	  filterMethod(input){
          let $data = this.$data;
          setTimeout(()=>{
              $data.valuesShow =  $data.allValues.filter((item)=>{
                  var key = [item.recipesCode,item.recipesName,item.searchKey].join(',')
                  if(key.indexOf(input)>=0){
                      return true;
                  }
                  return false;
              })
          },10);
      },
      visualChange(visible){
         if(visible){
            this.$data.valuesShow = this.$data.allValues.filter((item)=>{
                  if(this.excludesMap[item.recipesCode]){
                      return false;
                  }
                  return true;
              })
          }
      }
		},
    computed:{
      excludesMap(){
         let map = {};
         this.$props.excludes && this.$props.excludes.forEach((item)=>{
            map[item] = 1;
         })
         return map;
      }
    }
	}
</script>