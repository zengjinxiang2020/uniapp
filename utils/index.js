import Vue from 'vue'

// import MpvueRouterPatch from 'mpvue-router-patch'
// Vue.use(MpvueRouterPatch)
import {
	wxappAuth,
	getUserInfo
} from "@/api/user";
import store from "@/store";
import dayjs from "dayjs";
import cookie from "@/utils/store/cookie";
import stringify from "@/utils/querystring";
import { VUE_APP_API_URL } from "@/config";
import { wechat, auth, oAuth, toAuth } from '@/libs/wechat'


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
// 年月日，时分秒
// "YYYY-mm-dd HH:MM"
export function dateFormatL(fmt, date) {
	let ret;
	const opt = {
		"Y+": date.getFullYear().toString(), // 年
		"m+": (date.getMonth() + 1).toString(), // 月
		"d+": date.getDate().toString(), // 日
		"H+": date.getHours().toString(), // 时
		"M+": date.getMinutes().toString(), // 分
		"S+": date.getSeconds().toString() // 秒
		// 有其他格式化字符需求可以继续添加，必须转化成字符串
	};
	for (let k in opt) {
		ret = new RegExp("(" + k + ")").exec(fmt);
		if (ret) {
			fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
		};
	};
	return fmt;
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
	if (navigator && navigator.userAgent && navigator.userAgent.toLowerCase().indexOf("micromessenger") !== -1) {
		return true
	}
	return false
}

export function parseQuery() {

	// #ifdef H5

	let res = {};

	const query = (location.href.split("?")[1] || "")
		.trim()
		.replace(/^(\?|#|&)/, "");

	if (!query) {
		return res;
	}

	query.split("&").forEach(param => {
		const parts = param.replace(/\+/g, " ").split("=");
		const key = decodeURIComponent(parts.shift());
		const val = parts.length > 0 ? decodeURIComponent(parts.join("=")) : null;

		if (res[key] === undefined) {
			res[key] = val;
		} else if (Array.isArray(res[key])) {
			res[key].push(val);
		} else {
			res[key] = [res[key], val];
		}
	});
	// #endif
	var url = currentPage.route //当前页面url
	res = currentPage.options //如果要获取url中所带的参数可以查看options
	// #endif

	return res
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
		console.log('检验授权', `scope.${authorizeStr}`)
		uni.getSetting({
			success(res) {
				console.log(res.authSetting)
				if (res.authSetting[`scope.${authorizeStr}`]) {
					resolve('获取授权成功')
				} else {
					reject('获取授权失败')
				}
			},
			fail() {
				reject('获取设置失败')
			}
		})

	})
}

export const login = () => {
	console.log(Vue.prototype)
	return new Promise((resolve, reject) => {
		if (Vue.prototype.$deviceType == 'weixin') {
			// 微信授权登录
			const { code } = parseQuery()
			if (code) {
				auth(code)
					.then(() => {
						// location.replace(
						//   decodeURIComponent(decodeURIComponent(this.$route.params.url))
						// );
						location.href = decodeURIComponent(
							decodeURIComponent(this.$route.params.url)
						);
					})
					.catch(() => {
						reject('当前运行环境为微信浏览器')
						location.replace("/pages/home/index");
					});
			} else {
				// wechat().then(() => oAuth());
			}
			// if (!code) {
			// 	toAuth("wxc061dee8806ff712")
			// } else {
			// 	// wechat().then(() => oAuth().then((code) => {
			// 	// 	// const { code } = parseQuery()
			// 	// 	auth(code)
			// 	// 		.then(() => {
			// 	// 			// location.replace(
			// 	// 			//   decodeURIComponent(decodeURIComponent(this.$route.params.url))
			// 	// 			// );
			// 	// 			location.href = decodeURIComponent(
			// 	// 				decodeURIComponent(this.$route.params.url)
			// 	// 			);
			// 	// 		})
			// 	// 		.catch(() => {
			// 	// 			reject('当前运行环境为微信浏览器')
			// 	// 			location.replace("/pages/home/index");
			// 	// 		});
			// 	// })).catch(error => {
			// 	// 	console.log(error)
			// 	// 	reject('自动登录失败')
			// 	// });
			// }
			return
		}
		if (Vue.prototype.$deviceType == 'weixinh5') {

			reject('当前运行环境为H5')
			return
		}
		console.log('————————————————————')
		console.log('开始登录')
		console.log('————————————————————')
		console.log('获取环境商')
		getProvider().then(provider => {
			console.log('当前的环境商')
			console.log(provider)
			if (!provider) {
				reject()
			}
			// 调用登录接口
			console.log('调用登录接口')
			uni.login({
				provider: provider,
				success: function (loginRes) {
					// 微信登录
					console.log('登录接口调用成功')
					console.log('开始检查用户信息授权')
					let code = loginRes.code;
					// 检查授权， 检查用户信息授权
					authorize('userInfo').then(() => {
						console.log('授权通过')
						console.log('开始获取用户信息')
						uni.getUserInfo({
							provider: provider,
							success: function (user) {
								console.log('获取用户信息成功')
								console.log('开始调用登录接口')
								wxappAuth({
									encryptedData: user.encryptedData,
									iv: user.iv,
									code: code,
									spread: cookie.get("spread")
								}).then(({ data }) => {
									console.log('登录接口调用成功')
									console.log('开始处理登录信息保存，并获取用户详情')
									uni.hideLoading();
									store.commit("login", data.token, dayjs(data.expires_time));
									store.dispatch('userInfo', true)
									getUserInfo().then(user => {
										console.log('获取用户信息成功')
										uni.setStorageSync('uid', user.data.uid);
										store.dispatch('setUserInfo', user.data)
										resolve(user)
									}).catch(error => {
										console.log('获取用户信息失败')
										reject('获取用户信息失败')
									});
								}).catch(error => {
									console.log(error)
									console.log('登录接口调用失败')
									reject('登录接口调用失败')
								});
							},
							fail() {
								console.log('获取用户信息失败')
								reject('获取用户信息失败')
							}
						});
					}).catch(error => {
						console.log('用户未授权')
						reject('用户未授权')
					})
				},
				fail() {
					console.log('调用登录接口失败')
					reject('调用登录接口失败')
				}
			});
		}).catch(error => {
			reject('获取环境服务商失败')
		})
	})
}

