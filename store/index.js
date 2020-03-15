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
    wxCode: null,
    isAuthorizationPage: false,
    isAuthorization: false,
    footer: true,
    home: true,
    tabtarIndex: 0,
    homeActive: false,
    token: store.get(LOGIN_KEY) || null,
    backgroundColor: "#fff",
    userInfo: null
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
      state.token = undefined;
      store.remove(LOGIN_KEY);
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
    UPDATE_WXCODE(state, wxCode) {
      console.log(wxCode, 'wxCode')
      state.wxCode = wxCode;
    }
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
    changeUserInfo({ state, commit }, user) {
      commit("UPDATE_USERINFO", user.user);
    },
    changeTabtar({ state, commit }, index) {
      commit("CHANGE_TABTAR", index);
    },
    changeAuthorization({ state, commit }, index) {
      commit("UPDATE_AUTHORIZATION", index);
    },
    changeWxCode({ state, commit }, index) {
      commit("UPDATE_WXCODE", index);
    },
  },
  getters: {
    wxCode: state => state.wxCode,
    isAuthorizationPage: state => state.isAuthorizationPage,
    isAuthorization: state => state.isAuthorization,
    footer: state => state.footer,
    homeActive: state => state.homeActive,
    home: state => state.home,
    token: state => state.token,
    isLogin: state => !!state.token,
    backgroundColor: state => state.backgroundColor,
    userInfo: state => state.userInfo || {},
    tabtarIndex: state => state.tabtarIndex
  },
  strict: debug
});

export default vuexStore
