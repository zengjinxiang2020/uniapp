// import router from "../router";
import store from "../store";
import cookie from "@/utils/store/cookie";
import { isWeixin, login, getCurrentPageUrl, getCurrentPageUrlWithArgs, parseQuery, replace, handleQrCode } from "@/utils";

export default function toLogin(push, backUrl) {
  store.commit("LOGOUT");
  if (store.getters.isAuthorization) {
    login()
    return
  }
  if (store.getters.isAuthorizationPage || getCurrentPageUrl() == '/pages/user/Login/index') {
    return
  }

  // 判断是不是扫描的砍价海报进来的
  if (getCurrentPageUrl() == 'pages/activity/DargainDetails/index' && handleQrCode()) {
    let url = handleQrCode();
    if (url) {
      console.log(222222222)
      replace({ path: '/pages/user/Login/index', query: { redirect: `/${getCurrentPageUrl()}`, id: url.bargainId, partake: url.uid } })
    } else {
      replace({ path: '/pages/user/Login/index', query: { redirect: `/${getCurrentPageUrl()}`, ...parseQuery() } })
    }
  } else {
    console.log(222222222)
    replace({ path: '/pages/user/Login/index', query: { redirect: `/${getCurrentPageUrl()}`, ...parseQuery() } })
  }
  store.commit("UPDATE_AUTHORIZATION", false);
  store.commit("UPDATE_AUTHORIZATIONPAGE", true);
}

