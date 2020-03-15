<template>
  <div class="productSort">
    <form @submit.prevent="submitForm">
      <div class="header acea-row row-center-wrapper" ref="header">
        <div class="acea-row row-between-wrapper input">
          <span class="iconfont icon-sousuo"></span>
          <input type="text" placeholder="搜索商品信息" v-model="search" />
        </div>
      </div>
    </form>
    <div class="aside">
      <div
        class="item acea-row row-center-wrapper"
        :class="categoryDivindex === navActive ? 'on' : ''"
        v-for="(item, categoryDivindex) in category"
        :key="categoryDivindex"
        @click="asideTap(categoryDivindex)"
      >
        <span>{{ item.cateName }}</span>
      </div>
    </div>
    <div class="conter">
      <div class="listw" v-for="(item, eq) in category" :key="eq">
        <div v-if="eq === navActive">
          <div class="title acea-row row-center-wrapper" ref="title">
            <div class="line"></div>
            <div class="name">{{ item.cateName }}</div>
            <div class="line"></div>
          </div>
          <div class="list acea-row">
            <div
              class="item acea-row row-column row-middle"
              v-for="(child, categoryIndex) in item.children"
              :key="categoryIndex"
              @click="goGoodsList(child)"
            >
              <div class="picture">
                <img :src="child.pic" />
              </div>
              <div class="name line1">{{ child.cateName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="height:100rpx;"></div>
  </div>
</template>
<script>
import debounce from "lodash.debounce";
import { getCategory } from "@/api/store";
import { trim } from "@/utils";

export default {
  name: "GoodsClass",
  components: {},
  props: {},
  data: function() {
    return {
      category: [],
      navActive: 0,
      search: "",
      lock: false
    };
  },
  watch: {
    "$yroute.query.id": function(n) {
      if (n) {
        this.activeCateId(n);
      }
    }
  },
  mounted: function() {
    // document.addEventListener("scroll", this.onScroll, false);
    this.loadCategoryData();
  },
  methods: {
    goGoodsList(child) {
      this.$yrouter.push({
        path: "/pages/shop/GoodsList/index",
        query: { id: child.id, title: child.cateName }
      });
    },
    activeCateId(n) {
      let index = 0;
      n = parseInt(n);
      if (!n) return;
      this.category.forEach((cate, i) => {
        if (cate.id === n) index = i;
      });

      if (index !== this.navActive) {
        this.asideTap(index);
      }
    },
    loadCategoryData() {
      getCategory().then(res => {
        this.category = res.data;
        this.$nextTick(() => {
          if (this.$yroute.query.id) {
            this.activeCateId(this.$yroute.query.id);
          }
        });
      });
    },
    submitForm: function() {
      var val = trim(this.search);
      if (val) {
        this.$yrouter.push({
          path: "/pages/shop/GoodsList/index",
          query: { s: val }
        });
        setTimeout(() => (this.search = ""), 500);
      }
    },
    asideTap(index) {
      this.navActive = index;
    }
  },
  beforeDestroy: function() {
    // document.removeEventListener("scroll", this.onScroll, false);
  }
};
</script>

<style >
.productSort {
  height: 100%;
}
</style>
