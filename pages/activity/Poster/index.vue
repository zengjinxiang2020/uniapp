<template>
  <view class="poster-poster" v-if="status === false">
    <view class="tip">
      <text class="iconfont icon-shuoming"></text>提示：长按图片保存至手机相册
    </view>
    <view class="poster">
      <image :src="image" mode="widthFix" show-menu-by-longpress />
    </view>
  </view>
</template>
<script>
import { getBargainPoster, getCombinationPoster } from "@/api/activity";

export default {
  name: "Poster",
  components: {},
  props: {},
  data: function() {
    return {
      status: true,
      id: 0,
      image: ""
    };
  },
  mounted: function() {
    var that = this;
    var id = that.$yroute.query.id;
    var type = that.$yroute.query.type;
    that.id = id;
    if (type == 2) {
      that.getBargainPoster();
    } else {
      that.getCombinationPoster();
    }
  },
  methods: {
    getBargainPoster: function() {
      var that = this;
      getBargainPoster({ bargainId: that.id, from: "wechat" })
        .then(res => {
          that.image = res.data.url;
          that.status = false;
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    // 拼团海报
    getCombinationPoster: function() {
      var that = this;
      getCombinationPoster({ id: that.id, from: "wechat" })
        .then(res => {
          that.image = res.data.url;
          that.status = false;
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    }
  }
};
</script>

<style scoped lang="less">
page {
  background-color: #eb3729;
}
.poster-poster {
  height: unset !important;
}
</style>
