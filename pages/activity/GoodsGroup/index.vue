<template>
  <view class="group-list" ref="container">
    <!-- <view class="header">
      <image :src="$VUE_APP_RESOURCES_URL+'/images/group.png'" class="image" />
    </view>-->
    <view class="list" v-if="combinationList.length>0">
      <view
        class="item acea-row row-between-wrapper"
        v-for="(item, combinationListIndex) in combinationList"
        :key="combinationListIndex"
        @click="link(item.id)"
      >
      <text>{{item.id}}</text>
        <view class="pictrue">
          <image :src="item.image" />
        </view>
        <view class="text">
          <view class="line1" v-text="item.title"></view>
          <view class="acea-row">
            <view class="team acea-row row-middle cart-color">
              <view class="iconfont icon-pintuan"></view>
              <view class="num" v-text="item.people + '人团'"></view>
            </view>
          </view>
          <view class="bottom acea-row row-between-wrapper">
            <view class="money">
              ￥
              <text class="num" v-text="item.price"></text>
              <text class="y-money" v-text="'￥' + item.productPrice"></text>
            </view>
            <view class="groupBnt bg-color-red">
              去拼团
              <text class="iconfont icon-jiantou"></text>
            </view>
          </view>
        </view>
      </view>
      <Loading :loaded="status" :loading="loadingList"></Loading>
    </view>
    <view class="noCommodity" style="background-color: #fff;" v-if="combinationList.length === 0">
      <view class="noPictrue">
        <image :src="$VUE_APP_RESOURCES_URL+'/images/noGood.png'" class="image" />
      </view>
    </view>
  </view>
</template>
<script>
import { getCombinationList } from "@/api/activity";
import Loading from "@/components/Loading";

export default {
  name: "GoodsGroup",
  components: {
    Loading
  },
  props: {},
  data: function() {
    return {
      combinationList: [],
      status: false, //砍价列表是否获取完成 false 未完成 true 完成
      loading: false, //当前接口是否请求完成 false 完成 true 未完成
      page: 1, //页码
      limit: 20, //数量
      loadingList: false
    };
  },
  mounted: function() {
    // document.querySelector('body').setAttribute('style', 'background-color:#73CBB6');
    this.getCombinationList();
  },
  onReachBottom() {
    !this.loadingList && this.getCombinationList();
  },
  methods: {
    getCombinationList: function() {
      var that = this;
      if (that.loading) return;
      if (that.status) return;
      getCombinationList({ page: that.page, limit: that.limit }).then(res => {
        that.status = res.data.length < that.limit;
        that.combinationList.push.apply(that.combinationList, res.data);
        that.page++;
        that.loading = false;
      });
    },
    link: function(id) {
      this.$yrouter.push({
        path: "/pages/activity/GroupDetails/index",
        query: { id }
      });
    }
  }
};
</script>
