<template>
  <view :class="[posterImageStatus ? 'noscroll product-con' : 'product-con']" v-show="domStatus">
    <product-con-swiper :imgUrls="imgUrls"></product-con-swiper>
    <view class="wrapper">
      <view class="share acea-row row-between row-bottom">
        <view class="money font-color-red">
          ￥
          <text class="num" v-text="storeInfo.price"></text>
          <text class="y-money" v-text="'￥' + storeInfo.productPrice"></text>
        </view>
      </view>
      <view class="introduce" v-text="storeInfo.title"></view>
      <view class="label acea-row row-between-wrapper">
        <view v-text="'类型:' + storeInfo.people + '人团'"></view>
        <view v-text="'库存:' + storeInfo.stock + storeInfo.unitName"></view>
        <view v-text="'已拼:' + storeInfo.sales + storeInfo.unitName"></view>
      </view>
    </view>
    <view class="notice acea-row row-middle">
      <view class="num font-color-red">
        <text class="iconfont icon-laba"></text>
        已拼{{ storeInfo.sales
        }}{{ storeInfo.unitName }}
        <text class="line">|</text>
      </view>
      <view class="swiper-no-swiping swiper">
        <swiper class="swiper-wrapper" :options="swiperTip" :autoplay="true" :interval="3000">
          <block v-for="(item, itemNewIndex) in itemNew" :key="itemNewIndex">
            <swiper-item>
              <view class="line1">{{ item }}</view>
            </swiper-item>
          </block>
        </swiper>
      </view>
    </view>
    <view class="assemble">
      <view v-for="(item, groupListindex) in groupList" :key="groupListindex">
        <view class="item acea-row row-between-wrapper" v-if="groupListindex < groupListCount">
          <view class="pictxt acea-row row-between-wrapper">
            <view class="pictrue">
              <image :src="item.avatar" class="image" />
            </view>
            <view class="text line1" v-text="item.nickname"></view>
          </view>
          <view class="right acea-row row-middle">
            <view>
              <view class="lack">
                <text>还差</text>
                <text class="font-color-red" v-text="item.count"></text>
                <text>人成团</text>
              </view>
              <count-down
                :is-day="false"
                :tip-text="'剩余 '"
                :day-text="''"
                :hour-text="':'"
                :minute-text="':'"
                :second-text="''"
                :datatime="item.stopTime"
              ></count-down>
            </view>
            <view class="spellBnt" @click="groupRule(item.id)">
              去拼单
              <text class="iconfont icon-jiantou"></text>
            </view>
          </view>
        </view>
      </view>
      <view class="more" v-if="groupList.length > groupListCount" @click="setGroupListCount">
        查看更多
        <text class="iconfont icon-xiangxia"></text>
      </view>
    </view>
    <view class="playWay">
      <view class="title acea-row row-between-wrapper">
        <view>拼团玩法</view>
      </view>
      <view class="way acea-row row-middle">
        <view class="item">
          <text class="num">①</text>开团/参团
        </view>
        <view class="iconfont icon-arrow"></view>
        <view class="item">
          <text class="num">②</text>邀请好友
        </view>
        <view class="iconfont icon-arrow"></view>
        <view class="item">
          <view>
            <text class="num">③</text>满员发货
          </view>
        </view>
      </view>
    </view>
    <view class="userEvaluation">
      <view class="title acea-row row-between-wrapper">
        <view v-text="'用户评价(' + replyCount + ')'"></view>
        <view class="praise" @click="goReply">
          <text class="font-color-red" v-text="replyChance + '%'"></text>好评率
          <text class="iconfont icon-jiantou"></text>
        </view>
      </view>
      <UserEvaluation :reply="reply"></UserEvaluation>
    </view>
    <view class="product-intro">
      <view class="title">产品介绍</view>
      <view class="conter" v-html="storeInfo.description"></view>
    </view>
    <view style="height:100rpx;"></view>
    <view class="footer-group acea-row row-between-wrapper">
      <view class="customerSer acea-row row-center-wrapper row-column">
        <view class="iconfont icon-kefu"></view>
        <view>客服</view>
      </view>
      <view class="bnt bg-color-violet" @click="openAlone">单独购买</view>
      <view class="bnt bg-color-red" @click="openTeam">立即开团</view>
    </view>
    <ProductWindow v-on:changeFun="changeFun" :attr="attr" :cartNum="cartNum"></ProductWindow>
    <StorePoster
      v-on:setPosterImageStatus="setPosterImageStatus"
      :posterImageStatus="posterImageStatus"
      :posterData="posterData"
    ></StorePoster>
  </view>
