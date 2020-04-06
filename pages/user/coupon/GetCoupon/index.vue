<template>
  <view ref="container">
    <view class="coupon-list" v-if="couponsList.length > 0">
      <view
        class="item acea-row row-center-wrapper"
        v-for="(item, couponsListIndex) in couponsList"
        :key="couponsListIndex"
      >
        <view class="money" :class="item.isUse ? 'moneyGray' : ''">
          ￥
          <text class="num">{{ item.couponPrice }}</text>
        </view>
        <view class="text">
          <view class="condition line1">购物满{{ item.useMinPrice }}元可用</view>
          <view class="data acea-row row-between-wrapper">
            <view v-if="item.endTime !== 0">
              <data-format-t :date="item.startTime"></data-format-t>-
              <data-format-t :date="item.endTime"></data-format-t>
            </view>
            <view v-else>不限时</view>
            <view class="bnt gray" v-if="item.isUse === true">已领取</view>
            <view class="bnt gray" v-else-if="item.isUse === 2">已领完</view>
            <view class="bnt bg-color-red" v-else @click="getCoupon(item.id, couponsListIndex)">立即领取</view>
          </view>
        </view>
      </view>
    </view>

    <Loading :loaded="loadend" :loading="loading"></Loading>
    <!--暂无优惠券-->
    <view class="noCommodity" v-if="couponsList.length === 0 && page > 1">
      <view class="noPictrue">
        <image :src="$VUE_APP_RESOURCES_URL+'/images/noCoupon.png'" class="image" />
      </view>
    </view>
  </view>
</template>
<script>
import { getCoupon, getCouponReceive } from "@/api/user";
import Loading from "@/components/Loading";
import DataFormatT from "@/components/DataFormatT";
export default {
  name: "getCoupon",
  components: {
    Loading,
    DataFormatT
  },
  props: {},
  data: function() {
    return {
      page: 1,
      limit: 10,
      couponsList: [],
      loading: false,
      loadend: false
    };
  },
  mounted: function() {
    this.getUseCoupons();
  },
  onReachBottom() {
    !this.loading && this.getUseCoupons();
  },
  methods: {
    getCoupon: function(id, index) {
      let that = this;
      let list = that.couponsList;
      getCouponReceive(id)
        .then(function(res) {
          list[index].isUse = true;
          uni.showToast({
            title: "领取成功",
            icon: "success",
            duration: 2000
          });
        })
        .catch(function(err) {
          uni.showToast({
            title: err.msg || err.response.data.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    getUseCoupons: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      let q = { page: that.page, limit: that.limit };
      getCoupon(q).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.couponsList.push.apply(that.couponsList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    }
  }
};
</script>
