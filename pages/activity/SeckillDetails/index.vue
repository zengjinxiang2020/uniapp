<template>
  <view :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']" v-show="domStatus">
    <product-con-swiper :imgUrls="imgUrls"></product-con-swiper>
    <view class="nav acea-row row-between-wrapper">
      <view class="money">
        ￥
        <text class="num" v-text="storeInfo.price"></text>
        <text class="y-money" v-text="'￥' + storeInfo.price"></text>
      </view>
      <view class="acea-row row-middle">
        <view class="times">
          <view>距秒杀结束仅剩</view>
          <count-down
            :is-day="false"
            :tip-text="''"
            :day-text="''"
            :hour-text="' : '"
            :minute-text="' : '"
            :second-text="''"
            :datatime="datatime"
          ></count-down>
        </view>
        <view class="iconfont icon-jiantou"></view>
      </view>
    </view>
    <view class="wrapperRush">
      <view class="introduce acea-row row-between">
        <view class="infor" v-text="storeInfo.title"></view>
        <view class="iconfont icon-fenxiang" @click="setPosterImageStatus"></view>
      </view>
      <view class="label acea-row row-middle">
        <view class="stock" v-text="'库存:' + storeInfo.stock + '件'"></view>
        <view v-text="'销量:' + storeInfo.sales + '件'"></view>
      </view>
    </view>
    <view class="product-intro">
      <view class="title">产品介绍</view>
      <view class="conter" v-html="storeInfo.description"></view>
    </view>
    <view style="height:100rpx;"></view>
    <view class="footerRush acea-row row-between-wrapper">
      <!-- <view
        class="customerSer acea-row row-center-wrapper row-column"
        @click="routerGo()"
      >
        <view class="iconfont icon-kefu"></view>
        <view>客服</view>
      </view> -->
      <view class="bnt bg-color-red" @click="tapBuy">立即购买</view>
    </view>
    <ProductWindow v-on:changeFun="changeFun" :attr="attr" :cartNum="cartNum"></ProductWindow>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
  </view>
</template>
<style scoped lang="less">
.noscroll {
  height: 100%;
  overflow: hidden;
}
</style>
<script>
import ProductConSwiper from "@/components/ProductConSwiper";
import CountDown from "@/components/CountDown";
import ProductWindow from "@/components/ProductWindow";
import StorePoster from "@/components/StorePoster";
import { getSeckillDetail } from "@/api/activity";
import { postCartAdd } from "@/api/store";
import { imageBase64 } from "@/api/public";
const NAME = "SeckillDetails";

export default {
  name: "SeckillDetails",
  components: {
    ProductConSwiper,
    CountDown,
    ProductWindow,
    StorePoster
  },
  props: {},
  data: function() {
    return {
      domStatus: false,
      posterData: {
        image: "",
        title: "",
        price: "",
        code: ""
      },
      posterImageStatus: false,
      action: "",
      imgUrls: [],
      storeInfo: [],
      replyCount: 0,
      reply: [],
      cartNum: 1,
      attr: {
        cartAttr: false,
        productSelect: {
          image: "",
          store_name: "",
          price: "",
          stock: "",
          unique: "",
          cart_num: 1
        }
      },
      datatime: 0
    };
  },
  watch: {
    $yroute: function(n) {
      var that = this;
      if (n.name === NAME) {
        that.mountedStart();
      }
    }
  },
  mounted: function() {
    this.mountedStart();
  },
  methods: {
    routerGo(item) {
      this.$yrouter.push({ path: '/pages/user/CustomerList/index' })
    },
    mountedStart: function() {
      var that = this;
      let id = that.$yroute.query.id;
      that.datatime = parseInt(that.$yroute.query.time);
      getSeckillDetail(id).then(res => {
        that.$set(that, "storeInfo", res.data.storeInfo);
        that.$set(that, "imgUrls", res.data.storeInfo.sliderImageArr);
        that.$set(that, "replyCount", res.data.replyCount);
        that.$set(that, "reply", res.data.reply);
        that.posterData.image = that.storeInfo.image_base;
        that.updateTitle();
        if (that.storeInfo.title.length > 30) {
          that.posterData.title = that.storeInfo.title.substring(0, 30) + "...";
        } else {
          that.posterData.title = that.storeInfo.title;
        }
        that.posterData.price = that.storeInfo.price;
        that.posterData.code = that.storeInfo.code_base;
        that.setProductSelect();
        that.domStatus = true;
      });
    },
    updateTitle() {
      // document.title = this.storeInfo.title || this.$yroute.meta.title;
    },
    setPosterImageStatus: function() {
      // var sTop = document.body || document.documentElement;
      // sTop.scrollTop = 0;
      this.posterImageStatus = !this.posterImageStatus;
    },
    //将父级向子集多次传送的函数合二为一；
    changeFun: function(opt) {
      if (typeof opt !== "object") opt = {};
      let action = opt.action || "";
      let value = opt.value === undefined ? "" : opt.value;
      this[action] && this[action](value);
    },
    changeattr: function(res) {
      var that = this;
      that.attr.cartAttr = res;
    },
    ChangeCartNum: function(res) {
      var that = this;
      if (res) {
        if (that.attr.productSelect.cart_num < that.storeInfo.stock) {
          that.attr.productSelect.cart_num++;
          this.cartNum++;
        }
      } else {
        if (that.attr.productSelect.cart_num > 1) {
          that.attr.productSelect.cart_num--;
          this.cartNum--;
        }
      }
    },
    setProductSelect: function() {
      var that = this;
      var attr = that.attr;
      attr.productSelect.image = that.storeInfo.image;
      attr.productSelect.store_name = that.storeInfo.title;
      attr.productSelect.price = that.storeInfo.price;
      attr.productSelect.stock = that.storeInfo.stock;
      attr.cartAttr = false;
      that.$set(that, "attr", attr);
    },
    selecAttrTap: function() {
      this.cartAttr = true;
    },
    tapBuy: function() {
      var that = this;
      if (that.attr.cartAttr == false) {
        that.attr.cartAttr = !this.attr.attrcartAttr;
      } else {
        console.log(that.storeInfo);
        var data = {};
        data.productId = that.storeInfo.productId;
        data.cartNum = that.attr.productSelect.cart_num;
        data.uniqueId = that.attr.productSelect.unique;
        data.secKillId = that.storeInfo.id;
        data.new = 1;
        postCartAdd(data)
          .then(res => {
            console.log(res);
            that.$yrouter.push({
              path: "/pages/order/OrderSubmission/index",
              query: { id: res.data.cartId }
            });
          })
          .catch(err => {
            uni.showToast({
            	title: err.msg || err.response.data.msg,
            	icon: 'none',
            	duration: 2000
            });
          });
      }
    }
  }
};
</script>
<style scoped lang="less">
.product-con .nav {
  padding: 0 0.2*100rpx;
}
</style>
