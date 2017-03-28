var uiMediaScanner = null, imageFilter = null, imageBrowser = null, model = null;
var isIOS = false;
//init personal center
function initPersonalCenter(json) {
	/*api.showProgress({
		title : '加载中...',
		modal : false
	});*/
	json = json || {};
	if (!json.nickname) {
		return;
	}

	var uid = $api.getStorage('uid');
	var User = factory("user");
	User.query({
		"filter" : {
			"where" : {
				"id" : uid
			},
			"skip" : 0,
			"limit" : 1
		}
	}, function(ret, err) {
		if (ret ) {
			var user = ret[0];
			var pc = api.require('personalCenter');
			var photo = json.photo;
			if (user.photo) {
				photo = user.photo;
			}
			//var point = user.point || json.point;
			//var nickname = user.nickname || json.nickname;
			pc.open({
				y : 0,
				height : 220,
				fixedOn : 'user',
				fixed : true,
				imgPath : photo,
				username : nickname,
				//subTitle : '积分:' + point,
				showRightBtn : false,
				modButton : {
					bgImg : 'widget://image/edit.png',
					lightImg : 'widget://image/edit.png'
				},
				btnArray : [{
					bgImg : 'widget://image/personal_btn_nor.png',
					lightImg : 'widget://image/personal_btn_light.png',
					selectedImg : 'widget://image/personal_btn_sele.png',
					//title : '待付款',
					titleColor : '#ffffff',
					titleLightColor : '#55abce',
					countColor : '#ffffff',
					countLightColor : '#55abce'
				}, {
					bgImg : 'widget://image/personal_btn_nor.png',
					lightImg : 'widget://image/personal_btn_light.png',
					selectedImg : 'widget://image/personal_btn_sele.png',
					title : '待发货',
					titleColor : '#ffffff',
					titleLightColor : '#55abce',
					countColor : '#ffffff',
					countLightColor : '#55abce'
				}, {
					bgImg : 'widget://image/personal_btn_nor.png',
					lightImg : 'widget://image/personal_btn_light.png',
					selectedImg : 'widget://image/personal_btn_sele.png',
					//title : '待收货',
					titleColor : '#ffffff',
					titleLightColor : '#55abce',
					countColor : '#ffffff',
					countLightColor : '#55abce'
				}, {
					bgImg : 'widget://image/personal_btn_nor.png',
					lightImg : 'widget://image/personal_btn_light.png',
					selectedImg : 'widget://image/personal_btn_sele.png',
					title : '待评价',
					titleColor : '#ffffff',
					titleLightColor : '#55abce',
					countColor : '#ffffff',
					countLightColor : '#55abce'
				}]
			}, function(ret, err) {
				//$api.byId('activity').innerHTML = '';
				if (ret.click === 0) {
					showOrder(1, false);
				}
				if (ret.click === 1) {
					showOrder(2, false);
				}
				if (ret.click === 2) {
					showOrder(3, false);
				}
				if (ret.click === 3) {
					showOrder(4, false);
				}
				if (ret.click === 4) {
					uploadHeadImg();
				}
				if (ret.click === 5) {
					showUserInfo();
				}
			});
		} else {
			api.toast({
				msg : err.msg,
				location : 'middle'
			})
		}
		api.hideProgress();
	})
}

function init() {
	var photoUrl = 'widget://image/t1.jpg';
	initPersonalCenter({
		nickname : '啄木鸟',
		photo : photoUrl,
		point : 0
	});
}

function showOrder(type, allOrder) {
	var param = {
		type : type,
		allOrder : allOrder
	};
	//taobao.showMyOrdersPage(param);
}

function showCart() {
	//taobao.showMyCartsPage();
}

function showMyCardCouponsPage() {
	//taobao.showMyCardCouponsPage();
}

function showUserInfo() {
	api.openWin({
		name : 'userEdit',
		url : 'user_edit.html',
		vScrollBarEnabled : true,
		hScrollBarEnabled : true
	});
}

function showDidi() {
	//didi = api.require('didi');
	//didi.showDDPage();
}

apiready = function() {
	init();
	// 引入多选模块
	uiMediaScanner = api.require('UIMediaScanner');
	// 引入过滤压缩模块
	imageFilter = api.require("imageFilter");
	// 引入图片浏览模块
	imageBrowser = api.require('imageBrowser');
	// 引入百度模块
	// 判断是否是IOS系统
	isIOS = api.systemType == "ios" ? true : false;
	//taobao = api.require('taobao');
}