export const handleGetUserInfo = () => {
	getUserInfo().then(res => {
		console.log('获取用户信息')
		store.dispatch('setUserInfo', res.data)
		var pages = getCurrentPages() //获取加载的页面

		var currentPage = pages[pages.length - 1] //获取当前页面的对象
		let url = "/pages/home/index"
		let query = {}
		if (currentPage) {
			const {
				redirect,
				...querys
			} = currentPage.options
			// 获取到最后一个页面
			if (
				currentPage.route != 'pages/Loading/index' &&
				currentPage.route != 'pages/user/Login/index'
			) {
				url = currentPage.route
				query = {
					...querys
				}
			}
			if (currentPage.route == 'pages/authorization/index') {

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
			console.log('获取用户信息后跳转回显的页面')
			// 为了防止返回上一页是授权页面，先重定向到首页，再跳转
			console.log({
				path: `/${url}`,
				query
			})
			reLaunch({
				path: '/pages/home/index',
				// query
			});

			setTimeout(() => {
				if (url.indexOf('/') == 0) {
					url = url.slice(1)
				}
				push({
					path: `/${url}`,
					query
				})
			})

			// push({
			// 	path: `${url}`,
			// 	query
			// })
		}
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
		query: _$mp.query || _$mp.page.options,
		hash: '',
		fullPath: parseUrl({
			path: `/${path}`,
			query: _$mp.query || _$mp.page.options
		}),
		name: path && path.replace(/\/(\w)/g, ($0, $1) => $1.toUpperCase())
	}
}

export function handleAuth() {
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

	console.log('即将跳转', location, parseUrl(location))

	// 从 location 中获取当前url，location typeof string || object
	let path = ''
	if (typeof location === 'string') {
		path = location
	} else {
		path = location.path
	}

	// 判断用户是否有token
	if (!handleAuth()) {
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
			// 有token
			if (path == '/pages/home/index' || path == '/pages/shop/GoodsClass/index' || path == '/pages/shop/ShoppingCart/index' || path == '/pages/user/User/index') {
				// switchTab({
				// 	path: parseUrl(location),
				// })
				// return
			}

			resolve({
				url: parseUrl(location),
				complete,
				fail,
				success
			})
		} else {
			// 没有token，先校验用户是否授权，如果授权了，进行自动登录
			routerPermissions(parseUrl(location))
			reject()
		}
	}).catch(error => {
		console.log(error)
	})
}

// export function checkPermissions(){

// }

