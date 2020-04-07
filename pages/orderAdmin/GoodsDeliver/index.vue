<template>
  <view class="deliver-goods">
    <header>
      <view class="order-num acea-row row-between-wrapper">
        <view class="num line1">订单号：{{ delivery.orderId }}</view>
        <view class="name line1">{{ delivery.nickname }}</view>
      </view>
      <view class="address">
        <view class="name">
          {{ delivery.realName
          }}
          <text class="phone">{{ delivery.userPhone }}</text>
        </view>
        <view>{{ delivery.userAddress }}</view>
      </view>
      <view class="line">
        <image src="@/static/images/line.jpg" />
      </view>
    </header>
    <view class="wrapper">
      <view class="item acea-row row-between-wrapper">
        <view>发货方式</view>
        <view class="mode acea-row row-middle row-right">
          <view
            class="goods"
            :class="active === typesIndex ? 'on' : ''"
            v-for="(item, typesIndex) in types"
            :key="typesIndex"
            @click="changeType(item, typesIndex)"
          >
            {{ item.title }}
            <text class="iconfont icon-xuanzhong2"></text>
          </view>
        </view>
      </view>
      <view class="list" v-show="active === 0">
        <view class="item acea-row row-between-wrapper">
          <view>快递公司</view>
          <input type="text" placeholder="填写快递公司" v-model="delivery_name" class="mode" />
        </view>
        <view class="item acea-row row-between-wrapper">
          <view>快递单号</view>
          <input type="text" placeholder="填写快递单号" v-model="delivery_id" class="mode" />
        </view>
      </view>
      <view class="list" v-show="active === 1">
        <view class="item acea-row row-between-wrapper">
          <view>送货人</view>
          <input type="text" placeholder="填写送货人" v-model="delivery_name" class="mode" />
        </view>
        <view class="item acea-row row-between-wrapper">
          <view>送货电话</view>
          <input type="text" placeholder="填写送货电话" v-model="delivery_id" class="mode" />
        </view>
      </view>
    </view>
    <view style="height:100rpx;"></view>
    <view class="confirm" @click="saveInfo">确认提交</view>
  </view>
</template>
<script>
import { getAdminOrderDelivery, setAdminOrderDelivery } from "@/api/admin";
import { getLogistics } from "@/api/public";
import { required } from "@/utils/validate";
import { validatorDefaultCatch } from "@/utils/dialog";

export default {
  name: "GoodsDeliver",
  components: {},
  props: {},
  data: function() {
    return {
      types: [
        {
          type: "express",
          title: "发货"
        }
        // {
        //   type: "send",
        //   title: "送货"
        // },
        // {
        //   type: "fictitious",
        //   title: "无需发货"
        // }
      ],
      active: 0,
      order_id: "",
      delivery: [],
      logistics: [],
      delivery_type: "express",
      delivery_name: "",
      delivery_id: ""
    };
  },
  watch: {
    "$yroute.query.oid": function(newVal) {
      let that = this;
      if (newVal != undefined) {
        that.order_id = newVal;
        that.getIndex();
      }
    }
  },
  mounted: function() {
    this.order_id = this.$yroute.query.oid;
    this.getIndex();
    //this.getLogistics();
  },
  methods: {
    changeType: function(item, index) {
      this.active = index;
      this.delivery_type = item.type;
      this.delivery_name = "";
      this.delivery_id = "";
    },
    getIndex: function() {
      let that = this;
      getAdminOrderDelivery(that.order_id).then(
        res => {
          that.delivery = res.data;
        },
        error => {
          uni.showToast({
            title: error.msg,
            icon: "none",
            duration: 2000
          });
        }
      );
    },
    getLogistics: function() {
      let that = this;
      getLogistics().then(
        res => {
          that.logistics = res.data;
        },
        error => {
          uni.showToast({
            title: error.msg,
            icon: "none",
            duration: 2000
          });
        }
      );
    },
    async saveInfo() {
      let that = this,
        delivery_type = that.delivery_type,
        delivery_name = that.delivery_name,
        delivery_id = that.delivery_id,
        save = {};
      save.orderId = that.order_id;
      save.deliveryType = that.delivery_type;
      switch (delivery_type) {
        case "send":
          try {
            await this.$validator({
              delivery_name: [required(required.message("快递公司"))],
              delivery_id: [required(required.message("快递单号"))]
            }).validate({ delivery_name, delivery_id });
          } catch (e) {
            return validatorDefaultCatch(e);
          }
          save.delivery_name = delivery_name;
          save.delivery_id = delivery_id;
          that.setInfo(save);
          break;
        case "express":
          try {
            await this.$validator({
              delivery_name: [required(required.message("发货人姓名"))],
              delivery_id: [required(required.message("发货人电话"))]
            }).validate({ delivery_name, delivery_id });
          } catch (e) {
            return validatorDefaultCatch(e);
          }
          save.deliveryName = delivery_name;
          save.deliveryId = delivery_id;
          that.setInfo(save);
          break;
      }
    },
    setInfo: function(item) {
      let that = this;
      setAdminOrderDelivery(item).then(
        res => {
          uni.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
          that.$yrouter.go(-1);
        },
        error => {
          uni.showToast({
            title: error.msg,
            icon: "none",
            duration: 2000
          });
        }
      );
    }
  }
};
</script>
