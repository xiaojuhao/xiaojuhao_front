import jquery from 'jquery'

const config = {
	//server:'http://47.104.25.105:80/xiaojuhao/'
	//server:'http://localhost:8080/'
	server: process.env.REMOTE_SERVER
}
const http = {
	jsonp(uri,data){
		var df = jquery.Deferred();
		jquery.ajax({
			url: config.server + uri,
			data:data,
			dataType:'jsonp'
		})
		.then((resp)=>df.resolve(resp))
		.fail((resp)=>df.reject(resp))
		return df;
	},
	jsonp2(uri,data){
		var df = jquery.Deferred();
		jquery.ajax({
			url: config.server + uri,
			data:data,
			dataType:'jsonp'
		})
		.then((resp)=>{
			if(resp.code == "200"){
				df.resolve(resp.value)
			}else{
				df.reject(resp);
			}
		})
		.fail((resp)=>df.reject(resp))
		;

		return df;
	}
}

export {config};

export const api = {
	signin(data){
		var df = jquery.Deferred();
		try{
			jquery.ajax({
				url:config.server +'/user/login',
				data:data,
				dataType:'jsonp'
			}).then((resp)=>{
				df.resolve(resp)
			});
		}catch(e){
			df.reject({
				code:400,
				message:'网络异常'
			});
		}
		
		return df;
	},
	getAllStoreList(){
		var df = jquery.Deferred();
		http.jsonp('/store/getAllStore')
		.then((resp)=>{
			if(resp.code=="200"){
				var values = resp.value && resp.value.values;
				df.resolve(values);
			}else{
				df.reject(resp)
			}
		}).fail((resp)=>df.reject(resp))
		return df;
	},
	outstock(data){
		var df = jquery.Deferred();
		http.jsonp('/busi/outstock',data)
		.then((resp)=>{
			if(resp.code == "200"){
				df.resolve(resp.value);
			}else{
				df.reject(resp)
			}
		}).fail((resp)=>{
			df.reject(resp)
		})
		return df;
	},
	instock(data){
		var df = jquery.Deferred();
		http.jsonp('/busi/instock',data)
		.then((resp)=>{
			if(resp.code == "200"){
				df.resolve(resp.value);
			}else{
				df.reject(resp)
			}
		}).fail((resp)=>{
			df.reject(resp)
		})
		return df;
	},
	addRecipes(data){
		var df = jquery.Deferred();
		jquery.ajax({
			url:config.server+"/recipes/addRecipes",
			data:data,
			dataType:'jsonp'
		}).then((resp)=>{
			if(resp.code == "200"){
				df.resolve(resp.value);
			}else{
				df.reject(resp);
			}
		}).fail((resp)=>{
			df.reject(resp);
		});
		return df;
	},
	queryRecipesPage(data){
		return http.jsonp2("/recipes/queryRecipes",data)
	},
	queryAllRecipes(){
		return http.jsonp2("/recipes/queryAllRecipes",{})
	},
	queryRecipesByCode(code){
		return http.jsonp2("/recipes/queryRecipesByCode",{recipesCode:code})
	},
	queryMaterialsStockHistory(data){
		return http.jsonp2("/busi/queryMaterialsStockHistory",data);
	},
	queryMaterialsStockById(id){
		return http.jsonp2("/busi/queryMaterialsStockById",{id:id});
	},
	queryAllMaterials(){
		let data = {
			pageNo:1,
			pageSize:1000
		}
		return http.jsonp2("/busi/queryMaterials",data);
	},
	queryRecipesFormula(recipesCode){
		let data = {recipesCode: recipesCode}
		return http.jsonp2("/recipes/queryRecipesFormula",data)
	},
	getAllWarehouse(){
		return http.jsonp2("/warehouse/queryWarehouses",{})
	}
}
