import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

import cookie from "@/utils/store/cookie";
import {
	getUserInfo,
	getUser
} from "@/api/user";
import dialog from "@/utils/dialog";

const LOGIN_KEY = "login_status";

const vuexStore = new Vuex.Store({
	state: {
		// 是否已经在授权页面
		isAuthorizationPage: false,
		// 是否授权
		isAuthorization: false,
		// 不建议从这里取 token，但是删除掉会影响其他的页面
		token: cookie.get(LOGIN_KEY) || null,
		userInfo: cookie.get('userInfo'),
		$deviceType: null,
	},
	mutations: {
		SHOW_FOOTER(state) {
			state.footer = true;
		},
		HIDE_FOOTER(state) {
			state.footer = false;
		},
		SHOW_HOME(state) {
			state.home = true;
		},
		HIDE_HOME(state) {
			state.home = false;
		},
		OPEN_HOME(state) {
			state.homeActive = true;
		},
		CLOSE_HOME(state) {
			state.homeActive = false;
		},
		CHANGE_TABTAR(state, index) {
			state.tabtarIndex = index;
		},
		LOGIN(state, token, expires_time) {
			state.token = token;
			cookie.set(LOGIN_KEY, token, expires_time);
		},
		LOGOUT(state) {
			state.token = null;
			state.userInfo = null
			let spread = cookie.get('spread')
			console.log(spread, 'spread')
			cookie.clearAll()
			cookie.set('spread', spread)
		},
		BACKGROUND_COLOR(state, color) {
			state.color = color;
			// document.body.style.backgroundColor = color;
		},
		UPDATE_USERINFO(state, userInfo) {
			state.userInfo = userInfo;
			if (userInfo) {
				cookie.set('userInfo', userInfo)
			} else {
				cookie.set('userInfo', null)
			}
		},
		UPDATE_AUTHORIZATIONPAGE(state, isAuthorizationPage) {
			state.isAuthorizationPage = isAuthorizationPage;
		},
		UPDATE_AUTHORIZATION(state, isAuthorization) {
			state.isAuthorization = isAuthorization;
		},
		UPDATE_DEVICETYPE(state, $deviceType) {
			state.$deviceType = $deviceType;
		},
	},
	actions: {
		USERINFO({ state, commit }, force) {
			if (state.userInfo !== null && !force) {
				return Promise.resolve(state.userInfo);
			} else {
				return new Promise(reslove => {
					getUserInfo().then(res => {
						commit("UPDATE_USERINFO", res.data);
						reslove(res.data);
					});
				}).catch(() => {
					dialog.error("获取信息失败!");
				});
			}
		},
		getUser({ state, commit }) {
			return new Promise(reslove => {
				getUser().then(res => {
					console.log(res)
					commit("UPDATE_USERINFO", res.data);
					reslove(res.data);
				});
			}).catch((error) => {
				console.log(error)
				dialog.error("获取信息失败!");
			});
		},
		changeLogin({
			state,
			commit
		}, data, date) {
			commit("LOGIN", data, date);
		},
		setUserInfo({
			state,
			commit
		}, user) {
			commit("UPDATE_USERINFO", user);
		},
		changeAuthorizationPage({
			state,
			commit
		}, index) {
			commit("UPDATE_AUTHORIZATIONPAGE", index);
		},
		changeAuthorization({
			state,
			commit
		}, index) {
			commit("UPDATE_AUTHORIZATION", index);
		},
	},
	getters: {
		isAuthorizationPage: state => state.isAuthorizationPage,
		isAuthorization: state => state.isAuthorization,
		token: state => state.token,
		isLogin: state => !!state.token,
		userInfo: state => state.userInfo || {},
	},
	strict: debug
});

export default vuexStore
