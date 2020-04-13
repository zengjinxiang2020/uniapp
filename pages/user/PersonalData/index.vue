<template>
  <view class="personal-data">
    <view class="wrapper">
      <view class="title">管理我的账号</view>
      <view class="wrapList">
        <view
          class="item acea-row row-between-wrapper"
          :class="item.uid === userInfo.uid ? 'on' : ''"
          v-for="(item, switchUserInfoIndex) in switchUserInfo"
          :key="switchUserInfoIndex"
        >
          <view class="picTxt acea-row row-between-wrapper">
            <view class="pictrue">
              <!-- <VueCoreImageUpload
                class="btn btn-primary"
                :crop="false"
                compress="80"
                @imageuploaded="imageuploaded"
                :headers="headers"
                :max-file-size="5242880"
                :credentials="false"
                inputAccept="image/*"
                inputOfFile="file"
                :url="url"
                ref="upImg"
                v-if="item.uid === userInfo.uid"
              >
                <view class="pictrue">
                  <image :src="item.avatar" />
                </view>
              </VueCoreImageUpload>-->
              <!-- <view class="pictrue" v-else>
                <image :src="item.avatar" />
              </view>-->
              <image
                src="@/static/images/alter.png"
                class="alter"
                v-if="item.uid === userInfo.uid"
              />
            </view>
            <view class="text">
              <view class="name line1">{{ item.nickname }}</view>
              <view class="phone">绑定手机号：{{ item.phone }}</view>
            </view>
          </view>
          <view
            class="currentBnt acea-row row-center-wrapper font-color-red"
            v-if="item.uid === userInfo.uid"
          >当前账号</view>
          <view
            class="bnt font-color-red acea-row row-center-wrapper"
            v-else
            @click="switchAccounts(index)"
          >使用账号</view>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="item acea-row row-between-wrapper">
        <view>昵称</view>
        <view class="input">
          <input type="text" v-model="userInfo.nickname" />
        </view>
      </view>
      <view class="item acea-row row-between-wrapper">
        <view>ID号</view>
        <view class="input acea-row row-between-wrapper">
          <input type="text" :value="userInfo.uid" disabled class="id" />
          <text class="iconfont icon-suozi"></text>
        </view>
      </view>
      <view class="item acea-row row-between-wrapper">
        <view>手机号</view>
        <view class="input">
          <input type="text" v-if="userInfo.phone" v-model="userInfo.phone" />
          <input type="text" v-else value="未绑定" disabled class="id" />
        </view>
      </view>
      <view class="item acea-row row-between-wrapper" @click="goChangePassword()">
        <view>密码</view>
        <view class="input acea-row row-between-wrapper">
          <text>点击修改密码</text>
          <text class="iconfont icon-suozi"></text>
        </view>
      </view>
    </view>
    <!--<view class="modifyBnt bg-color-red" @click="submit">保存修改</view>-->
    <!-- <view
      class="logOut cart-color acea-row row-center-wrapper"
      @click="logout"
      v-if="!isWeixin"
    >
      退出登录
    </view>-->
  </view>
</template>
<script>
import { mapGetters } from "vuex";
import { trim, isWeixin } from "@/utils";
import { VUE_APP_API_URL } from "@/config";
import { postUserEdit, getLogout, switchH5Login, getUser } from "@/api/user";
import cookie from "@/utils/store/cookie";
import store from "@//store";
import dayjs from "dayjs";

export default {
  name: "PersonalData",
  components: {
    // VueCoreImageUpload
  },
  data: function() {
    return {
      url: `${VUE_APP_API_URL}/upload/image`,
      headers: {
        Authorization: "Bearer " + this.$store.state.token
      },
      avatar: "",
      isWeixin: false,
      currentAccounts: 0,
      switchUserInfo: [],
      userIndex: 0
    };
  },
  computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.avatar = this.userInfo.avatar;
    this.isWeixin = isWeixin();
    this.getUserInfo();
  },
  methods: {
    goChangePassword() {
      this.$yrouter.push("/pages/user/ChangePassword/index");
    },
    switchAccounts: function(index) {
      let that = this;
      this.userIndex = index;
      let userInfo = this.switchUserInfo[this.userIndex];
      if (this.switchUserInfo.length <= 1) return true;
      if (userInfo === undefined) {
        uni.showToast({
          title: "切换的账号不存在",
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (userInfo.user_type === "h5") {
        switchH5Login()
          .then(({ data }) => {
            uni.hideLoading();
            const expires_time = dayjs(data.expires_time);
            store.commit("LOGIN", data.token, expires_time);
            that.$emit("changeswitch", false);
            location.reload();
          })
          .catch(err => {
            uni.hideLoading();
            uni.showToast({
              title: err.msg || err.response.data.msg,
              icon: "none",
              duration: 2000
            });
          });
      } else {
        cookie.set("loginType", "wechat", 60);
        uni.hideLoading();
        this.$store.commit("LOGOUT");
        this.$emit("changeswitch", false);
      }
    },
    getUserInfo: function() {
      let that = this;
      getUser().then(res => {
        let switchUserInfo = res.data.switchUserInfo;
        for (let i = 0; i < switchUserInfo.length; i++) {
          if (switchUserInfo[i].uid == that.userInfo.uid) that.userIndex = i;
          if (
            !that.isWeixin &&
            switchUserInfo[i].user_type != "h5" &&
            switchUserInfo[i].phone === ""
          )
            switchUserInfo.splice(i, 1);
        }
        that.$set(this, "switchUserInfo", switchUserInfo);
      });
    },
    imageuploaded(res) {
      if (res.status !== 200) {
        uni.showToast({
          title: res.msg || res.response.data.msg,
          icon: "none",
          duration: 2000
        });
        return;
      }
      if (this.switchUserInfo[this.userIndex] === undefined) return;
      this.$set(this.switchUserInfo[this.userIndex], "avatar", res.data.url);
    },

    submit: function() {
      let userInfo = this.switchUserInfo[this.userIndex];
      postUserEdit({
        nickname: trim(this.userInfo.nickname),
        avatar: userInfo.avatar
      }).then(
        res => {
          this.$store.dispatch("USERINFO", true);
          this.$uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
          this.$yrouter.back();
        },
        err => {
          uni.showToast({
            title: err.msg || err.response.data.msg,
            icon: "none",
            duration: 2000
          });
        }
      );
    },
    logout: function() {
      uni.showModal({
        title: "提示",
        content: "确认退出登录?",
        success: function(res) {
          if (res.confirm) {
            getLogout()
              .then(res => {
                this.$store.commit("LOGOUT");
                clearAuthStatus();
                location.href = location.origin;
              })
              .catch(err => {});
          } else if (res.cancel) {
            // console.log("用户点击取消");
          }
        }
      });
    }
  }
};
</script>
