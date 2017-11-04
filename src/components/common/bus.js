import jquery from 'jquery'

const config = {
	server:'http://localhost:8080/'
}
export const login = {
	signin(data){
		var deferred = jquery.Deferred();
		jquery.ajax({
			url:config.server +'/user/login',
			data:data,
			dataType:'jsonp'
		}).then((resp)=>{
			deferred.resolve(resp)
		});
		return deferred;
	}
}
