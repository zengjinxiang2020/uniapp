<template>
  <div class="deliver-goods">
    <header>
      <div class="order-num acea-row row-between-wrapper">
        <div class="num line1">订单号：{{ delivery.orderId }}</div>
        <div class="name line1">{{ delivery.nickname }}</div>
      </div>
      <div class="address">
        <div class="name">
          {{ delivery.realName
          }}
          <span class="phone">{{ delivery.userPhone }}</span>
        </div>
        <div>{{ delivery.userAddress }}</div>
      </div>
      <div class="line">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/line.jpg'" />
      </div>
    </header>
    <div class="wrapper">
      <div class="item acea-row row-between-wrapper">
        <div>发货方式</div>
        <div class="mode acea-row row-middle row-right">
          <div
            class="goods"
            :class="active === typesIndex ? 'on' : ''"
            v-for="(item, typesIndex) in types"
            :key="typesIndex"
            @click="changeType(item, typesIndex)"
          >
            {{ item.title }}
            <span class="iconfont icon-xuanzhong2"></span>
          </div>
        </div>
      </div>
      <div class="list" v-show="active === 0">
        <div class="item acea-row row-between-wrapper">
          <div>快递公司</div>
          <input type="text" placeholder="填写快递公司" v-model="delivery_name" class="mode" />
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>快递单号</div>
          <input type="text" placeholder="填写快递单号" v-model="delivery_id" class="mode" />
        </div>
      </div>
      <div class="list" v-show="active === 1">
        <div class="item acea-row row-between-wrapper">
          <div>送货人</div>
          <input type="text" placeholder="填写送货人" v-model="delivery_name" class="mode" />
        </div>
        <div class="item acea-row row-between-wrapper">
          <div>送货电话</div>
          <input type="text" placeholder="填写送货电话" v-model="delivery_id" class="mode" />
        </div>
      </div>
    </div>
    <div style="height:100rpx;"></div>
    <div class="confirm" @click="saveInfo">确认提交</div>
  </div>
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
          wx.showToast({
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
          wx.showToast({
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
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000
          });
          that.$yrouter.go(-1);
        },
        error => {
          wx.showToast({
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
