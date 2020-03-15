<template>
  <div
    class="address-management"
    :class="addressList.length < 1 && page > 1 ? 'on' : ''"
    ref="container"
  >
    <div class="line" v-if="addressList.length > 0">
      <img :src="$VUE_APP_RESOURCES_URL+'/images/line.jpg'" />
    </div>
    <div class="item" v-for="(item, addressListIndex) in addressList" :key="addressListIndex">
      <div class="address">
        <div class="consignee">
          收货人：{{ item.realName }}
          <span class="phone">{{ item.phone }}</span>
        </div>
        <div>
          收货地址：{{ item.province }}{{ item.city }}{{ item.district
          }}{{ item.detail }}
        </div>
      </div>
      <div class="operation acea-row row-between-wrapper">
        <div class="select-btn">
          <div class="checkbox-wrapper">
            <checkbox-group @change="radioChange(item.id)">
              <label class="well-check">
                <checkbox value :checked="item.isDefault||item.isDefault=='1' ? true : false"></checkbox>
                <span class="default">设为默认</span>
              </label>
            </checkbox-group>
            <!-- <label class="well-check">
              <input
                type="radio"
                name="default"
                value
                :checked="item.isDefault ? true : false"
                @click="radioChange(addressListIndex)"
              />
              <i class="icon"></i>
              <span class="default">设为默认</span>
            </label>-->
          </div>
        </div>
        <div class="acea-row row-middle">
          <div @click="editAddress(addressListIndex)">
            <span class="iconfont icon-bianji"></span>编辑
          </div>
          <div @click="delAddress(addressListIndex)">
            <span class="iconfont icon-shanchu"></span>删除
          </div>
        </div>
      </div>
    </div>
    <Loading :loaded="loadend" :loading="loading"></Loading>
    <div class="noCommodity" v-if="addressList.length < 1 && page > 1">
      <div class="noPictrue">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/noAddress.png'" class="image" />
      </div>
    </div>
    <div style="height:100rpx;"></div>
    <div class="footer acea-row row-between-wrapper">
      <div class="addressBnt bg-color-red" v-if="isWechat" @click="addAddress">
        <span class="iconfont icon-tianjiadizhi"></span>添加新地址
      </div>
      <div class="addressBnt on bg-color-red" v-else @click="addAddress">
        <span class="iconfont icon-tianjiadizhi"></span>添加新地址
      </div>
      <!--<div class="addressBnt wxbnt" v-if="isWechat" @click="getAddress">-->
      <!--<span class="iconfont icon-weixin2"></span>导入微信地址-->
      <!--</div>-->
    </div>
  </div>
</template>
<style scoped>
.address-management.on {
  background-color: #fff;
  height: 100vh;
}
</style>
<script type="text/babel">
import {
  getAddressList,
  getAddressRemove,
  getAddressDefaultSet,
  postAddress
} from "@/api/user";
import Loading from "@/components/Loading";
import { isWeixin } from "@/utils";
// import { openAddress } from "@/libs/wechat";

export default {
  components: {
    Loading
  },
  data() {
    return {
      page: 1,
      limit: 20,
      addressList: [],
      loadTitle: "",
      loading: false,
      loadend: false,
      isWechat: isWeixin()
    };
  },
  mounted: function() {
    this.AddressList();
  },
  onReachBottom() {
    !this.loading && this.AddressList();
  },
  onShow:function(){
    this.refresh();
  },
  methods: {
    refresh: function() {
      this.addressList = [];
      this.page = 1;
      this.loadend = false;
      this.AddressList();
    },
    /**
     * 获取地址列表
     *
     */
    AddressList: function() {
      let that = this;
      if (that.loading) return; //阻止下次请求（false可以进行请求）；
      if (that.loadend) return; //阻止结束当前请求（false可以进行请求）；
      that.loading = true;
      getAddressList({ page: that.page, limit: that.limit }).then(res => {
        that.loading = false;
        //apply();js将一个数组插入另一个数组;
        that.addressList.push.apply(that.addressList, res.data);
        that.loadend = res.data.length < that.limit; //判断所有数据是否加载完成；
        that.page = that.page + 1;
      });
    },
    /**
     * 编辑地址
     */
    editAddress: function(index) {
      this.$yrouter.push({
        path: "/pages/user/address/AddAddress/main",
        query: { id: this.addressList[index].id }
      });
    },
    /**
     * 删除地址
     */
    delAddress: function(index) {
      let that = this;
      let address = this.addressList[index];
      let id = address.id;
      getAddressRemove(id).then(function() {
        that.$dialog.toast({
          mes: "删除成功!",
          callback: () => {
            that.addressList.splice(index, 1);
            that.$set(that, "addressList", that.addressList);
          }
        });
      });
    },
    /**
     * 设置默认地址
     */
    radioChange: function(id) {
      getAddressDefaultSet(id).then(res => {
        this.refresh();
        wx.showToast({ title: res.msg, icon: "none", duration: 2000 });
      });
    },
    /**
     * 新增地址
     */
    addAddress: function() {
      this.$yrouter.push({
        path: "/pages/user/address/AddAddress/main"
      });
    },
    getAddress() {
      // openAddress().then(userInfo => {
      //   wx.showLoading({ title: "加载中" });
      //   postAddress({
      //     real_name: userInfo.userName,
      //     phone: userInfo.telNumber,
      //     address: {
      //       province: userInfo.provinceName,
      //       city: userInfo.cityName,
      //       district: userInfo.countryName
      //     },
      //     detail: userInfo.detailInfo,
      //     post_code: userInfo.postalCode,
      //     wx_export: 1
      //   })
      //     .then(() => {
      //       this.page = 1;
      //       this.loading = false;
      //       this.loadend = false;
      //       this.addressList = [];
      //       this.AddressList();
      //       wx.hideLoading();
      //       this.$dialog.toast({ mes: "添加成功" });
      //     })
      //     .catch(err => {
      //       wx.hideLoading();
      //       this.$dialog.error(err.msg || "添加失败");
      //     });
      // });
    }
  }
};
</script>
