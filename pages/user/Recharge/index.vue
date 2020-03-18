<template>
  <view>
    <view class="recharge">
      <view class="nav acea-row row-around row-middle">
        <view
          class="item"
          :class="active === navRechargeIndex ? 'on' : ''"
          v-for="(item, navRechargeIndex) in navRecharge"
          :key="navRechargeIndex"
          @click="navRecharges(navRechargeIndex)"
        >{{ item }}</view>
      </view>
      <view class="info-wrapper">
        <view class="money">
          <text>￥</text>
          <input type="number" placeholder="0.00" v-model="money" />
        </view>
        <view class="tips" v-if="!active">
          提示：当前余额为
          <text>￥{{ now_money || 0 }}</text>
        </view>
        <view class="pay-btn bg-color-red" @click="recharge">{{ active ? "立即转入" : "立即充值" }}</view>
      </view>
    </view>
  </view>
</template>
<script>
import { mapGetters } from "vuex";
import { weapppay } from "@/libs/wechat";
import { isWeixin } from "@/utils";
import { rechargeWechat } from "@/api/user";
import { add, sub } from "@/utils/bc";

export default {
  name: "Recharge",
  components: {},
  props: {},
  data: function() {
    return {
      navRecharge: ["账户充值"],
      active: 0,
      payType: ["weixin"],
      from: isWeixin() ? "weixin" : "weixinh5",
      money: "",
      now_money: ""
    };
  },
  computed: mapGetters(["userInfo"]),
  mounted: function() {
    this.now_money = this.userInfo.now_money;
  },
  methods: {
    navRecharges: function(index) {
      this.active = index;
    },
    recharge: function() {
      let that = this,
        price = Number(this.money);
      if (that.active) {
        if (price === 0) {
          uni.showToast({
            title: "请输入您要转入的金额",
            icon: "none",
            duration: 2000
          });
          return;
        } else if (price < 0.01) {
          uni.showToast({
            title: "转入金额不能低于0.01",
            icon: "none",
            duration: 2000
          });
          return;
        }

        uni.showModal({
          title: "转入余额",
          content: "转入余额无法在转出，请确认转入?",
          success: function(res) {
            if (res.confirm) {
              rechargeWechat({ price: price, from: that.from, type: 1 })
                .then(res => {
                  that.now_money = add(
                    price,
                    parseInt(that.userInfo.now_money)
                  );
                  that.userInfo.brokerage_price = sub(
                    that.userInfo.brokerage_price,
                    price
                  );
                  that.money = "";
                  uni.showToast({
                    title: res.msg,
                    icon: "none",
                    duration: 2000
                  });
                })
                .catch(err => {
                  uni.showToast({
                    title: err.msg || err.response.data.msg,
                    icon: "none",
                    duration: 2000
                  });
                });
            } else if (res.cancel) {
              uni.showToast({
                title: "已取消",
                icon: "none",
                duration: 2000
              });
              return;
            }
          }
        });
      } else {
        if (price === 0) {
          uni.showToast({
            title: "请输入您要充值的金额",
            icon: "none",
            duration: 2000
          });
          return;
        } else if (price < 0.01) {
          uni.showToast({
            title: "充值金额不能低于0.01",
            icon: "none",
            duration: 2000
          });
          return;
        }
        rechargeWechat({ price: price, from: that.from })
          .then(res => {
            var data = res.data;
            if (data.type == "weixinh5") {
              location.replace(data.data.mweb_url);
              uni.showModal({
                title: "提示",
                content: "充值余额",
                confirmText: "已充值",
                cancelText: "查看余额",
                success: function(res) {
                  if (res.confirm) {
                    that.$yrouter.replace({
                      path: "/user/account"
                    });
                  } else if (res.cancel) {
                    that.$yrouter.replace({
                      path: "/user/account"
                    });
                  }
                }
              });
            } else {
              weappPay(data.data)
                .then(res => {
                  that.now_money = add(
                    price,
                    parseInt(that.userInfo.now_money)
                  );
                  uni.showToast({
                    title: "支付成功",
                    icon: "success",
                    duration: 2000
                  });
                })
                .catch(function() {
                  uni.showToast({
                    title: "支付失败",
                    icon: "none",
                    duration: 2000
                  });
                });
            }
          })
          .catch(err => {
            uni.showToast({
              title: err.msg || err.response.data.msg,
              icon: "none",
              duration: 2000
            });
          });
      }
    }
  }
};
</script>
<style scoped>
#iframe {
  display: none;
}
.recharge {
  width: 7.03rem;
  padding: 0.5rem 0.63rem 0.45rem;
  background-color: #fff;
  margin: 0.2rem auto 0 auto;
  border-radius: 0.1rem;
}
.recharge .nav {
  height: 0.75rem;
  line-height: 0.75rem;
  padding: 0 1rem;
}
.recharge .nav .item {
  font-size: 0.3rem;
  color: #333;
}
.recharge .nav .item.on {
  font-weight: bold;
  border-bottom: 0.04rem solid #e83323;
}
.recharge .info-wrapper {
  text-align: center;
}
.recharge .info-wrapper .money {
  margin-top: 0.6rem;
  padding-bottom: 0.2rem;
  border-bottom: 1px dashed #ddd;
}
.recharge .info-wrapper .money text {
  font-size: 0.56rem;
  color: #333;
  font-weight: bold;
}
.recharge .info-wrapper .money input {
  display: inline-block;
  width: 3rem;
  font-size: 0.84rem;
  text-align: center;
  color: #282828;
  font-weight: bold;
  padding-right: 0.7rem;
}
.recharge .info-wrapper .money input::placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input::-webkit-input-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input:-moz-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input::-moz-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .money input:-ms-input-placeholder {
  color: #ddd;
}
.recharge .info-wrapper .tips {
  font-size: 0.26rem;
  color: #888;
  margin: 0.25rem auto 0 auto;
  line-height: 1.5;
  padding: 0 0.3rem;
}
.recharge .info-wrapper .tips text {
  color: #ef4a49;
}
.recharge .info-wrapper .pay-btn {
  display: block;
  width: 5.5rem;
  height: 0.86rem;
  margin: 0.5rem auto 0 auto;
  line-height: 0.86rem;
  text-align: center;
  color: #fff;
  border-radius: 0.5rem;
  font-size: 0.3rem;
  font-weight: bold;
}
</style>
