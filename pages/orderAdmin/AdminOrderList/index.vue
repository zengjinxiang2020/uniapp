<template>
  <div class="pos-order-list" ref="container">
    <div class="nav acea-row row-around row-middle">
      <div class="item" :class="where.status == 0 ? 'on' : ''" @click="changeStatus(0)">待付款</div>
      <div class="item" :class="where.status == 1 ? 'on' : ''" @click="changeStatus(1)">待发货</div>
      <div class="item" :class="where.status == 2 ? 'on' : ''" @click="changeStatus(2)">待收货</div>
      <div class="item" :class="where.status == 3 ? 'on' : ''" @click="changeStatus(3)">待评价</div>
      <div class="item" :class="where.status == 4 ? 'on' : ''" @click="changeStatus(4)">已完成</div>
      <div class="item" :class="where.status == -3 ? 'on' : ''" @click="changeStatus(-3)">退款</div>
    </div>
    <div class="list">
      <div class="item" v-for="(item, listIndex) in list" :key="listIndex">
        <div class="order-num acea-row row-middle" @click="toDetail(item)">
          <span>订单号：{{ item.orderId }}</span>
          <span class="time">
            <span>下单时间：</span>
            <data-format :data="item.addTime"></data-format>
          </span>
        </div>
        <div class="pos-order-goods" v-for="(val, key) in item.cartInfo" :key="key">
          <div class="goods acea-row row-between-wrapper" @click="toDetail(item)">
            <div class="picTxt acea-row row-between-wrapper">
              <div class="pictrue">
                <img :src="val.productInfo.image" />
              </div>
              <div class="text acea-row row-between row-column">
                <div class="info line2">{{ val.productInfo.storeName }}</div>
                <div class="attr" v-if="val.productInfo.suk">{{ val.productInfo.suk }}</div>
              </div>
            </div>
            <div class="money">
              <div class="x-money">￥{{ val.productInfo.price }}</div>
              <div class="num">x{{ val.cartNum }}</div>
              <div class="y-money">￥{{ val.productInfo.otPrice }}</div>
            </div>
          </div>
        </div>
        <div class="public-total">
          共{{ item.totalNum }}件商品，应支付
          <span class="money">￥{{ item.payPrice }}</span>
          ( 邮费 ¥{{
          item.totalPostage
          }}
          )
        </div>
        <div class="operation acea-row row-between-wrapper">
          <div class="more">
            <!--            <div class="iconfont icon-gengduo" @click="more(index)"></div>-->
            <!--            <div class="order" v-show="current === index">-->
            <!--              <div class="items">-->
            <!--                {{ where.status > 0 ? "删除" : "取消" }}订单-->
            <!--              </div>-->
            <!--              <div class="arrow"></div>-->
            <!--            </div>-->
          </div>
          <div class="acea-row row-middle">
            <div class="bnt" @click="modify(item, 0)" v-if="where.status == 0">一键改价</div>
            <div
              class="bnt"
              @click="modify(item, 0)"
              v-if="where.status == -3 && item.refundStatus === 1"
            >立即退款</div>
            <div
              class="bnt cancel"
              v-if="item.pay_type === 'offline' && item.paid === 0"
              @click="offlinePay(item)"
            >确认付款</div>
            <div class="bnt" v-if="where.status == 1" @click="goGoodsDeliver(item)">去发货</div>
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loaded" :loading="loading"></Loading>
    <PriceChange
      :change="change"
      :orderInfo="orderInfo"
      v-on:closechange="changeclose($event)"
      v-on:savePrice="savePrice"
      :status="status"
    ></PriceChange>
  </div>
