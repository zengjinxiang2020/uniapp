<template>
  <view class="lottie-bg">
    <view id="lottie">
      <image src="../../static/images/live-logo.gif" rel="preload" mode="widthFix" style="width: 100%;" />
    </view>
  </view>
</template>

<script>
  import {
    mapState,
    mapMutations,
    mapActions
  } from "vuex";
  // 组件
  // import request from "@//api/request";
  import {
    wxappAuth,
    getUser
  } from "@/api/user";
  import dayjs from "dayjs";
  import cookie from "@/utils/store/cookie";
  import {
    parseQuery,
    login,
    handleQrCode,
    getCurrentPageUrl,
    handleUrlParam,
    getCurrentPageUrlWithArgs
  } from "@/utils";

  export default {
    name: "Loading",
    data() {
      return {};
    },
    onShow() {

      var url = handleQrCode();
      if (!url) {
        url = handleUrlParam(getCurrentPageUrlWithArgs())
      }
      // 判断是否是分销
      if (url) {
        let urlSpread = parseInt(url.spread);
        cookie.set("spread", urlSpread || 0);
      }
      // if (this.$deviceType == "app" || this.$deviceType == "weixinh5") {
      //   this.$yrouter.switchTab({
      //     path: "/pages/home/index"
      //   });
      //   return;
      // }
      if (this.$store.getters.token) {
        // 如果token存在，直接进行进页面
        console.log('登录状态存在，直接进页面')
        this.toLaunch();
        return;
      }
      console.log('进行登录操作')
      login().finally(() => {
        this.$yrouter.switchTab({
          path: "/pages/home/index"
        });
      });
    },
    methods: {
      ...mapActions(["changeAuthorization", "setUserInfo"]),
      toLaunch() {
        console.log("loading home");
        this.changeAuthorization(false);
        let redirect = cookie.get('redirect')
        if (redirect) {
          redirect = redirect.split('/pages')[1]
          this.$yrouter.replace({
            path: '/pages' + redirect,
          });
          cookie.remove('redirect');
        } else {
          this.$yrouter.switchTab({
            path: "/pages/home/index"
          });
        }
      }
    }
  };
</script>

<style scoped lang="less">
  .lottie-bg {
    position: fixed;
    left: 0;
    top: 0;
    background-color: #fff;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  #lottie {
    width: 35%;
    display: block;
    overflow: hidden;
    transform: translate3d(0, 0, 0);
    margin: auto;
  }
</style>
