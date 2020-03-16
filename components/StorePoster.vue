<template>
  <view v-if="posterImageStatus" class="poster-first">
    <canvas style="width:747px;height:1326px" canvas-id="myCanvas"></canvas>
    <!-- <view class="poster-pop" v-show="!canvasStatus">
      <img
        :src="$VUE_APP_RESOURCES_URL+'/images/poster-close.png'"
        class="close"
        @click="posterImageClose"
      />
      <view class="canvas" ref="poster">
        <image class="image" :src="posterData.image" alt="商品图片" />
        <view class="text black">
          <text v-text="posterData.title"></text>
        </view>
        <view class="text rad">
          <text v-text="'￥' + posterData.price"></text>
        </view>
        <view class="code">
          <view class="code-img">
            <image :src="posterData.code" show-menu-by-longpress mode="widthFix" alt="二维码" />
          </view>
          <view class="code-text">
            <text>长按识别二维码 立即购买</text>
          </view>
        </view>
      </view>
      <view class="save-poster" @click="savePosterPath">生成图片</view>
    </view> -->
    <view class="poster-pop" v-show="canvasStatus">
      <img
        :src="$VUE_APP_RESOURCES_URL+'/images/poster-close.png'"
        class="close"
        @click="posterImageClose"
        mode="widthFix"
      />
      <image :src="posterImage" alt="tp" class="poster-image" show-menu-by-longpress mode="widthFix" />
      <view class="keep">长按图片可以保存到手机</view>
    </view>
    <view class="mask"></view>
  </view>
</template>
<style scoped>
.poster-first {
  overscroll-behavior: contain;
}
.poster-pop {
  width: 4.5rem;
  height: 8rem;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99;
  top: 50%;
  margin-top: -4.6rem;
}
.poster-pop .canvas {
  background-color: #ffffff;
  height: 8rem;
}
.poster-pop .poster-image {
  width: 100%;
  height: auto;
}
.poster-pop .canvas .image {
  width: 4.5rem;
  height: 4.5rem;
  display: block;
}
.poster-pop .canvas .text {
  text-align: center;
  color: #000000;
  margin-top: 0.32rem;
}
.poster-pop .canvas .text.black {
  height: 0.68rem;
}
.poster-pop .canvas .text.rad {
  color: #ff0000;
}
.poster-pop .canvas .code {
  height: 1.4rem;
  display: flex;
}
.poster-pop .canvas .code .code-img {
  width: 33%;
  padding: 0.06rem;
}
.poster-pop .canvas .code .code-img image{
  width: 100%;
}
.poster-pop .canvas .code .code-text {
  width: 60%;
  font-size: 0.12rem;
  line-height: 1.64rem;
}
.poster-pop .close {
  width: 0.46rem;
  height: 0.75rem;
  position: fixed;
  right: 0;
  top: -0.73rem;
  display: block;
}
.poster-pop .save-poster {
  background-color: #df2d0a;
  font-size: 0.22rem;
  color: #fff;
  text-align: center;
  height: 0.76rem;
  line-height: 0.76rem;
  width: 100%;
  margin-top: -0.04rem;
}
.poster-pop .keep {
  color: #fff;
  text-align: center;
  font-size: 0.25rem;
  margin-top: 0.1rem;
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
}
</style>
<script>
// import html2canvas from "html2canvas";
import { PosterCanvas } from "@/utils";

export default {
  name: "StorePoster",
  props: {
    posterImageStatus: Boolean,
    posterData: Object
  },
  data: function() {
    return {
      canvasStatus: false,
      posterImage: ""
    };
  },
  watch: {
    posterImageStatus: function() {
      var that = this;
      if (that.posterImageStatus === true) {
        that.$nextTick(function() {
          that.savePosterPath();
        });
      }
    }
  },
  mounted: function() {},
  methods: {
    posterImageClose: function() {
      this.posterImageStatus = false;
      this.canvasStatus = false;
      this.$emit("setPosterImageStatus");
    },
    savePosterPath: function() {
      PosterCanvas(this.posterData, posterImage => {
        this.canvasStatus = true;
        this.posterImage = posterImage;
      });
    }
  }
};
</script>
