<template>
  <div class="bargain">
    <!-- 在header上加 on 为请求支援 -->
    <div :class="[bargainPartake != userInfo.uid ? 'header on' : 'header']">
      <div class="people">{{ lookCount }}人查看 丨 {{ shareCount }}人分享 丨 {{ userCount }}人参与</div>
      <!-- 帮助砍价、帮砍成功：-->
      <div class="pictxt acea-row row-center-wrapper" v-if="bargainPartake != userInfo.uid">
        <div class="pictrue">
          <img :src="bargainUserInfo.avatar" />
        </div>
        <div class="text">
          {{ bargainUserInfo.nickname }}
          <span>邀请您帮忙砍价</span>
        </div>
      </div>
      <count-down
        :is-day="true"
        :tip-text="'倒计时 '"
        :day-text="' 天 '"
        :hour-text="' 时 '"
        :minute-text="' 分 '"
        :second-text="' 秒'"
        :datatime="datatime"
      ></count-down>
    </div>
    <div class="wrapper">
      <div class="pictxt acea-row row-between-wrapper">
        <div class="pictrue">
          <img :src="bargain.image" />
        </div>
        <div class="text acea-row row-column-around">
          <div class="line2" v-text="bargain.title"></div>
          <div class="money font-color-red">
            已砍至: ￥
            <span class="num" v-text="price"></span>
          </div>
          <div class="acea-row row-middle">
            <div class="successNum" v-text="'原价' + bargain.price"></div>
            <div class="successNum" v-text="'已有' + bargainSumCount + '人砍价成功'"></div>
          </div>
        </div>
      </div>
      <div class="cu-progress acea-row row-middle round margin-top">
        <div
          class="acea-row row-middle bg-red"
          :style="{ width: loading ? pricePercent + '%' : '' }"
        ></div>
      </div>
      <div class="balance acea-row row-between-wrapper">
        <div v-text="'已砍' + alreadyPrice + '元'"></div>
        <div v-if="surplusPrice === 0">砍价成功</div>
        <div v-else v-text="'还剩' + surplusPrice + '元'"></div>
      </div>
      <!-- 帮助砍价、帮砍成功：-->
      <!--<div class='bargainSuccess'><span class='iconfont icon-xiaolian'></span>已成功帮助好友砍价</div>-->
      <div class="bargainBnts">
        <div
          class="bargainBnt"
          @click="goPoster"
          v-if="bargainPartake === userInfo.uid && surplusPrice > 0"
        >邀请好友帮砍价</div>
        <div
          class="bargainBnt"
          @click="getBargainHelp"
          v-else-if="bargainPartake != userInfo.uid"
        >帮好友砍一刀</div>
        <div class="bargainBnt" @click="getBargainStart" v-if="bargainPartake != userInfo.uid">开启砍价</div>
        <div
          class="bargainBnt"
          @click="goPay"
          v-if="surplusPrice === 0 && bargainPartake === userInfo.uid && userBargainStatus === 1"
        >立即支付</div>
        <div class="bargainBnt on" @click="goList">抢更多商品</div>
      </div>
      <div class="tip">
        已有
        <span class="font-color-red" v-text="helpCount"></span>
        位好友成功帮您砍价
      </div>
      <div class="lock"></div>
    </div>
    <div class="bargainGang">
      <div class="title font-color-red acea-row row-center-wrapper">
        <div class="pictrue">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
        <div class="titleCon">砍价帮</div>
        <div class="pictrue on">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
      </div>
      <div class="list">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, bargainHelpListIndex) in bargainHelpList"
          :key="bargainHelpListIndex"
        >
          <div class="pictxt acea-row row-between-wrapper">
            <div class="pictrue">
              <img :src="item.avatar" />
            </div>
            <div class="text">
              <div class="name line1" v-text="item.nickname"></div>
              <div class="line1" v-text="item.add_time"></div>
            </div>
          </div>
          <div class="money font-color-red">
            <span class="iconfont icon-kanjia"></span>
            砍掉{{ item.price }}元
          </div>
        </div>
      </div>
      <div
        class="load font-color-red"
        v-if="!helpListStatus && !helpListLoading"
        @click="getBargainHelpList"
      >点击加载更多</div>
      <div class="lock"></div>
    </div>
    <div class="goodsDetails">
      <div class="title font-color-red acea-row row-center-wrapper">
        <div class="pictrue">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
        <div class="titleCon">商品详情</div>
        <div class="pictrue on">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
      </div>
      <div class="conter" v-html="bargain.description"></div>
      <div class="lock"></div>
    </div>
    <div class="goodsDetails">
      <div class="title font-color-red acea-row row-center-wrapper">
        <div class="pictrue">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
        <div class="titleCon">活动规则</div>
        <div class="pictrue on">
          <img :src="$VUE_APP_RESOURCES_URL+'/images/left.png'" />
        </div>
      </div>
      <div class="conter" v-html="bargain.rule"></div>
    </div>
    <div class="bargainTip" :class="active === true ? 'on' : ''">
      <div class="pictrue">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/bargainBg.jpg'" />
        <div class="iconfont icon-guanbi" @click="close"></div>
      </div>
      <div class="cutOff" v-if="bargainPartake === userInfo.uid">
        您已砍掉
        <span class="font-color-red" v-text="bargainHelpPrice"></span>元，听说分享次数越多砍价成功的机会越大哦！
      </div>
      <div class="cutOff on" v-else>
        <div class="help font-color-red" v-text="'成功帮砍' + bargainHelpPrice + '元'"></div>，您也可以砍价低价拿哦，快去挑选心仪的商品吧~
      </div>
      <div class="tipBnt" @click="goPoster" v-if="bargainPartake === userInfo.uid">邀请好友帮砍价</div>
      <div class="tipBnt" @click="getBargainStart" v-else>我也要参与</div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="active === false" @click="close"></div>
  </div>
