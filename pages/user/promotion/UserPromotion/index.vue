<template>
  <div class="my-promotion">
    <div class="header">
      <div class="name acea-row row-center-wrapper">
        <div>当前佣金</div>
        <div class="record" @click="$yrouter.push('/pages/user/promotion/CashRecord/index')">
          提现记录
          <span class="iconfont icon-xiangyou"></span>
        </div>
      </div>
      <div class="num">{{ Info.commissionCount }}</div>
      <div class="profit acea-row row-between-wrapper">
        <div class="item">
          <div>昨日收益</div>
          <div class="money">{{ Info.lastDayCount }}</div>
        </div>
        <div class="item">
          <div>累积已提</div>
          <div class="money">{{ Info.extractCount }}</div>
        </div>
      </div>
    </div>
    <div class="bnt bg-color-red" @click="toCash">立即提现</div>
    <div class="list acea-row row-between-wrapper">
      <div
        class="item acea-row row-center-wrapper row-column"
        @click="$yrouter.push('/pages/user/promotion/Poster/index')"
      >
        <span class="iconfont icon-erweima"></span>
        <div>推广名片</div>
      </div>
      <div
        class="item acea-row row-center-wrapper row-column"
        @click="$yrouter.push('/pages/user/promotion/PromoterList/index')"
      >
        <span class="iconfont icon-tongji"></span>
        <div>推广人统计</div>
      </div>
      <div
        class="item acea-row row-center-wrapper row-column"
        @click="$yrouter.push('/pages/user/promotion/CommissionDetails/index')"
      >
        <span class="iconfont icon-qiandai"></span>
        <div>佣金明细</div>
      </div>
      <div
        class="item acea-row row-center-wrapper row-column"
        @click="$yrouter.push('/pages/user/promotion/PromoterOrder/index')"
      >
        <span class="iconfont icon-dingdan"></span>
        <div>推广人订单</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getSpreadInfo } from "@/api/user";

export default {
  name: "UserPromotion",
  components: {},
  props: {},
  data: function() {
    return {
      Info: {
        lastDayCount: 0,
        extractCount: 0,
        commissionCount: 0
      }
    };
  },
  mounted: function() {
    this.getInfo();
  },
  methods: {
    getInfo: function() {
      let that = this;
      getSpreadInfo().then(
        res => {
          that.Info = res.data;
        },
        function(err) {
          that.$dialog.message(err.msg);
        }
      );
    },
    toCash: function() {
      this.$yrouter.push({ path: "/pages/user/promotion/UserCash/main" });
    }
  }
};
</script>


<style>

</style>