export function routerPermissions(url, type) {
	console.log('routerPermissions', url)
	console.log('————————')
	console.log(url, type, 'routerPermissions')
	console.log('————————')
	let path = url
	if (!path) {
		path = '/' + getCurrentPageUrlWithArgs()
	}
	console.log(Vue.prototype.$deviceType)
	if (Vue.prototype.$deviceType == 'routine') {
		console.log('————————')
		console.log('当前是微信小程序，开始处理小程序登录方法')
		console.log('————————')
		// 如果是微信小程序，跳转到授权页
		// 先校验用户是否授权，如果授权了，进行自动登录
		console.log('————————')
		console.log('开始校验权限')
		console.log('————————')
		authorize('userInfo').then(() => {
			// 自动登录
			console.log('————————')
			console.log('自动登录')
			console.log('————————')
			login().then(res => {
				// 登录成功，跳转到需要跳转的页面
				console.log('————————')
				console.log('登录成功，跳转页面')
				console.log('————————')
				store.commit("updateAuthorizationPage", false);
				if (path == '/pages/shop/ShoppingCart/index' || path == '/pages/user/User/index') {
					console.log('————————')
					console.log('当前是购物车，或者个人中心')
					console.log('————————')
					return
				}
				if (type == 'reLaunch') {
					reLaunch({
						path,

					})
					return
				}
				if (type == 'replace') {
					replace({
						path,
					})
					return
				}
				{
					push({
						path,
					})
				}
			}).catch(error => {
				console.log('————————')
				console.log('自动登录失败，跳转到授权页面')
				console.log('————————')
				uni.showToast({
					title: error,
					icon: "none",
					duration: 2000
				});
				reLaunch({
					path: '/pages/authorization/index',
				})
				cookie.set('redirect', path)
			})
		}).catch(error => {
			// 跳转到登录页面或者授权页面
			if (path == '/pages/shop/ShoppingCart/index' || path == '/pages/user/User/index') {
				switchTab({
					path,
				})
				store.commit("updateAuthorizationPage", false);
				return
			}
			reLaunch({
				path: '/pages/authorization/index',
			})
			cookie.set('redirect', path)
		})
		// } else if (Vue.prototype.$deviceType == 'weixin') {
		// wechat().then(() => oAuth());
		// if (!type) {
		// 	push({
		// 		path: url,
		// 	})
		// }
	} else {
		// 如果不是小程序跳转到登录页
		console.log('当前无法自动登录，开始处理登录方法')
		push({
			path: '/pages/user/Login/index',
		})
		cookie.set('redirect', path)
	}

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
		console.log(params)
		uni.redirectTo(params)
	}).catch(error => {
		// 没有权限

	})
}

