<template>
  <div>
    <div v-if="isIpx" class="iphonex-footer-bg"></div>
    <div v-else class="footer-bg"></div>
    <div id="footer" :class="[isIpx ? 'iphonex-footer' : '', 'acea-row row-middle'] ">
      <div
        @click="changeTabtar(footerIndex)"
        class="item"
        :class="{ on: footerIndex == tabtarIndex }"
        v-for="(item, footerIndex) in footerList"
        :key="footerIndex"
      >
        <div
          class="iconfont"
          :class="item.icon1 + ' ' + (footerIndex == tabtarIndex ? item.icon2 : '')"
        ></div>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  name: "Footer",
  props: {},
  data: function() {
    return {
      footerList: [
        {
          name: "首页",
          icon1: "icon-shouye-xianxing",
          icon2: "icon-shouye",
          url: "/pages/home/main"
        },
        {
          name: "分类",
          icon1: "icon-yingyongchengxu-xianxing",
          icon2: "icon-yingyongchengxu",
          url: "/pages/shop/GoodsClass/main"
        },
        {
          name: "购物车",
          icon1: "icon-caigou-xianxing",
          icon2: "icon-caigou",
          url: "/pages/shop/ShoppingCart/main"
        },
        {
          name: "我的",
          icon1: "icon-yonghu-xianxing",
          icon2: "icon-yonghu",
          url: "/pages/user/User/main"
        }
      ],
      isIpx: false
    };
  },
  computed: {
    ...mapState(["tabtarIndex"])
  },
  methods: {
    ...mapActions(["changeTabtar"])
  },
  mounted() {
    let that = this;
    this.changeTabtar(this.$yroute.query.type);
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        var name = "iPhone X";
        if (res.model.indexOf(name) > -1) {
          that.isIpx = true;
        }
      }
    });
  }
};
</script>
