<template>
  <view>
    <view class="payment" :class="value === true ? 'on' : ''">
      <view class="title acea-row row-center-wrapper">
        选择付款方式<text class="iconfont icon-guanbi" @click="close"></text>
      </view>
      <view
        class="item acea-row row-between-wrapper"
        v-if="types.indexOf('weixin') !== -1"
        @click="checked('weixin')"
      >
        <view class="left acea-row row-between-wrapper">
          <view class="iconfont icon-weixinzhifu"></view>
          <view class="text">
            <view class="name">微信支付</view>
            <view class="info">使用微信快捷支付</view>
          </view>
        </view>
        <view class="iconfont icon-xiangyou"></view>
      </view>
      <!-- <view
        class="item acea-row row-between-wrapper"
        v-if="types.indexOf('alipay') !== -1"
        @click="checked('alipay')"
      >
        <view class="left acea-row row-between-wrapper">
          <view class="iconfont icon-zhifubao"></view>
          <view class="text">
            <view class="name">支付宝支付</view>
            <view class="info">使用线上支付宝支付</view>
          </view>
        </view>
        <view class="iconfont icon-xiangyou"></view>
      </view> -->
      <view
        class="item acea-row row-between-wrapper"
        v-if="types.indexOf('yue') !== -1"
        @click="checked('yue')"
      >
        <view class="left acea-row row-between-wrapper">
          <view class="iconfont icon-yuezhifu"></view>
          <view class="text">
            <view class="name">余额支付</view>
            <view class="info">
              当前可用余额：<text class="money">{{ balance }}</text>
            </view>
          </view>
        </view>
        <view class="iconfont icon-xiangyou"></view>
      </view>
      <!-- <view
        class="item acea-row row-between-wrapper"
        v-if="types.indexOf('offline') !== -1"
        @click="checked('offline')"
      >
        <view class="left acea-row row-between-wrapper">
          <view class="iconfont icon-yuezhifu1"></view>
          <view class="text">
            <view class="name">线下支付</view>
            <view class="info">选择线下付款方式</view>
          </view>
        </view>
        <view class="iconfont icon-xiangyou"></view>
      </view> -->
    </view>
    <view class="mask" v-show="value" @click="close"></view>
  </view>
</template>
<script>
export default {
  name: "Payment",
  props: {
    value: {
      type: Boolean,
      default: false
    },
    balance: {
      type: [Number, String],
      default: 0
    },
    types: {
      type: Array,
      default: () => ["weixin", "alipay", "yue", "offline"]
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    checked: function(type) {
      this.$emit("checked", type);
      this.close();
    },
    close: function() {
      this.$emit("input", false);
    }
  }
};
</script>
<style scoped>
.payment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 0.16rem 0.16rem 0 0;
  background-color: #fff;
  padding-bottom: 0.6rem;
  z-index: 99;
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -webkit-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -moz-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  -o-transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  transform: translate3d(0, 100%, 0);
  -webkit-transform: translate3d(0, 100%, 0);
  -ms-transform: translate3d(0, 100%, 0);
  -moz-transform: translate3d(0, 100%, 0);
  -o-transform: translate3d(0, 100%, 0);
}

.payment.on {
  transform: translate3d(0, 0, 0);
  -webkit-transform: translate3d(0, 0, 0);
  -ms-transform: translate3d(0, 0, 0);
  -moz-transform: translate3d(0, 0, 0);
  -o-transform: translate3d(0, 0, 0);
}

.payment .title {
  text-align: center;
  height: 1.23rem;
  font-size: 0.32rem;
  color: #282828;
  font-weight: bold;
  padding-right: 0.3rem;
  margin-left: 0.3rem;
  position: relative;
  border-bottom: 0.01rem solid #eee;
}

.payment .title .iconfont {
  position: absolute;
  right: 0.3rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.43rem;
  color: #8a8a8a;
  font-weight: normal;
}

.payment .item {
  border-bottom: 0.01rem solid #eee;
  height: 1.3rem;
  margin-left: 0.3rem;
  padding-right: 0.3rem;
}

.payment .item .left {
  width: 6.1rem;
}

.payment .item .left .text {
  width: 5.4rem;
}

.payment .item .left .text .name {
  font-size: 0.32rem;
  color: #282828;
}

.payment .item .left .text .info {
  font-size: 0.24rem;
  color: #999;
}

.payment .item .left .text .info .money {
  color: #ff9900;
}

.payment .item .left .iconfont {
  font-size: 0.45rem;
  color: #09bb07;
}

.payment .item .left .iconfont.icon-zhifubao {
  color: #00aaea;
}

.payment .item .left .iconfont.icon-yuezhifu {
  color: #ff9900;
}

.payment .item .left .iconfont.icon-yuezhifu1 {
  color: #eb6623;
}

.payment .item .iconfont {
  font-size: 0.3rem;
  color: #999;
}
</style>