</template>
<style scoped>
.noscroll {
  height: 100%;
  overflow: hidden;
}
.product-con .footer-group .bnt {
  width: 43%;
}
.product-con .footer-group .bnt.bg-color-violet {
  background-color: #fa8013;
}
</style>

<script>
// import { swiper, swiperSlide } from "vue-awesome-swiper";

import ProductConSwiper from "@/components/ProductConSwiper";
import CountDown from "@/components/CountDown";
import UserEvaluation from "@/components/UserEvaluation";
import ProductWindow from "@/components/ProductWindow";
import StorePoster from "@/components/StorePoster";
import { getCombinationDetail } from "@/api/activity";
import { postCartAdd } from "@/api/store";
import { imageBase64 } from "@/api/public";
const NAME = "GroupDetails";

export default {
  name: "GroupDetails",
  components: {
    ProductConSwiper,
    CountDown,
    UserEvaluation,
    // swiper,
    // swiperSlide,
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
      reply: [],
      replyCount: 0,
      replyChance: 0,
      imgUrls: [],
      storeInfo: {},
      itemNew: {},
      groupListCount: 2,
      groupList: {},
      swiperTip: {
        direction: "vertical",
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
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
      cartNum: 1
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
    openAlone: function() {
      this.$yrouter.replace({ path: "/detail/" + this.storeInfo.productId });
    },
    mountedStart: function() {
      var that = this;
      let id = that.$yroute.query.id;
      getCombinationDetail(id).then(res => {
        that.$set(that, "storeInfo", res.data.storeInfo);
        that.$set(that, "imgUrls", res.data.storeInfo.sliderImageArr);
        that.$set(that, "itemNew", res.data.pinkOkList);
        that.$set(that, "groupList", res.data.pink);
        that.$set(that, "reply", [res.data.reply]);
        that.$set(that, "replyCount", res.data.replyCount);
        that.$set(that, "replyChance", res.data.replyChance);
        that.setProductSelect();
        that.posterData.image = that.storeInfo.image;
        if (that.storeInfo.title.length > 30) {
          that.posterData.title = that.storeInfo.title.substring(0, 30) + "...";
        } else {
          that.posterData.title = that.storeInfo.title;
        }
        that.posterData.price = that.storeInfo.price;
        that.posterData.code = that.storeInfo.code_base;
        that.domStatus = true;
        //that.getImageBase64();
      });
    },
    getImageBase64: function() {
      let that = this;
      imageBase64(this.posterData.image, that.posterData.code).then(res => {
        that.posterData.image = res.data.image;
        that.posterData.code = res.data.code;
      });
    },
    setPosterImageStatus: function() {
      // var sTop = document.body || document.documentElement;
      // sTop.scrollTop = 0;
      this.posterImageStatus = !this.posterImageStatus;
    },
    groupRule: function(id) {
      var that = this;
      that.$yrouter.push({
        path: "/pages/activity/GroupRule/index",
        query: { id }
      });
    },
    goReply: function() {
      var that = this;
      that.$yrouter.push({
        path: "/pages/shop/EvaluateList/index",
        query: { id: that.storeInfo.product_id }
      });
    },
    setGroupListCount: function() {
      this.groupListCount = this.groupListCount + 2;
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
      that.attr.productSelect.cart_num = 1;
      that.cartNum = 1;
      uni.showToast({
        title: "每人每次限购1" + that.storeInfo.unitName,
        icon: "none",
        duration: 2000
      });
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
    openTeam: function() {
      var that = this;
      if (that.attr.cartAttr == false) {
        that.attr.cartAttr = !this.attr.cartAttr;
      } else {
        var data = {};
        data.productId = that.storeInfo.productId;
        data.cartNum = that.attr.productSelect.cart_num;
        data.uniqueId = that.attr.productSelect.unique;
        data.combinationId = that.storeInfo.id;
        data.new = 1;
        postCartAdd(data)
          .then(res => {
            that.$yrouter.push({
              path: "/pages/order/OrderSubmission/index",
              query: { id: res.data.cartId }
            });
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
.product-con .wrapper {
  padding-bottom: 0.26rem;
}
</style>
