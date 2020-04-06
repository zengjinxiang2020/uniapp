<template>
  <view ref="container">
    <view class="coupon-list" v-if="couponsList.length > 0">
      <view
        class="item acea-row row-center-wrapper"
        v-for="(item, couponsListIndex) in couponsList"
        :key="couponsListIndex"
      >
        <view class="money" :class="item._type === 0 ? 'moneyGray' : ''">
          ￥<text class="num">{{ item.couponPrice }}</text>
        </view>
        <view class="text">
          <view class="condition line1">{{ item.couponTitle }}</view>
          <view class="data acea-row row-between-wrapper">
            <view v-if="item.endTime === 0">不限时</view>
            <view v-else><data-format-t :date="item.addTime"></data-format-t> - <data-format-t :date="item.endTime"></data-format-t></view>
            <view class="bnt gray" v-if="item._type === 0">{{ item._msg }}</view>
            <view class="bnt bg-color-red" v-else>{{ item._msg }}</view>
          </view>
        </view>
      </view>
    </view>
    <!--暂无优惠券-->
    <view
      class="noCommodity"
      v-if="couponsList.length === 0 && loading === true"
    >
      <view class="noPictrue">
        <image :src="$VUE_APP_RESOURCES_URL+'/images/noCoupon.png'" class="image" />
      </view>
    </view>
  </view>
</template>
<script>
import { getCouponsUser } from "@/api/user";
import DataFormatT from "@/components/DataFormatT";

const NAME = "UserCoupon";

export default {
  name: "UserCoupon",
  components: {
    DataFormatT
  },
  props: {},
  data: function() {
    return {
      couponsList: [],
      loading: false
    };
  },
  watch: {
    $yroute: function(n) {
      var that = this;
      if (n.name === NAME) {
        that.getUseCoupons();
      }
    }
  },
  mounted: function() {
    this.getUseCoupons();
  },
  methods: {
    getUseCoupons: function() {
      let that = this,
        type = 0;
      getCouponsUser(type).then(res => {
        that.couponsList = res.data;
        that.loading = true;
      });
    }
  }
};
</script>
