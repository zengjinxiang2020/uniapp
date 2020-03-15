// import Vue from 'vue'
// import MpvueRouterPatch from 'mpvue-router-patch'
// Vue.use(MpvueRouterPatch)
import {
	wxappAuth,
	getUser
} from "@/api/user";
import store from "../store";
import dayjs from "dayjs";
import cookie from "@/utils/store/cookie";
import stringify from "@/utils/querystring";

export function dataFormat(time, option) {
	time = +time * 1000;
	const d = new Date(time);
	const now = new Date().getTime();

	const diff = (now - d) / 1000;
	if (diff < 30) {
		return "刚刚";
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + "分钟前";
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + "小时前";
	} else if (diff < 3600 * 24 * 2) {
		return "1天前";
	}
	if (option) {
		// return parseTime(time, option);
	} else {
		let timeStr = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日" + d.getHours() + "时" + d.getMinutes() +
			"分"
		return timeStr
	}
}

export function dataFormatT(time) {
	time = +time * 1000;
	const d = new Date(time);

	return (
		d.getFullYear() +
		"/" +
		(d.getMonth() + parseInt(1)) +
		"/" +
		d.getDate()
	);

}

export function trim(str) {
	return String.prototype.trim.call(str);
}

export function isType(arg, type) {
	return Object.prototype.toString.call(arg) === "[object " + type + "]";
}

export function isWeixin() {
	// return navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1;
	return false
}

export function parseQuery() {
	var pages = getCurrentPages() //获取加载的页面
	var currentPage = pages[pages.length - 1] //获取当前页面的对象
	var url = currentPage.route //当前页面url
	var options = currentPage.options //如果要获取url中所带的参数可以查看options
	return options
}

/*获取当前页url*/
export function getCurrentPageUrl() {
	var pages = getCurrentPages() //获取加载的页面
	var currentPage = pages[pages.length - 1] //获取当前页面的对象
	var url = currentPage.route //当前页面url
	return url
}

/*获取当前页带参数的url*/
export function getCurrentPageUrlWithArgs() {
	var pages = getCurrentPages() //获取加载的页面
	var currentPage = pages[pages.length - 1] //获取当前页面的对象
	var url = currentPage.route //当前页面url
	var options = currentPage.options //如果要获取url中所带的参数可以查看options

	//拼接url的参数
	var urlWithArgs = url + '?'
	for (var key in options) {
		var value = options[key]
		urlWithArgs += key + '=' + value + '&'
	}
	urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)

	return urlWithArgs
}

// 复制到剪切板
export const copyClipboard = (data) => {
	wx.setClipboardData({
		data: data,
		success: (res) => {
			wx.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000
			})
		}
	})
}


export const toAuthorization = (msg) => {
	wx.hideLoading();
	wx.showToast({
		title: msg,
		icon: 'none',
		duration: 2000
	});
	console.log(222222222)
	replace({
		path: '/pages/user/Login/index',
		query: {
			redirect: `/${getCurrentPageUrl()}`,
			...parseQuery()
		}
	})
}

export const login = (option) => {
	console.log('调用登录')
	return new Promise((resolve, reject) => {
		wx.login({
			success: res => {
				console.log('获取code')
				let code = res.code;
				store.commit("UPDATE_WXCODE", res.code);
				if (code) {
					wx.getSetting({
						success: resCode => {
							// * 验证授权
							if (resCode.authSetting["scope.userInfo"]) {
								wx.showLoading({
									title: "加载中"
								});
								wx.getUserInfo({
									success: user => {
										wxappAuth({
											encryptedData: user.encryptedData,
											iv: user.iv,
											code: code,
											spread: cookie.get("spread")
										}).then(({
											data
										}) => {
											resolve(res.data)
											wx.hideLoading();
											store.commit("LOGIN", data.token, dayjs(data.expires_time));
											getUser().then(res => {
												store.dispatch('changeUserInfo', {
													user: res.data
												})
											});
											var pages = getCurrentPages() //获取加载的页面
											var currentPage = pages[pages.length - 1] //获取当前页面的对象
											let url = "/pages/launch/main?type=0"
											let query = {}
											if (currentPage) {
												if (currentPage.route != 'pages/Loading/index' && currentPage.route !=
													'pages/user/Login/index') {
													url = currentPage.route
												}
												if (currentPage.route == 'pages/user/Login/index') {
													const {
														redirect,
														...querys
													} = currentPage.options
													url = redirect
													query = { ...querys
													}
												}
											}
											replace({
												path: url,
												query
											});
										}).catch(error => {
											reject()
											option && option.fail ? option.fail() : toAuthorization('获取用户信息失败，请重试')
										});
									},
									fail: error => {
										reject()
										option && option.fail ? option.fail() : toAuthorization('获取用户信息失败，请重试')
									}
								});
							} else {
								store.commit("UPDATE_AUTHORIZATION", false);
								reject()
								option && option.fail ? option.fail() : toAuthorization('获取用户信息失败，请重试')
							}
						}
					});
				} else {
					reject()
					option && option.fail ? option.fail() : toAuthorization('获取用户信息失败，请重试')
				}
			},
			fail: error => {
				reject()
				option && option.fail ? option.fail() : toAuthorization('获取用户信息失败，请重试')
			}
		});
	})
}






