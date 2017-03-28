function confirm() {
	var uid = $api.getStorage('uid');
	//alert(uid);
	var updateUserInfo = '/user/'+ uid;
	var bodyParam = {
		username : $api.byId('username').value,
		mobile : $api.byId('mobile').value,
		age : $api.byId('age').value,
		email : $api.byId('email').value,
		url : $api.byId('url').value,
		nickname : $api.byId('nickname').value
	}
	ajaxRequest(updateUserInfo, 'put', JSON.stringify(bodyParam), function(ret, err) {
		if (ret) {
			setTimeout(function() {
				api.closeWin();
			}, 100);
		} else {
			alert(JSON.stringify(err));
		}
	});
}

apiready = function() {
	var uid = $api.getStorage('uid');
	var model = api.require('model');
	model.config({
		appKey : '57B8FB26-4AC0-0803-FF7A-93CFDF2FDA3B',
		host : 'https://d.apicloud.com'
	});

	model.findById({
		class : 'user',
		id : uid
	}, function(ret, err) {
		if (ret && ret.id) {
			var userinfo = $api.byId('userinfo');
			var tpl = $api.byId('user-edit-template').text;
			var tempFn = doT.template(tpl);
			userinfo.innerHTML = tempFn(ret);
			$aui.range($api.byId("age"), function(ret) {

			})
		} else {
			alert(JSON.stringify(err));
		}
	});
}