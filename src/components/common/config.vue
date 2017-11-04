<script>
	import jquery from 'jquery'
	export default {
		server:'http://localhost:8080/',
		getAllStore:function(cb){
			jquery.ajax({
				url:this.server+"/store/getAllStore",
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			})
		},
		queryMaterialsStockById:function(stockId,cb){
			jquery.ajax({
				url:this.server+"/busi/queryMaterialsStockById",
				data:{'id':stockId},
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			})
		},
		getWarehouse:function(param,cb){
			jquery.ajax({
				url:this.server+"/warehouse/queryWarehouses",
				data:param,
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			})
		},
		getWarehouseByCode:function(code,cb){
			jquery.ajax({
				url:this.server+"/warehouse/queryWarehouses",
				data:{warehouseCode:code},
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			})
		},
		login:function(data,cb,fcb){
			jquery.ajax({
				url:this.server+"/user/login",
				data:data,
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			}).fail((resp)=>{
				fcb && fcb(resp)
			})
		},
		queryUsers:function(userDO,cb,fcb){
			jquery.ajax({
				url:this.server+"/user/queryUsers",
				data:userDO,
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			}).fail((resp)=>{
				fcb && fcb(resp)
			})
		},
		search:function(param,cb){
			jquery.ajax({
				url:this.server+"/s/w",
				data:param,
				dataType:'jsonp'
			}).then((resp)=>{
				cb && cb(resp)
			})
		}
	}
</script>