export function parseUrl(location) {
	if (typeof location === 'string') return location

	const {
		path,
		query
	} = location
	const queryStr = stringify(query)

	if (!queryStr) {
		return path
	}

	return `${path}?${queryStr}`
}

export function parseRoute($mp) {
	const _$mp = $mp || {}
	const path = _$mp.page && _$mp.page.route
	return {
		path: `/${path}`,
		params: {},
		query: _$mp.query,
		hash: '',
		fullPath: parseUrl({
			path: `/${path}`,
			query: _$mp.query
		}),
		name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
	}
}

export function push(location, complete, fail, success) {
	let path = ''
	if (typeof location === 'string') {
		path = location
	} else {
		path = location.path
	}
	console.log(path)
	if (path != '/pages/launch/index' || path != '/pages/loading/index' || path != '/pages/home/index' || path !=
		'/pages/loading/index') {
		if (!store.getters.userInfo.uid) {
			replace({
				path: '/pages/user/Login/index',
				query: {
					redirect: `/${getCurrentPageUrl()}`,
					...parseQuery()
				}
			})
			return
		}
	}
	const url = parseUrl(location)
	const params = {
		url,
		complete,
		fail,
		success
	}

	if (location.isTab) {
		uni.switchTab(params)
		return
	}
	if (location.reLaunch) {
		uni.reLaunch(params)
		return
	}
	uni.navigateTo(params)
}

export function replace(location, complete, fail, success) {
	const url = parseUrl(location)
	uni.redirectTo({
		url,
		complete,
		fail,
		success
	})
}

export function go(delta) {
	uni.navigateBack({
		delta
	})
}

export function back() {
	uni.navigateBack({
		delta: 1,
		success: function(e) {},
		fail: function(e) {}
	})
}

export function switchTab(location, complete, fail, success) {
	const url = parseUrl(location)
	uni.switchTab({
		url,
		complete,
		fail,
		success
	})
}


export const _router = {
	mode: 'history',
	switchTab,
	push,
	replace,
	go,
	back
}


export function handleQrCode() {
	try {
		var urlSpread = parseQuery()["q"];
		if (urlSpread) {
			// 通过海报二维码进来
			urlSpread = urlSpread
				.split("%3F")[1]
				.replace(/%3D/g, ":")
				.replace(/%26/g, ",")
				.split(",")
				.map((item, index) => {
					item = item.split(":");
					return `"${item[0]}":"${item[1]}"`;
				})
				.join(",");
			urlSpread = JSON.parse("{" + urlSpread + "}");
			return urlSpread
		}
		return null
	} catch {
		return null
	}

}

const getImageInfo = (images) => {
	console.log(images)
	return new Promise((resolve, reject) => {
		let imageAry = {}
		images.map((item, index) => {
			wx.getImageInfo({
				src: item,
				fail: function(res) {
					imageAry[index] = null
					console.log(res)
					if (imageAry.length == images.length) {
						resolve(imageAry)
					}
				},
				success: function(res) {
					imageAry[index] = res
					console.log(res)
					if (Object.keys(imageAry).length == images.length) {
						resolve(imageAry)
					}
				}
			})
		})
	})
}


/**
 * 获取分享海报
 * @param array store 海报素材
 * @param string store_name 素材文字
 * @param string price 价格
 * @param function successFn 回调函数
 * 
 * 
 */
export const PosterCanvas = (store, successCallBack) => {
	wx.showLoading({
		title: '海报生成中',
		mask: true
	});
	getImageInfo([store.image, store.code]).then(res => {
		let contentHh = 48 * 1.3
		const ctx = wx.createCanvasContext('myCanvas');
		ctx.clearRect(0, 0, 0, 0);
		const WIDTH = 747
		const HEIGHT = 1326;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.drawImage(res[1].path, 40, 1064, 200, 200);
		ctx.drawImage(res[0].path, 0, 0, WIDTH, WIDTH);
		ctx.save();
		let r = 90;
		let d = r * 2;
		let cx = 40;
		let cy = 990;
		ctx.arc(cx + r, cy + r, r, 0, 2 * Math.PI);
		ctx.clip();
		ctx.restore();
		ctx.setTextAlign('center');
		ctx.setFontSize(48);
		ctx.setFillStyle('#000');
		ctx.fillText(store.title, WIDTH / 2, 810 + contentHh);
		ctx.setTextAlign('center')
		ctx.setFontSize(32);
		ctx.setFillStyle('red');
		ctx.fillText('￥' + store.price, WIDTH / 2, 985);
		ctx.setTextAlign('center')
		ctx.setFontSize(22);
		ctx.setFillStyle('#333333');
		ctx.fillText('长按识别二维码立即购买', WIDTH / 2, 1167);
		// ctx.drawImage(store.code, 199, 1064, 200, 200);
		ctx.save();
		ctx.draw(true, function(oi) {
			wx.canvasToTempFilePath({
				canvasId: 'myCanvas',
				fileType: 'png',
				destWidth: WIDTH,
				destHeight: HEIGHT,
				success: function(res) {
					wx.hideLoading();
					successCallBack && successCallBack(res.tempFilePath);
				},
				fail: function(error) {
					console.log(error)
				},

			})
		});
	})

	// wx.getImageInfo({
	//   src: store.image,
	//   fail: function (res) {
	//     wx.showToast({
	//       title: '海报生成失败',
	//       icon: "none",
	//       duration: 2000
	//     });
	//   },
	//   success: function (res) {

	//   }
	// })
}
