<template>
  <div class="user">
    <div class="header bg-color-red acea-row row-between-wrapper">
      <div class="picTxt acea-row row-between-wrapper">
        <div class="pictrue">
          <img :src="userInfo.avatar" />
        </div>
        <div class="text">
          <div class="acea-row row-middle">
            <div class="name line1">{{ userInfo.nickname }}</div>
            <div class="member acea-row row-middle" v-if="userInfo.vip">
              <img :src="userInfo.vipIcon" />
              {{ userInfo.vipName }}
            </div>
          </div>
          <div
            @click="$yrouter.push('/pages/user/PersonalData/index')"
            class="id"
            v-if="userInfo.phone"
          >
            ID：{{ userInfo.uid || 0
            }}
            <span class="iconfont icon-bianji1"></span>
          </div>
          <button
            open-type="getPhoneNumber"
            @getphonenumber="getPhoneNumber"
            class="binding"
            v-else
          >
            <span>绑定手机号</span>
          </button>
        </div>
      </div>
      <span
        class="iconfont icon-shezhi"
        @click="$yrouter.push({ path: '/pages/user/PersonalData/index' })"
      ></span>
    </div>
    <div class="wrapper">
      <div class="nav acea-row row-middle">
        <div @click="$yrouter.push({ path: '/pages/user/UserAccount/index' })" class="item">
          <div>我的余额</div>
          <div class="num">{{ userInfo.nowMoney || 0 }}</div>
        </div>
        <div
          @click="$yrouter.push('/pages/user/promotion/UserPromotion/index')"
          class="item"
          v-if="userInfo.isPromoter === 1 || userInfo.statu === 2"
        >
          <div>当前佣金</div>
          <div class="num">{{ userInfo.brokeragePrice || 0 }}</div>
        </div>
        <div @click="$yrouter.push('/pages/user/signIn/Integral/index')" class="item" v-else>
          <div>当前积分</div>
          <div class="num">{{ userInfo.integral || 0 }}</div>
        </div>
        <div @click="$yrouter.push('/pages/user/coupon/UserCoupon/index')" class="item">
          <div>优惠券</div>
          <div class="num">{{ userInfo.couponCount || 0 }}</div>
        </div>
      </div>
      <div class="myOrder">
        <div class="title acea-row row-between-wrapper">
          <div>我的订单</div>
          <div @click="$yrouter.push('/pages/order/MyOrder/index')" class="allOrder">
            全部订单
            <span class="iconfont icon-jiantou"></span>
          </div>
        </div>
        <div class="orderState acea-row row-middle">
          <div
            @click="$yrouter.push({ path: '/pages/order/MyOrder/index',query:{type:0}})"
            class="item"
          >
            <div class="pictrue">
              <img :src="$VUE_APP_RESOURCES_URL + '/images/dfk.png'" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.unpaidCount > 0"
              >{{ orderStatusNum.unpaidCount }}</span>
            </div>
            <div>待付款</div>
          </div>
          <div
            @click="$yrouter.push({ path: '/pages/order/MyOrder/index',query:{type:1} })"
            class="item"
          >
            <div class="pictrue">
              <img :src="$VUE_APP_RESOURCES_URL+'/images/dfh.png'" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.unshippedCount > 0"
              >{{ orderStatusNum.unshippedCount }}</span>
            </div>
            <div>待发货</div>
          </div>
          <div
            @click="$yrouter.push({ path: '/pages/order/MyOrder/index',query:{type:2}})"
            class="item"
          >
            <div class="pictrue">
              <img :src="$VUE_APP_RESOURCES_URL+'/images/dsh.png'" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.receivedCount > 0"
              >{{ orderStatusNum.receivedCount }}</span>
            </div>
            <div>待收货</div>
          </div>
          <div
            @click="$yrouter.push({ path: '/pages/order/MyOrder/index',query:{type:3} })"
            class="item"
          >
            <div class="pictrue">
              <img :src="$VUE_APP_RESOURCES_URL+'/images/dpj.png'" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.evaluatedCount > 0"
              >{{ orderStatusNum.evaluatedCount }}</span>
            </div>
            <div>待评价</div>
          </div>
          <div @click="$yrouter.push('/pages/order/ReturnList/index')" class="item">
            <div class="pictrue">
              <img :src="$VUE_APP_RESOURCES_URL+'/images/sh.png'" />
              <span
                class="order-status-num"
                v-if="orderStatusNum.refundCount > 0"
              >{{ orderStatusNum.refundCount }}</span>
            </div>
            <div>售后/退款</div>
          </div>
        </div>
      </div>
      <div class="myService">
        <div class="title acea-row row-middle">我的服务</div>
        <div class="serviceList acea-row row-middle">
          <template v-for="(item, MyMenusIndex) in MyMenus">
            <div class="item" :key="MyMenusIndex" @click="goPages(MyMenusIndex)" v-if="item.url">
              <div class="pictrue">
                <img :src="item.pic" />
              </div>
              <div>{{ item.name }}</div>
            </div>
          </template>
          <!--<div-->
          <!--class="item"-->
          <!--@click="changeswitch(true)"-->
          <!--v-if="userInfo.phone && isWeixin"-->
          <!--&gt;-->
          <!--<div class="pictrue"><img :src="$VUE_APP_RESOURCES_URL+'/images/switch.png'" /></div>-->
          <!--<div>账号切换</div>-->
          <!--</div>-->
        </div>
      </div>
    </div>
    <p style="text-align: center;margin-top: 1rem">By@意象</p>
    <div class="footer-line-height"></div>
    <SwitchWindow
      v-on:changeswitch="changeswitch"
      :switchActive="switchActive"
      :login_type="userInfo.login_type"
    ></SwitchWindow>
  </div>
