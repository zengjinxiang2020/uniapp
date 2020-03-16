<template>
  <view>
    <view class="coupon-list-window" :class="value === true ? 'on' : ''">
      <view class="title">
        优惠券
        <text class="iconfont icon-guanbi" @click="close"></text>
      </view>
      <view v-if="couponList.length > 0">
        <view class="coupon-list">
          <view
            class="item acea-row row-center-wrapper"
            v-for="coupon in couponList"
            :key="coupon.id"
            @click="click(coupon)"
          >
            <view class="money">
              ￥
              <text class="num">{{ coupon.couponPrice }}</text>
            </view>
            <view class="text">
              <view class="condition line1">{{ coupon.couponTitle }}</view>
              <view class="data acea-row row-between-wrapper">
                <view v-if="coupon.endTime === 0">不限时</view>
                <view v-else><data-format-t :data="coupon.addTime"></data-format-t> - <data-format-t :data="coupon.endTime"></data-format-t></view>
                <view
                  class="iconfont icon-xuanzhong1 font-color-red"
                  v-if="checked === coupon.id"
                ></view>
                <view class="iconfont icon-weixuanzhong" v-else></view>
              </view>
            </view>
          </view>
        </view>
        <view class="couponNo bg-color-red" @click="couponNo">不使用优惠券</view>
      </view>
      <view v-if="!couponList.length && loaded">
        <view class="pictrue">
          <image :src="$VUE_APP_RESOURCES_URL+'/images/noCoupon.png'" class="image" />
        </view>
      </view>
    </view>
    <view
      class="mask"
      @touchmove.prevent
      :hidden="value === false"
      @click="close"
    ></view>
  </view>
</template>
<style scoped>
.coupon-list-window .iconfont {
  font-size: 0.4rem;
}
.couponNo {
  font-size: 0.3rem;
  font-weight: bold;
  color: #fff;
  width: 6.9rem;
  height: 0.86rem;
  border-radius: 0.43rem;
  text-align: center;
  line-height: 0.86rem;
  margin: 0.6rem auto;
}
</style>
<script>
import { getOrderCoupon } from "@/api/order";
import DataFormatT from "@/components/DataFormatT";

export default {
  name: "CouponListWindow",
  components: {
    DataFormatT
  },
  props: {
    value: Boolean,
    checked: Number,
    price: {
      type: [Number, String],
      default: undefined
    }
  },
  data: function() {
    return {
      couponList: [],
      loaded: false
    };
  },
  watch: {
    price(n) {
      if (n === undefined || n == null) return;
      this.getCoupon();
    }
  },
  mounted: function() {},
  methods: {
    close: function() {
      this.$emit("input", false);
      this.$emit("close");
    },
    getCoupon() {
      getOrderCoupon(this.price).then(res => {
        this.couponList = res.data;
        this.loaded = true;
      });
    },
    click(coupon) {
      this.$emit("checked", coupon);
      this.$emit("input", false);
    },
    couponNo: function() {
      this.$emit("checked", null);
      this.$emit("input", false);
    }
  }
};
</script>
