<template>
  <div ref="container">
    <div class="coupon-list" v-if="couponsList.length > 0">
      <div
        class="item acea-row row-center-wrapper"
        v-for="(item, couponsListIndex) in couponsList"
        :key="couponsListIndex"
      >
        <div class="money" :class="item._type === 0 ? 'moneyGray' : ''">
          ￥<span class="num">{{ item.couponPrice }}</span>
        </div>
        <div class="text">
          <div class="condition line1">{{ item.couponTitle }}</div>
          <div class="data acea-row row-between-wrapper">
            <div v-if="item.endTime === 0">不限时</div>
            <div v-else><data-format-t :data="item.addTime"></data-format-t> - <data-format-t :data="item.endTime"></data-format-t></div>
            <div class="bnt gray" v-if="item._type === 0">{{ item._msg }}</div>
            <div class="bnt bg-color-red" v-else>{{ item._msg }}</div>
          </div>
        </div>
      </div>
    </div>
    <!--暂无优惠券-->
    <div
      class="noCommodity"
      v-if="couponsList.length === 0 && loading === true"
    >
      <div class="noPictrue">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/noCoupon.png'" class="image" />
      </div>
    </div>
  </div>
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
