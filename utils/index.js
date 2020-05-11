import Vue from 'vue'
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

export function dateFormatT(time) {
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
	uni.setClipboardData({
		data: data,
		success: (res) => {
			uni.showToast({
				title: '复制成功',
				icon: 'success',
				duration: 2000
			})
		}
	})
}


export const replaceLogin = (msg) => {
	uni.hideLoading();
	if (msg) {
		uni.showToast({
			title: '重新登录中...',
			icon: 'none',
			duration: 2000
		});
	}
	// 这里代表已经失去登录状态以及401强制推出登录了
	store.commit('LOGOUT')
	console.log('如果是微信小程序，跳转到授权页', Vue.prototype.$deviceType, msg)
	if (Vue.prototype.$deviceType == 'routine') {
		// 如果是微信小程序，跳转到授权页
		login({
			fail: () => {
				console.log('如果是微信小程序，跳转到授权页')
				replace({
					path: '/pages/authorization/index',
					query: {
						redirect: `/${getCurrentPageUrl()}`,
						...parseQuery()
					}
				})
			}
		})

	} else {
		// 如果不是小程序跳转到登录页
		push({
			path: '/pages/user/Login/index',
			query: {
				redirect: `/${getCurrentPageUrl()}`,
				...parseQuery()
			}
		})
	}
}

export const getProvider = (service) => {
	return new Promise((resolve, reject) => {
		// 获取当前环境的服务商
		uni.getProvider({
			service: service || 'oauth',
			success: function (res) {
				// 此处可以排除h5
				if (res.provider) {
					resolve(res.provider[0])
				}
			},
			fail() {
				reject('获取环境服务商失败')
			}
		})
	}).catch(error => {
		console.log(error)
	})

}

export const authorize = (authorizeStr) => {
	return new Promise((resolve, reject) => {
		uni.authorize({
			scope: `scope.${authorizeStr}`,
			success() {
				resolve('获取授权成功')
			},
			fail() {
				switchTab({
					path: '/pages/home/index',
					// query
				});				
				reject('获取授权失败')
			}
		})
	}).catch(error => {
		console.log(error)
	})
}

export const login = (option) => {
	return new Promise((resolve, reject) => {
		getProvider().then(provider => {
			// 调用登录接口
			uni.login({
				provider: provider,
				success: function (loginRes) {
					// 微信登录
					let code = loginRes.code;
					// 检查授权， 检查用户信息授权
					authorize('userInfo').then(() => {
						uni.getUserInfo({
							provider: provider,
							success: function (user) {
								if (Vue.prototype.$deviceType == 'routine') {
									wxappAuth({
										encryptedData: user.encryptedData,
										iv: user.iv,
										code: code,
										spread: cookie.get("spread")
									}).then(({
										data
									}) => {
										resolve(data)
										uni.hideLoading();
										store.commit("LOGIN", data.token, dayjs(data.expires_time));
										store.dispatch('USERINFO', true)
										console.log(store)
										handleGetUserInfo()

									}).catch(error => {
										reject()
										console.log(error)
										handleFail(option, '微信登录失败')
									});
								}
							},
							fail() {
								// 获取用户信息失败
								reject()
								handleFail(option, '获取用户信息失败')
							}
						});
					}).catch(error => {
						reject()
						console.log(error)
						handleFail(option, '拒绝授权')
					})
				},
				fail() {
					// 调用登录接口失败
					reject()
					handleFail(option, '登录失败')
				}
			});
		}).catch(error => {
			reject()
			console.log(error)
			handleFail(option, '获取环境服务商失败')
		})
	}).catch(error => {
		console.log(error)
		handleFail(option, '登录失败')
	})
}

export const handleGetUserInfo = () => {
	getUser().then(res => {
		console.log('获取用户信息')
		store.dispatch('setUserInfo', res.data)
		var pages = getCurrentPages() //获取加载的页面

		var currentPage = pages[pages.length - 1] //获取当前页面的对象
		let url = "/pages/home/index"
		let query = {}
		console.log('currentPage')
		if (currentPage) {
			// 获取到最后一个页面
			if (
				currentPage.route != 'pages/Loading/index' &&
				currentPage.route != 'pages/user/Login/index'
			) {
				url = currentPage.route
			}
			if (currentPage.route == 'pages/authorization/index') {
				const {
					redirect,
					...querys
				} = currentPage.options
				url = redirect
				query = {
					...querys
				}
			}
		}
		console.log(url)
		if (url == '/pages/home/index' || url == '/pages/shop/GoodsClass/index' || url == '/pages/shop/ShoppingCart/index' || url == '/pages/user/User/index') {
			switchTab({
				path: `${url}`,
				query
			});
		} else {
			switchTab({
				path: '/pages/home/index',
				// query
			});
			// push({
			// 	path: `${url}`,
			// 	query
			// })
		}
	})
}


