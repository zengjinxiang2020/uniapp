<template>
  <div class="index">
    <div class="header acea-row row-center-wrapper">
      <div @click="$yrouter.push('/pages/shop/GoodSearch/index')" class="search acea-row row-middle">
        <span class="iconfont icon-xiazai5"></span>搜索商品
      </div>
    </div>
    <div class="slider-banner banner">
      <swiper indicatorDots="true" v-if="banner.length > 0">
        <block v-for="(item, bannerIndex) in banner" :key="bannerIndex">
          <swiper-item>
            <div @click="item.url?$yrouter.push('/'+item.url) : ''" class="swiper-item">
              <img :src="item.pic" />
            </div>
          </swiper-item>
        </block>
      </swiper>
    </div>
    <div class="news acea-row row-between-wrapper">
      <div class="pictrue">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/news.png'" />
      </div>
      <div class="swiper-no-swiping new-banner">
        <swiper
          class="swiper-wrapper"
          v-if="roll.length > 0"
          :indicator-dots="false"
          autoplay
          circular
          vertical
        >
          <block v-for="(item, rollIndex) in roll" :key="rollIndex">
            <swiper-item class="swiper-slide">
              <div
                @click="item.wxapp_url?$yrouter.push(item.wxapp_url) : ''"
                class="swiper-item acea-row row-between-wrapper"
              >
                <div class="text acea-row row-between-wrapper">
                  <div class="label" v-if="item.show === '是'">最新</div>
                  <div class="newsTitle line1">{{ item.info }}</div>
                </div>
                <div class="iconfont icon-xiangyou"></div>
              </div>
            </swiper-item>
          </block>
        </swiper>
      </div>
    </div>
    <div class="nav acea-row">
      <div
        @click="$yrouter.push(item.wxapp_url)"
        class="item"
        v-for="(item, menusIndex) in menus"
        :key="menusIndex"
      >
        <div class="pictrue">
          <img :src="item.pic" />
        </div>
        <div>{{ item.name }}</div>
      </div>
    </div>
    <div class="wrapper hot" v-if="bastList.length > 0">
      <img class="bg" src="../../assets/images/index-bg.png" mode="widthFix" />
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">热门榜单</div>
        </div>
        <div
          @click="$yrouter.push({ path: '/pages/shop/HotNewGoods/index',query:{type:2} })"
          class="more"
        >
          更多
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <div class="newProducts">
        <scroll-view scroll-y="false" scroll-x="true">
          <div class="newProductsScroll">
            <div
              @click="$yrouter.push({ path: '/pages/shop/GoodsCon/index',query:{id:item.id} })"
              class="newProductsItem"
              v-for="(item, likeInfoIndex) in likeInfo"
              :key="likeInfoIndex"
            >
              <div class="img-box">
                <img :src="item.image"  />
              </div>
              <div class="pro-info line1">{{ item.storeName }}</div>
              <div class="money font-color-red">￥{{ item.price }}</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="wrapper" v-if="bastList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">精品推荐</div>
        </div>
        <div
          @click="$yrouter.push({ path: '/pages/shop/HotNewGoods/index',query:{type:1} })"
          class="more"
        >
          更多
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <Good-list :good-list="bastList" :is-sort="false"></Good-list>
    </div>

    <div class="wrapper" v-if="firstList.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">
            首发新品
            <span class="new font-color-red">NEW~</span>
          </div>
        </div>
        <div
          @click="$yrouter.push({ path: '/pages/shop/HotNewGoods/index',query:{type:3} })"
          class="more"
        >
          更多
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
      <div class="newProducts">
        <scroll-view scroll-y="false" scroll-x="true">
          <div class="newProductsScroll">
            <div
              @click="$yrouter.push({ path: '/pages/shop/GoodsCon/index',query:{id:item.id} })"
              class="newProductsItem"
              v-for="(item, firstListIndex) in firstList"
              :key="firstListIndex"
            >
              <div class="img-box">
                <img :src="item.image"  />
              </div>
              <div class="pro-info line1">{{ item.storeName }}</div>
              <div class="money font-color-red">￥{{ item.price }}</div>
            </div>
          </div>
        </scroll-view>
      </div>
    </div>
    <div class="wrapper" v-if="benefit.length > 0">
      <div class="title acea-row row-between-wrapper">
        <div class="text">
          <div class="name line1">促销单品</div>
        </div>
        <div @click="$yrouter.push('/pages/shop/GoodsPromotion/index')" class="more">
          更多
          <span class="iconfont icon-jiantou"></span>
        </div>
      </div>
    </div>
    <Promotion-good :benefit="benefit"></Promotion-good>
    <Coupon-window
      :coupon-list="couponList"
      v-if="showCoupon"
      @checked="couponClose"
      @close="couponClose"
    ></Coupon-window>
    <div style="height:3rem;"></div>
  </div>
</template>
<script>
// import { swiper, swiperSlide } from "vue-awesome-swiper";

import GoodList from "@/components/GoodList";
import PromotionGood from "@/components/PromotionGood";
import CouponWindow from "@/components/CouponWindow";
import { getHomeData, getShare } from "@/api/public";
import cookie from "@/utils/store/cookie";
import { isWeixin } from "@/utils/index";

const HAS_COUPON_WINDOW = "has_coupon_window";

export default {
  name: "Index",
  components: {
    // swiper,
    // swiperSlide,
    GoodList,
    PromotionGood,
    CouponWindow
  },
  props: {},
  data: function() {
    return {
      showCoupon: false,
      logoUrl: "",
      banner: [],
      menus: [],
      roll: [],
      activity: [],
      activityOne: {},
      bastList: [],
      firstList: [],
      info: {
        fastList: [],
        bastBanner: [],

        bastList: []
      },
      likeInfo: [],
      lovely: [],
      benefit: [],
      couponList: [],
      swiperOption: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperRoll: {
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
      swiperScroll: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      },
      swiperBoutique: {
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        autoplay: {
          disableOnInteraction: false,
          delay: 2000
        },
        loop: true,
        speed: 1000,
        observer: true,
        observeParents: true
      },
      swiperProducts: {
        freeMode: true,
        freeModeMomentum: false,
        slidesPerView: "auto",
        observer: true,
        observeParents: true
      }
    };
  },
  mounted: function() {
    let that = this;
    getHomeData().then(res => {
      that.logoUrl = res.data.logoUrl;
      that.$set(that, "banner", res.data.banner);
      that.$set(that, "menus", res.data.menus);
      that.$set(that, "roll", res.data.roll);
      that.$set(that, "activity", res.data.activity);
      var activityOne = res.data.activity.shift();
      that.$set(that, "activityOne", activityOne);
      that.$set(that, "info", res.data.info);
      that.$set(that, "firstList", res.data.firstList);
      that.$set(that, "bastList", res.data.bastList);
      that.$set(that, "likeInfo", res.data.likeInfo);
      that.$set(that, "lovely", res.data.lovely);
      that.$set(that, "benefit", res.data.benefit);
      that.$set(that, "couponList", res.data.couponList);
      that.setOpenShare();
    });
  },
  methods: {
    setOpenShare: function() {}
  }
};
</script>
<style scoped>
.index {
  background-color: #fff;
}
.swiper-item {
  height: 100%;
}
</style>
