// 生成guid,主要用于生成随机文件名
function NewGuid() {
	function S4() {
		return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	}

	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

// 获取当前的时间，拼接成2015-11-09这样的格式，主要用于对图片进行时间分类
function getNowFormatDate() {
	var date = new Date();
	var seperator1 = "-";
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var strDate = date.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	var currentdate = year + seperator1 + month + seperator1 + strDate
	return currentdate;
}

// 获取文件拓展名
function getExt(fileName) {
	return fileName.substring(fileName.lastIndexOf('.') + 1);
}

// 图片压缩
// imgsrc：源图片的路径
// quality：图片压缩质量，一般建议0.5
// scale：图片压缩比例，也是建议0.5
// ext：源图片拓展名
// callback：转换成功之后回调函数
function imgCompress(imgsrc, quality, scale, ext, callback) {
	// 压缩文件的保存目录
	var savePath = api.cacheDir + "/" + getNowFormatDate() + "/";
	// 压缩文件生成的随机文件名称
	var savename = NewGuid() + "." + ext;
	imageFilter.compress({
		img : imgsrc,
		quality : quality,
		scale : quality,
		save : {
			album : false,
			imgPath : savePath,
			imgName : savename
		}
	}, function(ret, err) {
		if (ret) {
			callback(savePath + savename);
		} else {
			alert(JSON.stringify(err));
		}
	});
}

function uploadHeadImg() {
	api.actionSheet({
		title : '选择图片来源',
		buttons : ['优雅自拍', '浏览相册']
	}, function(ret, err) {
		var index = ret.buttonIndex;
		switch(index) {
			// 拍照
			case 1:
				// 打开拍照
				api.getPicture({
					sourceType : "camera",
					encodingType : "jpg",
					destinationType : "url",
					mediaValue : "pic",
					quality : 50,
					saveToPhotoAlbum : true
				}, function(ret, err) {
					if (ret && ret.data) {
						// 拍照返回的本地路径
						var returnUrl = ret.data;
						// 图片压缩
						imgCompress(returnUrl, 0.5, 0.5, getExt(returnUrl), function(compressImg) {
							uploadImage(compressImg);
						});
					} else {
						api.toast({
							msg : '没有选择，或者选择出错'
						});
					}
				});
				break;
			// 打开图片选择器
			case 2:
				uiMediaScanner.open({
					type : 'picture',
					column : 4,
					classify : true,
					max : 1,
					sort : {
						key : 'time',
						order : 'desc'
					},
					texts : {
						stateText : '已选*项',
						cancelText : '取消',
						finishText : '完成'
					},
					styles : {
						bg : '#fff',
						mark : {
							icon : '',
							position : 'bottom_left',
							size : 20
						},
						nav : {
							bg : '#b23e4b',
							stateColor : '#fff',
							stateSize : 18,
							cancelBg : 'rgba(0,0,0,0)',
							cancelColor : '#fff',
							cancelSize : 18,
							finishBg : 'rgba(0,0,0,0)',
							finishColor : '#fff',
							finishSize : 18
						}
					}
				}, function(ret) {
					if (ret) {
						for (var i = 0; i < ret.list.length; i++) {
							var selectImg = ret.list[i];
							// 获取图片的路径
							var selectimgPath = selectImg.path;
							var selectimgThumbPath = selectImg.thumbPath;
							// IOS需要将虚拟路径转换为本地路径才可以压缩
							if (isIOS) {
								// 转换为真实路径
								uiMediaScanner.transPath({
									path : selectimgPath
								}, function(transObj) {
									// 图片压缩
									imgCompress(transObj.path, 0.5, 0.5, selectImg.suffix, function(compressImg) {
										uploadImage(compressImg);
									});
								});
							} else {
								// 图片压缩
								imgCompress(selectimgPath, 0.5, 0.5, selectImg.suffix, function(compressImg) {
									uploadImage(compressImg);
								});
							}
						}
					}
				});
				break;
		}
	});
}

function uploadImage(data) {
	api.showProgress({
		title : '图片上传中...',
		modal : true
	});
	var uid = $api.getStorage('uid');
	var relation = api.require('relation');
	relation.deleteAll({
		class : 'user',
		id : uid,
		column : 'headImage'
	}, function(ret, err) {
	});
	var fileData = factory("file");
	fileData.save({
		file : {
			isFileClass : true,
			isFile : true,
			path : data,
			values : {
				userfor : "headImage",
				"user(uz*R*id)" : uid
			}
		}
	}, function(ret, err) {
		alert(JSON.stringify(ret));
		if (ret && ret.url) {
			var pc = api.require('personalCenter');
			pc.updateValue({
				imgPath : ret.url
			});
			api.toast({
				msg : '上传成功！',
				location : 'middle'
			});
		} else {
			api.toast({
				msg : '上传失败请稍后再试！',
				location : 'middle'
			});
		}
		api.hideProgress();
	})
}