<script>
import Vue from 'vue'
export default {
  onLaunch: function () {
    console.log("App Launch");
  },
  onShow: function () {
    console.log("App Show");
  },
  onHide: function () {
    console.log("App Hide");
  },
  mounted() {
	  this.setAppInfo()
  },
  methods: {
    // 获取系统栏高度
    async setAppInfo() {
      let that = this;
      return new Promise((resolve, reject) => {
        uni.getSystemInfo({
          success: function (e) {
            Vue.prototype.StatusBar = e.statusBarHeight;
            // #ifdef H5
            Vue.prototype.CustomBar = e.statusBarHeight + 45;
            // #endif

            // #ifdef APP-PLUS
            if (e.platform == "android") {
              Vue.prototype.CustomBar = e.statusBarHeight + 50;
            } else {
              Vue.prototype.CustomBar = e.statusBarHeight + 45;
            }
            // #endif

            // #ifdef MP-WEIXIN
            let custom = wx.getMenuButtonBoundingClientRect();
            Vue.prototype.Custom = custom;
            Vue.prototype.CustomBar =
              custom.bottom + custom.top - e.statusBarHeight;
            // #endif
          },
        });
      });
	},
	
    // 自动登录
    async autoLogin(data) {
      
    },
  },
  
};
</script>

	
<style lang="less">
/*每个页面公共css */
@import "animate.css";
@import "./assets/iconfont/iconfont.css";
@import "./assets/css/base.less";
@import "./assets/css/reset.less";
@import "./assets/css/style.less";
</style>
