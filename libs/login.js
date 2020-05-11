// import router from "../router";
import store from "../store";
import cookie from "@/utils/store/cookie";
import {
	isWeixin,
	login,
	replaceLogin,
	getCurrentPageUrl,
	getCurrentPageUrlWithArgs,
	parseQuery,
	replace,
	handleQrCode
} from "@/utils";

export default function toLogin(push, backUrl) {
	// console.log('需要重新登录')
	store.commit("LOGOUT");
	// 如果没有授权，走登录的接口重新授权
	// 授权获取失败会跳转到授权的接口
	// console.log(store.getters.isAuthorization, '是否有登陆权限')
	if (store.getters.isAuthorization) {
		login()
		return
	}
	// console.log(store.getters.isAuthorizationPage, '判断是不是登录页面或者授权页面')
	// 判断当前是不是已经在登录页面或者授权页，防止二次跳转
	if (store.getters.isAuthorizationPage || getCurrentPageUrl() == '/pages/user/Login/index') {
		return
	}

	// 判断是不是扫描的砍价海报进来的
	if (getCurrentPageUrl() == 'pages/activity/DargainDetails/index' && handleQrCode()) {
		let url = handleQrCode();
		if (url) {
			replaceLogin({
				redirect: `/${getCurrentPageUrl()}`,
				id: url.bargainId,
				partake: url.uid
			})
		} else {
			replaceLogin()
		}
	} else {
		replaceLogin()
	}
	store.commit("UPDATE_AUTHORIZATION", false);
	store.commit("UPDATE_AUTHORIZATIONPAGE", true);
}