</template>
<script>
import PriceChange from "@/components/PriceChange";
import Loading from "@/components/Loading";
import DataFormat from "@/components/DataFormat";
import {
  getAdminOrderList,
  setAdminOrderPrice,
  setAdminOrderRemark,
  setOfflinePay,
  setOrderRefund
} from "@/api/admin";
import { required, num } from "@/utils/validate";
import { validatorDefaultCatch } from "@/utils/dialog";
export default {
  name: "AdminOrderList",
  components: {
    PriceChange,
    Loading,
    DataFormat
  },
  props: {},
  data: function() {
    return {
      current: "",
      change: false,
      types: 0,
      where: {
        page: 1,
        limit: 5,
        status: 0
      },
      list: [],
      loaded: false,
      loading: false,
      orderInfo: {},
      status: ""
    };
  },
  watch: {
    "$yroute.query.types": function(newVal) {
      let that = this;
      if (newVal != undefined) {
        that.where.status = newVal;
        that.init();
      }
    },
    types: function() {
      this.getIndex();
    }
  },
  mounted: function() {
    let that = this;
    that.where.status = that.$yroute.query.types;
    that.current = "";
    that.getIndex();
  },
  onReachBottom() {
    !that.loading && that.getIndex();
  },
  methods: {
    goGoodsDeliver(item) {
      this.$yrouter.push({
        path: "/pages/orderAdmin/GoodsDeliver/index",
        query: { id: item.orderId }
      });
    },
    more: function(index) {
      if (this.current === index) this.current = "";
      else this.current = index;
    },
    modify: function(item, status) {
      this.change = true;
      this.orderInfo = item;
      this.status = status;
    },
    changeclose: function(msg) {
      this.change = msg;
    },
    async savePrice(opt) {
      let that = this,
        data = {},
        price = opt.price.toString(),
        refund_price = opt.refund_price.toString(),
        refund_status = that.orderInfo.refundStatus,
        remark = opt.remark;
      data.orderId = that.orderInfo.orderId;
      if (that.status == 0 && refund_status === 0) {
        try {
          await this.$validator({
            price: [
              required(required.message("金额")),
              num(num.message("金额"))
            ]
          }).validate({ price });
        } catch (e) {
          return validatorDefaultCatch(e);
        }
        data.price = price;
        setAdminOrderPrice(data).then(
          function() {
            that.change = false;
            uni.showToast({
              title: "改价成功",
              icon: "success",
              duration: 2000
            });
            that.init();
          },
          function() {
            that.change = false;
            uni.showToast({
              title: "改价失败",
              icon: "none",
              duration: 2000
            });
          }
        );
      } else if (that.status == 0 && refund_status === 1) {
        try {
          await this.$validator({
            refund_price: [
              required(required.message("金额")),
              num(num.message("金额"))
            ]
          }).validate({ refund_price });
        } catch (e) {
          return validatorDefaultCatch(e);
        }
        data.price = refund_price;
        data.type = opt.type;
        setOrderRefund(data).then(
          res => {
            that.change = false;
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
            that.init();
          },
          err => {
            that.change = false;
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        );
      } else {
        try {
          await this.$validator({
            remark: [required(required.message("备注"))]
          }).validate({ remark });
        } catch (e) {
          return validatorDefaultCatch(e);
        }
        data.remark = remark;
        setAdminOrderRemark(data).then(
          res => {
            that.change = false;
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
            that.init();
          },
          err => {
            that.change = false;
            uni.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            });
          }
        );
      }
    },
    init: function() {
      this.list = [];
      this.where.page = 1;
      this.loaded = false;
      this.loading = false;
      this.getIndex();
      this.current = "";
    },
    getIndex: function() {
      let that = this;
      if (that.loading || that.loaded) return;
      that.loading = true;
      getAdminOrderList(that.where).then(
        res => {
          that.loading = false;
          that.loaded = res.data.length < that.where.limit;
          that.list.push.apply(that.list, res.data);
          that.where.page = that.where.page + 1;
        },
        err => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        }
      );
    },
    changeStatus: function(val) {
      if (this.where.status != val) {
        this.where.status = val;
        this.init();
      }
    },
    toDetail: function(item) {
      this.$yrouter.push({
        path: "/pages/orderAdmin/AdminOrder/index",
        query: { oid: item.orderId }
      });
    },
    offlinePay: function(item) {
      setOfflinePay({ order_id: item.order_id }).then(
        res => {
          this.$uni.showToast({ title: res.msg, icon: "none", duration: 2000 });
          this.init();
        },
        error => {
          this.$dialog.error(error.msg);
        }
      );
    }
  }
};
</script>

<style>
</style>
