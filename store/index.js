import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const debug = process.env.NODE_ENV !== "production";

import store from "@/utils/store/cookie";
import { getUserInfo } from "@/api/user";
import dialog from "@/utils/dialog";

const LOGIN_KEY = "login_status";

const vuexStore = new Vuex.Store({
  state: {
    // 是否已经在授权页面
    isAuthorizationPage: false,
    // 是否授权
    isAuthorization: false,
    token: store.get(LOGIN_KEY) || null,
    userInfo: store.get('userInfo')
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
      store.set(LOGIN_KEY, token, expires_time);
    },
    LOGOUT(state) {
      state.token = null;
      state.userInfo = null
      store.clearAll()
    },
    BACKGROUND_COLOR(state, color) {
      state.color = color;
      // document.body.style.backgroundColor = color;
    },
    UPDATE_USERINFO(state, userInfo) {
      state.userInfo = userInfo;
    },
    UPDATE_AUTHORIZATIONPAGE(state, isAuthorizationPage) {
      state.isAuthorizationPage = isAuthorizationPage;
    },
    UPDATE_AUTHORIZATION(state, isAuthorization) {
      state.isAuthorization = isAuthorization;
    },
  },
  actions: {
    USERINFO({ state, commit }, force) {
      if (state.userInfo !== null && !force)
        return Promise.resolve(state.userInfo);
      else
        return new Promise(reslove => {
          getUserInfo().then(res => {
            commit("UPDATE_USERINFO", res.data);
            reslove(res.data);
          });
        }).catch(() => {
          dialog.error("获取信息失败!");
        });
    },
    changeLogin({ state, commit }, data, date) {
      commit("LOGIN", data, date);
    },
    setUserInfo({ state, commit }, user) {
      commit("UPDATE_USERINFO", user);
      if (user) {
        store.set('userInfo', user)
      } else {
        store.set('userInfo', null)
      }
    },
    changeAuthorizationPage({ state, commit }, index) {
      commit("UPDATE_AUTHORIZATIONPAGE", index);
    },
    changeAuthorization({ state, commit }, index) {
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