const handleFail = (option, msg) => {
	// 此处是处理登录失效的问题的
	console.log(store)
	option && option.fail ? option.fail() : replaceLogin('登录失败，请重新登录')
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
		query: _$mp.query || _$mp.page.options,
		hash: '',
		fullPath: parseUrl({
			path: `/${path}`,
			query: _$mp.query || _$mp.page.options
		}),
		name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
	}
}

export function auth() {
	/**
	 *	如何判断权限?
	 *	用户如果登录了系统，会留下两个东西，一个是token，一个是userInfo
	 *	token存在会过期的问题，如果长时间没有打开小程序，会导致登录失效，出现打开一个页面瞬间跳转到授权页面的问题
	 *		解决办法，保存token的时候加上过期时间，每次请求都取一下缓存里的token
	 *	userInfo只是用来限时用户信息，作用并不是很大
	 * 	ps：只需要判断 token 是否存在即可
	 */
	if (cookie.get('login_status')) {
		return true
	}
	return false
}


export const handleLoginStatus = (location, complete, fail, success) => {
	// 不登录可访问的页面
	let page = [{
		path: '/pages/Loading/index',
		name: 'loading页面'
	},
	{
		path: '/pages/home/index',
		name: '首页'
	},
	{
		path: '/pages/user/Login/index',
		name: '登录页面'
	},
	{
		path: '/pages/authorization/index',
		name: '授权页面'
	},
	]

	// 是否可以访问
	let isAuth = false

	// 从 location 中获取当前url，location typeof string || object
	let path = ''
	if (typeof location === 'string') {
		path = location
	} else {
		path = location.path
	}

	if (!auth()) {
		page.map((item) => {
			if (item.path == path) {
				isAuth = true
			}
		})
	} else {
		isAuth = true
	}

	return new Promise((resolve, reject) => {
		if (isAuth) {
			// 登录了有权限
			resolve({
				url: parseUrl(location),
				complete,
				fail,
				success
			})
		} else {
			// 未登录没有权限
			replaceLogin()
			reject()
		}
	}).catch(error => {
		console.log(error)
	})
}

export function push(location, complete, fail, success) {
	handleLoginStatus(location, complete, fail, success).then(params => {
		uni.navigateTo(params)
	}).catch(error => {
		// 没有权限

	})
}

export function replace(location, complete, fail, success) {
	handleLoginStatus(location, complete, fail, success).then(params => {
		uni.redirectTo(params)
	}).catch(error => {
		// 没有权限

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
		success: function (e) { },
		fail: function (e) { }
	})
}

export function switchTab(location, complete, fail, success) {
	handleLoginStatus(location, complete, fail, success).then(params => {
		uni.switchTab(params)
	}).catch(error => {
		// 没有权限
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
			if (urlSpread.indexOf('%3F') != -1) {
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
			} else {
				return handleUrlParam(urlSpread)
			}
		}
		return null
	} catch {
		return null
	}

}

export function handleUrlParam(path) {
	console.log(path)

	var url = path.split("?")[1]; //获取url中"?"符后的字串  
	console.log(url)
	var theRequest = new Object();
	let strs = url.split("&");
	for (var i = 0; i < strs.length; i++) {
		theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	}
	return theRequest;
}

const getImageInfo = (images) => {
	return new Promise((resolve, reject) => {
		let imageAry = {}
		images.map((item, index) => {
			uni.getImageInfo({
				src: item,
				fail: function (res) {
					imageAry[index] = null
					if (imageAry.length == images.length) {
						resolve(imageAry)
					}
				},
				success: function (res) {
					imageAry[index] = res
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
	uni.showLoading({
		title: '海报生成中',
		mask: true
	});
	getImageInfo([store.image, store.code]).then(res => {
		let contentHh = 48 * 1.3
		const ctx = uni.createCanvasContext('myCanvas')
		ctx.clearRect(0, 0, 0, 0);
		const WIDTH = 747
		const HEIGHT = 1326;
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, WIDTH, HEIGHT);
		ctx.drawImage(res[0].path, 0, 0, WIDTH, WIDTH);
		ctx.drawImage(res[1].path, 40, 1064, 200, 200);
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
		ctx.save();
		ctx.draw(true, () => {
			uni.canvasToTempFilePath({
				canvasId: 'myCanvas',
				fileType: 'png',
				destWidth: WIDTH,
				destHeight: HEIGHT,
				success: function (res) {
					uni.hideLoading();
					successCallBack && successCallBack(res.tempFilePath);
				},
				fail: function (error) {
					console.log(error)
				},

			})
		});

	})

	// uni.getImageInfo({
	//   src: store.image,
	//   fail: function (res) {
	//     uni.showToast({
	//       title: '海报生成失败',
	//       icon: "none",
	//       duration: 2000
	//     });
	//   },
	//   success: function (res) {

	//   }
	// })
}
