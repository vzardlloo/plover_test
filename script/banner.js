function getBanner(type, order, limit, bannerinfoId, templateName, containerId, height, speed, autoPlay, loop, pageShow, pageStyle, dotPosition) {
	window.banner = factory("banner");
	var _limit = ( typeof arguments[2] == "undefined" || arguments[2] == null) ? 5 : arguments[2];
	var _bannerinfoId = ( typeof arguments[3] == "undefined" || arguments[3] == null) ? 'bannerinfo' : arguments[3];
	var _templateName = ( typeof arguments[4] == "undefined" || arguments[4] == null) ? 'bannerinfo-template' : arguments[4];
	var _containerId = ( typeof arguments[5] == "undefined" || arguments[5] == null) ? 'aui-slide' : arguments[5];
	var _height = ( typeof arguments[6] == "undefined" || arguments[2] == null) ? 150 : arguments[6];
	var _speed = ( typeof arguments[7] == "undefined" || arguments[3] == null) ? 500 : arguments[7];
	var _autoPlay = ( typeof arguments[8] == "undefined" || arguments[4] == null) ? 3000 : arguments[8];
	var _loop = ( typeof arguments[9] == "undefined" || arguments[5] == null) ? true : arguments[9];
	var _pageShow = ( typeof arguments[10] == "undefined" || arguments[6] == null) ? true : arguments[10];
	var _pageStyle = ( typeof arguments[11] == "undefined" || arguments[5] == null) ? 'dot' : arguments[11];
	var _dotPosition = ( typeof arguments[12] == "undefined" || arguments[6] == null) ? 'right' : arguments[12];
	banner.query({
		filter : {
			where : {
				"type" : type
			},
			"order" : order,
			"limit" : _limit
		}
	}, function(ret, err) {
		if (ret) {
			var bannerinfo = $api.byId(_bannerinfoId);
			var tpl = $api.byId(_templateName).text;
			var tempFn = doT.template(tpl);
			bannerinfo.innerHTML = tempFn(ret);
			var slide = new auiSlide({
				container : document.getElementById(_containerId),
				"height" : _height,
				"speed" : _speed,
				"autoPlay" : _autoPlay, //自动播放
				"loop" : _loop,
				"pageShow" : _pageShow,
				"pageStyle" : _pageStyle,
				'dotPosition' : _dotPosition
			})
		}
	});
}