</template>
<script>
import CountDown from "@/components/CountDown";
import {
  getBargainDetail,
  getBargainShare,
  getBargainStart,
  getBargainHelp,
  getBargainHelpPrice,
  getBargainHelpList,
  getBargainHelpCount,
  getBargainStartUser
} from "@/api/activity";
import { postCartAdd } from "@/api/store";
import { mapGetters } from "vuex";
import {} from "@/libs/wechat";
import { isWeixin, parseQuery, handleQrCode } from "@/utils/index";

const NAME = "DargainDetails";

export default {
  name: "DargainDetails",
  components: {
    CountDown
  },
  props: {},
  data: function() {
    return {
      price: 0,
      bargainId: 0, //砍价编号
      bargainPartake: 0, //参与砍价
      bargain: [], //砍价产品信息
      partake: null,
      bargainSumCount: 0, //砍价成功人数
      activeMsg: "",
      active: false,
      loading: false,
      datatime: 0,
      lookCount: 0, //查看人数
      shareCount: 0, //分享人数
      userCount: 0, //参与人数
      bargainHelpPrice: 0, //砍掉金额
      bargainHelpList: [],
      helpListStatus: false, //砍价列表是否获取完成 false 未完成 true 完成
      helpListLoading: false, //当前接口是否请求完成 false 完成 true 未完成
      page: 1, //页码
      limit: 2, //数量
      helpCount: 0, //砍价帮总人数
      surplusPrice: 0, //剩余金额
      alreadyPrice: 0, //已砍掉价格
      pricePercent: 0, //砍价进度条
      bargainUserInfo: [], //砍价 开启砍价用户信息
      userBargainStatus: 2 //砍价状态
    };
  },
  computed: mapGetters(["userInfo", "isLogin"]),
  // watch: {
  //   $yroute: function(n) {
  //     var that = this;
  //     if (n.name === NAME) {
  //       that.mountedStart();
  //     }
  //   }
  // },
  mounted: function() {
    var that = this;
    that.mountedStart();
    setTimeout(function() {
      that.loading = true;
    }, 500);
  },
  methods: {
    mountedStart: function() {
      var that = this;
      let url = handleQrCode();
      if (url) {
        that.bargainId = url.bargainId;
        that.partake = url.uid;
      } else {
        that.bargainId = that.$yroute.query.id;
        that.partake = parseInt(that.$yroute.query.partake);
      }
      if (
        this.partake === undefined ||
        this.partake <= 0 ||
        isNaN(this.partake)
      ) {
        that.bargainPartake = that.userInfo.uid;
        // that.$yrouter.push({
        //   path: "/pages/activity/DargainDetails/index",
        //   query: { id: that.bargainId, partake: that.bargainPartake }
        // });
      } else {
        that.bargainPartake = parseInt(this.partake);
      }
      that.getBargainHelpCountStart();
      that.getBargainDetail();
      that.getBargainShare(0);
      if (that.bargainPartake === that.userInfo.uid) that.getBargainStart();
      else that.getBargainStartUser();
    },
    updateTitle() {
      // document.title = this.bargain.title || this.$yroute.meta.title;
    },
    goPay: function() {
      var data = {};
      var that = this;
      data.productId = that.bargain.productId;
      data.cartNum = that.bargain.num;
      data.uniqueId = "";
      data.bargainId = that.bargainId;
      data.new = 1;
      postCartAdd(data)
        .then(res => {
          that.$yrouter.push({
            path: "/pages/order/OrderSubmission/index",
            query: { id: res.data.cartId }
          });
        })
        .catch(err => {
          this.$dialog.error(err.msg || err.response.data.msg);
        });
    },
    goPoster: function() {
      var that = this;
      that.getBargainShare(that.bargainId);
      this.$yrouter.push({
        path: "/pages/activity/Poster/index",
        query: { id: that.bargainId, type: 2 }
      });
    },
    goList: function() {
      this.$yrouter.push({
        path: "/pages/activity/GoodsBargain/index"
      });
    },
    //砍价分享
    //bargainId 0  获取 查看人数 分享人数 参与人数
    //bargainId 砍价产品编号 添加分享次数  获取 查看人数 分享人数 参与人数
    getBargainShare: function(bargainId) {
      var that = this;
      getBargainShare({ bargainId: bargainId }).then(res => {
        that.lookCount = res.data.lookCount;
        that.shareCount = res.data.shareCount;
        that.userCount = res.data.userCount;
      });
    },
    // 获取产品详情
    getBargainDetail: function() {
      var that = this;
      getBargainDetail(that.bargainId)
        .then(res => {
          that.$set(that, "bargain", res.data.bargain);
          that.updateTitle();
          that.datatime = that.bargain.stopTime;
          that.getBargainHelpCount();
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    //开启砍价
    getBargainStart: function() {
      var that = this;
      getBargainStart({ bargainId: that.bargainId })
        .then(() => {
          that.bargainPartake = that.userInfo.uid;
          that.getBargainHelp();
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    //参与砍价
    getBargainHelp: function() {
      var that = this;
      if (
        that.surplusPrice === 0 &&
        that.bargainPartake !== that.userInfo.uid
      ) {
        return uni.showToast({
          title: "好友已经砍价成功",
          icon: "success",
          duration: 2000
        });
      }
      var data = {
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake
      };
      getBargainHelp(data)
        .then(res => {
          that.activeMsg = res.data.status;
          if (
            res.data.status === "SUCCESSFUL" &&
            that.bargainPartake !== that.userInfo.uid
          ) {
            return that.$dialog.toast({ mes: "您已经砍过了" });
          }
          that.helpListStatus = false;
          that.page = 1;
          that.bargainHelpList = [];
          that.getBargainHelpPrice();
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    //获取砍掉的金额
    getBargainHelpPrice: function() {
      var that = this;
      getBargainHelpPrice({
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake
      })
        .then(res => {
          that.bargainHelpPrice = res.data.price;
          that.getBargainHelpCount();
          that.getBargainHelpList();
          switch (that.activeMsg) {
            case "SUCCESSFUL":
              break;
            case "SUCCESS":
              that.active = true;
              break;
          }
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    //砍价帮
    getBargainHelpList: function() {
      var that = this;
      if (that.helpListLoading === true) return;
      if (that.helpListStatus === true) return;
      that.helpListLoading = true;
      getBargainHelpList({
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake,
        page: that.page,
        limit: that.limit
      })
        .then(res => {
          that.helpListStatus = res.data.length < that.limit;
          that.helpListLoading = false;
          that.page++;
          that.bargainHelpList.push.apply(that.bargainHelpList, res.data);
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    getBargainHelpCountStart: function() {
      var that = this;
      getBargainHelpCount({
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake
      })
        .then(() => {})
        .catch(() => {
          // that.$yrouter.push({
          //   path: "/pages/activity/DargainDetails/index",
          //   query: { id: that.bargainId, partake: that.userInfo.uid }
          // });
        });
    },
    getBargainHelpCount: function() {
      var that = this;
      getBargainHelpCount({
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake
      })
        .then(res => {
          that.userBargainStatus = res.data.status;
          that.helpCount = res.data.count;
          that.surplusPrice = res.data.price;
          that.alreadyPrice = res.data.alreadyPrice;
          that.pricePercent = res.data.pricePercent;
          that.price = (that.bargain.price - that.alreadyPrice).toFixed(2);
        })
        .catch(() => {
          that.bargainPartake = that.userInfo.uid;
          // that.$yrouter.push({
          //   path: "/pages/activity/DargainDetails/index",
          //   query: { id: that.bargainId, partake: that.userInfo.uid }
          // });
        });
    },
    getBargainStartUser: function() {
      var that = this;
      getBargainStartUser({
        bargainId: that.bargainId,
        bargainUserUid: that.bargainPartake
      })
        .then(res => {
          that.bargainUserInfo = res.data;
          that.getBargainHelpList();
        })
        .catch(res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
        });
    },
    close: function() {
      this.active = false;
    }
  },
  onShareAppMessage() {
    return {
      path: `/pages/activity/DargainDetails/index/?id=${
        this.$yroute.query.id
      }&partake=${this.userInfo.uid}`
    };
  }
};
</script>

<style>
.bargainBnts {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