</template>
<script>
import { getUser, getMenuUser, bindingPhone } from "@/api/user";
import { isWeixin, VUE_APP_RESOURCES_URL } from "@/utils";
import SwitchWindow from "@/components/SwitchWindow";
import { mapGetters } from "vuex";

const NAME = "User";

export default {
  name: NAME,
  components: {
    SwitchWindow
  },
  props: {},
  data: function() {
    return {
      userInfo: {},
      MyMenus: [],
      orderStatusNum: {},
      switchActive: false,
      isWeixin: false
    };
  },
  computed: mapGetters(["wxCode"]),
  watch: {
    $yroute(n) {
      if (n.name === NAME) this.User();
    }
  },
  mounted: function() {
    console.log('这个是个人中心')
    this.User();
    this.MenuUser();
    this.isWeixin = isWeixin();
  },
  methods: {
    getPhoneNumber: function(e) {
      console.log(e.mp.detail);
      if (e.mp.detail.errMsg == "getPhoneNumber:ok") {
        wx.showLoading({ title: "绑定中" });
        wx.login({
          success: loginRes => {
            bindingPhone({
              code: loginRes.code,
              encryptedData: e.mp.detail.encryptedData,
              iv: e.mp.detail.iv
            })
              .then(res => {
                this.User();
                wx.hideLoading();
                wx.showToast({
                  title: res.msg,
                  icon: "success",
                  duration: 2000
                });
              })
              .catch(error => {
                wx.showToast({
                  title: error.msg || error.response.data.msg,
                  icon: "none",
                  duration: 2000
                });
              });
          }
        });
      } else {
        wx.showToast({
          title: "已拒绝授权",
          icon: "none",
          duration: 2000
        });
      }
    },
    changeswitch: function(data) {
      this.switchActive = data;
    },
    User: function() {
      let that = this;
      getUser().then(res => {
        that.userInfo = res.data;
        that.orderStatusNum = res.data.orderStatusNum;
      });
    },
    MenuUser: function() {
      let that = this;
      getMenuUser().then(res => {
        that.MyMenus = res.data.routine_my_menus;
      });
    },
    goPages: function(index) {
      let url = this.MyMenus[index].wxapp_url;
      if (
        url === "/pages/user/promotion/UserPromotion/main" &&
        this.userInfo.statu === 1
      ) {
        if (!this.userInfo.isPromoter)
          return this.$dialog.toast({ mes: "您还没有推广权限！！" });
      }

      if (
        url === "/pages/orderAdmin/OrderIndex/main" &&
        !this.userInfo.adminid
      ) {
        return this.$dialog.toast({ mes: "您还不是管理员！！" });
      }

      this.$yrouter.push({ path: this.MyMenus[index].wxapp_url });
    }
  },
  onShow() {
    this.User();
    this.MenuUser();
    this.isWeixin = isWeixin();
  }
};
</script>

<style>

.footer-line-height {
  height: 1rem;
}
.order-status-num {
  min-width: 0.33rem;
  background-color: #fff;
  color: #73cbb6;
  border-radius: 15px;
  position: absolute;
  right: -0.14rem;
  top: -0.15rem;
  font-size: 0.2rem;
  padding: 0 0.08rem;
  border: 1px solid #73cbb6;
}

.pictrue {
  position: relative;
}
.switch-h5 {
  margin-left: 0.2rem;
}
.binding {
  margin-top: 0.1rem;
  display: inline-block;
  padding: 0.05rem 0.2rem;
  background-color: #ca1f10;
  border-radius: 50px;
  font-size: 0.22rem;
  line-height: 1.5;
  border: 1px solid #e8695e;
  color: #ffffff;
}
</style>
