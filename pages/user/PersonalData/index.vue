<template>
  <div class="personal-data">
    <div class="wrapper">
      <div class="title">管理我的账号</div>
      <div class="wrapList">
        <div
          class="item acea-row row-between-wrapper"
          :class="item.uid === userInfo.uid ? 'on' : ''"
          v-for="(item, switchUserInfoIndex) in switchUserInfo"
          :key="switchUserInfoIndex"
        >
          <div class="picTxt acea-row row-between-wrapper">
            <div class="pictrue">
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
                <div class="pictrue">
                  <img :src="item.avatar" />
                </div>
              </VueCoreImageUpload>-->
              <!-- <div class="pictrue" v-else>
                <img :src="item.avatar" />
              </div>-->
              <img
                :src="$VUE_APP_RESOURCES_URL+'/images/alter.png'"
                class="alter"
                v-if="item.uid === userInfo.uid"
              />
            </div>
            <div class="text">
              <div class="name line1">{{ item.nickname }}</div>
              <div class="phone">绑定手机号：{{ item.phone }}</div>
            </div>
          </div>
          <div
            class="currentBnt acea-row row-center-wrapper font-color-red"
            v-if="item.uid === userInfo.uid"
          >当前账号</div>
          <div
            class="bnt font-color-red acea-row row-center-wrapper"
            v-else
            @click="switchAccounts(index)"
          >使用账号</div>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="item acea-row row-between-wrapper">
        <div>昵称</div>
        <div class="input">
          <input type="text" v-model="userInfo.nickname" />
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>ID号</div>
        <div class="input acea-row row-between-wrapper">
          <input type="text" :value="userInfo.uid" disabled class="id" />
          <span class="iconfont icon-suozi"></span>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div>手机号</div>
        <div class="input">
          <input type="text" v-if="userInfo.phone" v-model="userInfo.phone" />
          <input type="text" v-else value="未绑定" disabled class="id" />
        </div>
      </div>
      <div class="item acea-row row-between-wrapper" @click="goChangePassword()">
        <div>密码</div>
        <div class="input acea-row row-between-wrapper">
          <span>点击修改密码</span>
          <span class="iconfont icon-suozi"></span>
        </div>
      </div>
    </div>
    <!--<div class="modifyBnt bg-color-red" @click="submit">保存修改</div>-->
    <!-- <div
      class="logOut cart-color acea-row row-center-wrapper"
      @click="logout"
      v-if="!isWeixin"
    >
      退出登录
    </div>-->
  </div>
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
  watch: {
    $yroute(n) {
      if (n.name === "PersonalData") this.$store.dispatch("USERINFO", true);
    }
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
      if (userInfo === undefined)
        return this.$dialog.toast({ mes: "切换的账号不存在" });
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
            return that.$dialog.toast({ mes: err });
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
      if (res.status !== 200)
        return this.$dialog.error(res.msg || "上传图片失败");
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
          this.$uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
          this.$yrouter.back();
        },
        error => {
          this.$dialog.error(error.msg);
        }
      );
    },
    logout: function() {
      this.$dialog.confirm({
        mes: "确认退出登录?",
        opts: () => {
          getLogout()
            .then(res => {
              this.$store.commit("LOGOUT");
              clearAuthStatus();
              location.href = location.origin;
            })
            .catch(err => {});
        }
      });
    }
  }
};
</script>