export function reLaunch(location, complete, fail, success) {
	handleLoginStatus(location, complete, fail, success).then(params => {
		console.log(params)
		uni.reLaunch(params)
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
	var url = path.split("?")[1]; //获取url中"?"符后的字串
	var theRequest = new Object();
	if(path.includes("?")){
		var url = path.split("?")[1]; //获取url中"?"符后的字串
		let strs = url.split("&");
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
		}
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



export const handleLoginFailure = () => {

	console.log('————————')
	console.log('退出登录，标记当前页面为授权页面，防止多次跳转')
	console.log('————————')

	store.commit("logout");
	store.commit("updateAuthorization", false);

	// token 失效
	// 判断当前是不是已经在登录页面或者授权页，防止二次跳转
	if (store.getters.isAuthorizationPage || getCurrentPageUrl() == '/pages/user/Login/index') {
		console.log(store.getters.isAuthorizationPage, getCurrentPageUrl(), '已经是登录页面或者授权页面，跳出方法')
		return
	}

	console.log('————————')
	console.log('当前是授权页面')
	console.log(store.getters)
	console.log('————————')
	store.commit("updateAuthorizationPage", true);
	let path = '/' + getCurrentPageUrlWithArgs()
	//判断小程序转发分享商品详情进来的
	if (getCurrentPageUrl() == 'pages/shop/GoodsCon/index' && handleUrlParam(path) && !handleQrCode()) {
		console.log('————————')
		console.log('判断小程序转发分享商品详情进来的')
		console.log(' handleUrlParam()', handleUrlParam(path))

		let url = handleUrlParam(path);
		console.log(url)
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.id,
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			handleNoParameters()
			console.log('————————')
			console.log('是扫描的商品详情进来的,但是没有获取到参数')
			console.log('————————')
		}
	}

	// 是分享转发拼团进来的
	if (getCurrentPageUrl() == 'pages/activity/GroupDetails/index' && handleUrlParam(path)) {
		console.log('————————')
		console.log('是分享转发拼团进来的')
		console.log('————————')

		let url = handleUrlParam(path);
		console.log(url)
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.id,
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			console.log('————————')
			console.log('是拼团进来的,但是没有获取到参数')
			console.log('————————')
			handleNoParameters()
		}
	}

	// 是分享转发秒杀进来的
	if (getCurrentPageUrl() == 'pages/activity/SeckillDetails/index' && handleUrlParam(path)) {
		console.log('————————')
		console.log('是分享转发秒杀进来的')
		console.log('————————')

		let url = handleUrlParam(path);
		console.log(url)
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.id,
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			console.log('————————')
			console.log('是秒杀进来的,但是没有获取到参数')
			console.log('————————')
			handleNoParameters()
		}
	}

	// 判断是不是转发分享的砍价海报进来的
	if (getCurrentPageUrl() == 'pages/activity/DargainDetails/index' && handleUrlParam(path) && !handleQrCode()) {
		console.log('————————')
		console.log('判断是不是转发分享的砍价海报进来的')
		console.log('————————')
		let url = handleUrlParam(path);
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.bargainId,
					partake: url.uid
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			handleNoParameters()
			console.log('————————')
			console.log('是扫描的砍价海报进来的,但是没有获取到参数')
			console.log('————————')


		}
	}
	// 判断是不是拼团进来的
	if (getCurrentPageUrl() == 'pages/activity/GroupRule/index' ) {
		console.log('————————')
		console.log('是拼团进来的')
		console.log('————————')

		let url = handleQrCode();
		if(!url){
			url = handleUrlParam(path);
		}
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.pinkId,
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			console.log('————————')
			console.log('是拼团进来的,但是没有获取到参数')
			console.log('————————')
			handleNoParameters()
		}
	}

	// 判断是不是扫描的砍价海报进来的
	if (getCurrentPageUrl() == 'pages/activity/DargainDetails/index' && handleQrCode()) {
		console.log('————————')
		console.log('是扫描的砍价海报进来的')
		console.log('————————')
		let url = handleQrCode();
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.bargainId,
					partake: url.uid
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			handleNoParameters()
			console.log('————————')
			console.log('是扫描的砍价海报进来的,但是没有获取到参数')
			console.log('————————')


		}
	}

	if (getCurrentPageUrl() == 'pages/shop/GoodsCon/index' && handleQrCode()) {
		debugger;
		console.log('————————')
		console.log('是扫描的商品详情')
		console.log('————————')

		let url = handleQrCode();
		console.log(url)
		if (url) {
			path = parseUrl({
				path: `/${getCurrentPageUrl()}`,
				query: {
					id: url.productId,
				}
			})
			cookie.set("spread", url.spread || 0);
		} else {
			handleNoParameters()
			console.log('————————')
			console.log('是扫描的商品详情进来的,但是没有获取到参数')
			console.log('————————')
		}
	}


	console.log('————————')
	console.log(path, '重定向页面地址')
	console.log('————————')
	routerPermissions(path, 'reLaunch')
}

const handleNoParameters = () => {
	uni.showToast({
		title: '未获取到必要参数，即将跳转首页',
		icon: 'success',
		duration: 2000
	})
	setTimeout(() => {
		clearTimeout()
		switchTab({
			path: '/pages/home/index',
		});
	}, 1500)
}


export function chooseImage(callback) {
	uni.chooseImage({
		count: 1,
		sourceType: ["album"],
		success: res => {
			uni.getImageInfo({
				src: res.tempFilePaths[0],
				success: image => {
					console.log(image);
					uni.showLoading({ title: "图片上传中", mask: true });
					uni.uploadFile({
						url: `${VUE_APP_API_URL}/api/upload`,
						file: image,
						filePath: image.path,
						header: {
							Authorization: "Bearer " + store.getters.token
						},
						name: "file",
						success: res => {
							console.log(res);
							if (callback) {
								callback(JSON.parse(res.data).link)
							}
						},
						fail: err => {
							uni.showToast({
								title: "上传图片失败",
								icon: "none",
								duration: 2000
							});
						},
						complete: res => {
							uni.hideLoading()
						}
					});
				},
				fail: err => {
					uni.showToast({
						title: "获取图片信息失败",
						icon: "none",
						duration: 2000
					});
				}
			});
		}
	});
}


export function handleErrorMessage(err) {
	console.log(err)
	uni.hideLoading();
	uni.showToast({
		title:
			err.msg ||
			err.response.data.msg ||
			err.response.data.message ||
			"创建订单失败",
		icon: "none",
		duration: 2000,
	});
}
