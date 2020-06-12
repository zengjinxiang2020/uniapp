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

const loginKey = "login_status";

const vuexStore = new Vuex.Store({
	state: {
		// 是否已经在授权页面
		isAuthorizationPage: false,
		// 是否授权
		isAuthorization: false,
		// 不建议从这里取 token，但是删除掉会影响其他的页面
		token: cookie.get(loginKey) || null,
		userInfo: cookie.get('userInfo'),
		$deviceType: null,
		location: {
			latitude: '',
			longitude: ''
		}
	},
	mutations: {
		login(state, token, expires_time) {
			state.token = token;
			cookie.set(loginKey, token, expires_time);
		},
		logout(state) {
			console.log('清除数据')
			state.token = null;
			state.userInfo = null
			let spread = cookie.get('spread')
			console.log(spread, 'spread')
			cookie.clearAll()
			cookie.set('spread', spread)
		},
		backgroundColor(state, color) {
			state.color = color;
			// document.body.style.backgroundColor = color;
		},
		updateUserInfo(state, userInfo) {
			state.userInfo = userInfo;
			if (userInfo) {
				cookie.set('userInfo', userInfo)
			} else {
				cookie.set('userInfo', null)
			}
		},
		updateAuthorizationPage(state, isAuthorizationPage) {
			state.isAuthorizationPage = isAuthorizationPage;
		},
		updateAuthorization(state, isAuthorization) {
			state.isAuthorization = isAuthorization;
		},
		updateDevicetype(state, $deviceType) {
			state.$deviceType = $deviceType;
		},
		setLocation(state, location) {
			console.log(location, '定位')
			state.location = location
		}
	},
	actions: {
		getLocation({ state, commit }, force) {
			uni.getLocation({
				type: 'wgs84',
				success: function (res) {
					console.log(res)
					commit("setLocation", {
						longitude: res.longitude,
						latitude: res.latitude,
					});
				}
			});
		},
		userInfo({ state, commit }, force) {
			if (state.userInfo !== null && !force) {
				return Promise.resolve(state.userInfo);
			} else {
				return new Promise(reslove => {
					getUserInfo().then(res => {
						commit("updateUserInfo", res.data);
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
					commit("updateUserInfo", res.data);
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
			commit("login", data, date);
		},
		setUserInfo({
			state,
			commit
		}, user) {
			commit("updateUserInfo", user);
		},
		changeAuthorizationPage({
			state,
			commit
		}, index) {
			commit("updateAuthorizationPage", index);
		},
		changeAuthorization({
			state,
			commit
		}, index) {
			commit("updateAuthorization", index);
		},
	},
	getters: {
		isAuthorizationPage: state => state.isAuthorizationPage,
		isAuthorization: state => state.isAuthorization,
		token: state => state.token,
		isLogin: state => !!state.token,
		userInfo: state => state.userInfo || {},
		location: state => state.location,
	},
	strict: debug
});

export default vuexStore
