import Vue from 'vue'
import App from './App'

// import router from "./router";
import store from "./store";
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

Vue.config.productionTip = false;
Vue.config.devtools = process.env.NODE_ENV !== "production";

Vue.prototype.$validator = function(rule) {
	return new schema(rule);
};

// const CACHE_KEY = "clear_0.0.1";

// if (!cookie.has(CACHE_KEY)) {
// 	cookie.clearAll();
// 	cookie.set(CACHE_KEY, 1);
// }


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

// #ifdef H5
// H5编译的代码
Vue.prototype.$deviceType = 'h5'
store.commit('UPDATE_DEVICETYPE','h5')
// #endif

// #ifdef APP-PLUS
// App平台编译的代码
Vue.prototype.$deviceType = 'app'
store.commit('UPDATE_DEVICETYPE','app')
Vue.prototype.$platform = uni.getSystemInfoSync().platform
// #endif

// #ifdef MP-WEIXIN
// 微信小程序编译的代码
Vue.prototype.$deviceType = 'routine'
store.commit('UPDATE_DEVICETYPE','routine')
// #endif

// !!! ps  不建议在 template 中使用 $deviceType 去判断当前环境，很有可能出现 $deviceType 为 undefined 导致判断出错的问题，可以在 script 模块中正常使用
// 建议通过 store 去获取 $deviceType 可以保证 template 中取到的值有效
// import { mapState, mapMutations, mapActions } from 'vuex';
// computed: {
// 		...mapState(['$deviceType'])
// },

app.$mount()
