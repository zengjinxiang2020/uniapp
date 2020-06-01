// import router from "../router";
import store from "../store";
import cookie from "@/utils/store/cookie";
import {
	isWeixin,
	login,
	getCurrentPageUrl,
	getCurrentPageUrlWithArgs,
	parseQuery,
	replace,
	routerPermissions,
	handleQrCode
} from "@/utils";

export default function toLogin(push, backUrl) {
	console.log('token失效，需要重新登录')
	store.commit("LOGOUT");
	// 如果没有授权，走登录的接口重新授权
	// 授权获取失败会跳转到授权的接口
	console.log(store.getters.isAuthorization, '是否有登陆权限')
	if (store.getters.isAuthorization) {
		login()
		return
	}
	console.log(store.getters.isAuthorizationPage, '判断是不是登录页面或者授权页面')
	// 判断当前是不是已经在登录页面或者授权页，防止二次跳转
	if (store.getters.isAuthorizationPage || getCurrentPageUrl() == '/pages/user/Login/index') {
		console.log('已经是登录页面或者授权页面，跳出方法')
		return
	}

	// 判断是不是扫描的砍价海报进来的
	if (getCurrentPageUrl() == 'pages/activity/DargainDetails/index' && handleQrCode()) {
		console.log('是扫描的砍价海报进来的')
		let url = handleQrCode();
		if (url) {
			replaceLogin({
				redirect: `/${getCurrentPageUrl()}`,
				id: url.bargainId,
				partake: url.uid
			})
		} else {
			console.log('是扫描的砍价海报进来的,但是没有获取到参数')
			routerPermissions()
		}
	} else {
		console.log('无特殊情况，重新登录')
		routerPermissions()
	}
	store.commit("UPDATE_AUTHORIZATION", false);
	store.commit("UPDATE_AUTHORIZATIONPAGE", true);
}
