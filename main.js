import Vue from 'vue'
import App from './App'

// import router from "./router";
import store from "./store";
import animate from "animate.css";
import schema from "async-validator";
import dialog from "./utils/dialog";
import cookie from "@/utils/store/cookie";

// // import "@/assets/iconfont/iconfont";
// import "@/assets/iconfont/iconfont.css";
// // import "@/assets/js/media_750";
// // import "vue-ydui/dist/ydui.base.css";
// import "@/assets/css/base.less";
// import "@/assets/css/reset.less";
// import "@/assets/css/style.less";

import {
	parseRoute,
	_router
} from "@/utils";
import {
	VUE_APP_RESOURCES_URL,
	VUE_APP_API_URL
} from "@/config";

Vue.use(animate);
Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== "production";

Vue.prototype.$validator = function(rule) {
	return new schema(rule);
};

Vue.prototype.$dialog = dialog;

const CACHE_KEY = "clear_0.0.1";

if (!cookie.has(CACHE_KEY)) {
	cookie.clearAll();
	cookie.set(CACHE_KEY, 1);
}


Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.$store = store

const app = new Vue(App)

Vue.mixin({
	onLoad() {
		const {
			$mp
		} = this.$root
		this._route = parseRoute($mp)
		// this.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL;
		this._data.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL;
	},
	onShow() {
		_router.app = this
		_router.currentRoute = this._route
	}
})

Object.defineProperty(Vue.prototype, '$yrouter', {
	get() {
		return _router
	}
})

Object.defineProperty(Vue.prototype, '$yroute', {
	get() {
		return this._route
	}
})

Vue.prototype.$VUE_APP_RESOURCES_URL = VUE_APP_RESOURCES_URL
Vue.prototype.$VUE_APP_API_URL = VUE_APP_API_URL

// #ifdef APP-PLUS
// App平台编译的代码
Vue.prototype.$deviceType = 'App'
Vue.prototype.$platform = uni.getSystemInfoSync().platform
// #endif

// #ifndef H5
// H5编译的代码
Vue.prototype.$deviceType = 'H5'
// #endif

// #ifdef MP-WEIXIN
// 微信小程序编译的代码
Vue.prototype.$deviceType = 'Weixin'
// #endif

if(wx){
	Vue.prototype.$deviceType = 'Weixin'
}

app.$mount()
