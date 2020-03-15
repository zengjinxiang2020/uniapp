<template>
  <div class="my-account">
    <div class="wrapper">
      <div class="header">
        <div class="headerCon">
          <div class="account acea-row row-top row-between">
            <div class="assets">
              <div>总资产(元)</div>
              <div class="money">{{ now_money }}</div>
            </div>
          </div>
          <div class="cumulative acea-row row-top">
            <div class="item">
              <div>累计消费(元)</div>
              <div class="money">{{ orderStatusSum }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="nav acea-row row-middle">
        <div class="item" @click="$yrouter.push({path:'/pages/user/UserBill/index',query:{id:0}})">
          <div class="pictrue">
            <img :src="$VUE_APP_RESOURCES_URL+'/images/record1.png'" />
          </div>
          <div>账单记录</div>
        </div>
        <div class="item" @click="$yrouter.push({path:'/pages/user/UserBill/index',query:{id:1}})">
          <div class="pictrue">
            <img :src="$VUE_APP_RESOURCES_URL+'/images/record2.png'" />
          </div>
          <div>消费记录</div>
        </div>
      </div>
      <div class="advert acea-row row-between-wrapper"></div>
    </div>
    <Recommend></Recommend>
  </div>
</template>
<script>
import Recommend from "@/components/Recommend";
import { getActivityStatus, getBalance } from "@/api/user";
export default {
  name: "UserAccount",
  components: {
    Recommend
  },
  props: {},
  data: function() {
    return {
      now_money: 0,
      orderStatusSum: 0,
      recharge: 0,
      activity: {
        is_bargin: false,
        is_pink: false,
        is_seckill: false
      }
    };
  },
  mounted: function() {
    this.getIndex();
    this.getActivity();
  },
  methods: {
    getIndex: function() {
      let that = this;
      getBalance().then(
        res => {
          that.now_money = res.data.now_money;
          that.orderStatusSum = res.data.orderStatusSum;
          that.recharge = res.data.recharge;
        },
        err => {
          that.$dialog.message(err.msg);
        }
      );
    },
    getActivity: function() {
      let that = this;
      getActivityStatus().then(
        res => {
          that.activity.is_bargin = res.data.is_bargin;
          that.activity.is_pink = res.data.is_pink;
          that.activity.is_seckill = res.data.is_seckill;
        },
        error => {
          that.$dialog.message(error.msg);
        }
      );
    }
  }
};
</script>
