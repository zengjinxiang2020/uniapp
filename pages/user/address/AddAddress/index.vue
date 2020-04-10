<template>
  <view class="addAddress absolute">
    <view class="list">
      <view class="item acea-row row-between-wrapper">
        <view class="name">姓名</view>
        <input type="text" placeholder="请输入姓名" v-model="userAddress.realName" required />
      </view>
      <view class="item acea-row row-between-wrapper">
        <view class="name">联系电话</view>
        <input type="text" placeholder="请输入联系电话" v-model="userAddress.phone" required />
      </view>
      <view class="item acea-row row-between-wrapper">
        <view class="name">所在地区</view>
        <view class="picker acea-row row-between-wrapper select-value form-control" >
          <view class="address" @tap="openAddres2">
            <!-- <picker
              @columnchange="addRessColumnchange"
              @change="changeAddress"
              range-key="name"
              mode="multiSelector"
              :range="district"
            >
              <text class="uni-input" v-if="model2">{{model2}}</text>
              <text class="uni-input" v-else>请选择地区</text>
            </picker>-->
            <text class="uni-input"  >{{model2||'请选择'}}</text>
            <simple-address
              ref="simpleAddress"
              :pickerValueDefault="cityPickerValueDefault"
              @onConfirm="onConfirm"
              themeColor="#007AFF"
            ></simple-address>
            <!-- <view slot="right" @click.stop="show2 = true">{{ model2 || "请选择收货地址" }}</view> -->
            <!-- <vant-popup :show="show2" position="bottom" @close="closeaArea">
							<vant-area :area-list="district" columns-num="3" :columns-placeholder="['请选择', '请选择', '请选择']" title="请选择"
							 @confirm="result2" />
            </vant-popup>-->
          </view>
          <view class="iconfont icon-dizhi font-color-red"></view>
        </view>
      </view>
      <view class="item acea-row row-between-wrapper">
        <view class="name">详细地址</view>
        <input type="text" placeholder="请填写具体地址" v-model="userAddress.detail" required />
      </view>
    </view>
    <view class="default acea-row row-middle">
      <view class="select-btn">
        <view class="checkbox-wrapper">
          <checkbox-group @change="ChangeIsDefault">
            <label class="well-check">
              <checkbox value :checked="userAddress.isDefault ? true : false"></checkbox>
              <text class="def">设置为默认地址</text>
            </label>
          </checkbox-group>
        </view>
      </view>
    </view>
    <view></view>
    <view class="keepBnt bg-color-red" @click="submit">立即保存</view>
    <view class="wechatAddress" v-if="isWechat && !id" @click="getAddress">导入微信地址</view>
  </view>
</template>
<script type="text/babel">
// import { CitySelect } from "vue-ydui/dist/lib.rem/cityselect";
// import District from "@/utils/area";
import simpleAddress from "@/components/simple-address/simple-address.nvue";
import { getAddress, postAddress, district } from "@/api/user";
import attrs, { required, chs_phone } from "@/utils/validate";
import { validatorDefaultCatch } from "@/utils/dialog";
// import { openAddress } from "@/libs/wechat";
import { isWeixin } from "@/utils";

export default {
  components: {
    // CitySelect
    simpleAddress
  },
  data() {
    return {
      show2: false,
      model2: "",
      districts: [],
      district: [],
      id: 0,
      userAddress: { isDefault: 0 },
      address: {},
      isWechat: isWeixin(),
      selectAddressValue: null,
      cityPickerValueDefault: [0, 0, 1],
      pickerText: ""
    };
  },
  mounted: function() {
    let id = this.$yroute.query.id;
    this.id = id;
    // document.title = !id ? "添加地址" : "修改地址";
    this.getUserAddress();
    district().then(res => {
      this.districts = res.data;
    });
  },
  methods: {
    openAddres() {
      this.cityPickerValueDefault = [0, 0, 1];
      this.$refs.simpleAddress.open();
    },
    openAddres2() {
      // 根据 label 获取
      
      
if(this.address.province){

      var index = this.$refs.simpleAddress.queryIndex(
        [this.address.province, this.address.city, this.address.district],
        "label"
      );
      console.log(index);
      this.cityPickerValueDefault = index.index;
	  }
      this.$refs.simpleAddress.open();
    },
    openAddres3() {
      // 根据value 获取
      var index = this.$refs.simpleAddress.queryIndex(
        [13, 1302, 130203],
        "value"
      );
      console.log(index);
      this.cityPickerValueDefault = index.index;
      this.$refs.simpleAddress.open();
    },
    onConfirm(e) {
      this.pickerText = JSON.stringify(e);
      this.model2 = e.label;
      console.log(this.pickerText);
    },
      getUserAddress: function() {
      if (!this.id) return false;
      let that = this;
      getAddress(that.id).then(res => {
        that.userAddress = res.data;
        that.model2 =
          res.data.province + " " + res.data.city + " " + res.data.district;
        that.address.province = res.data.province;
        that.address.city = res.data.city;
        that.address.district = res.data.district;
      });
    },
    getAddress() {},
    async submit() {
      let name = this.userAddress.realName,
        phone = this.userAddress.phone,
        model2 = this.model2,
        detail = this.userAddress.detail,
        isDefault = this.userAddress.isDefault;
      try {
        await this.$validator({
          name: [
            required(required.message("姓名")),
            attrs.range([2, 16], attrs.range.message("姓名"))
          ],
          phone: [
            required(required.message("联系电话")),
            chs_phone(chs_phone.message())
          ],
          model2: [required("请选择地址")],
          detail: [required(required.message("具体地址"))]
        }).validate({ name, phone, model2, detail });
      } catch (e) {
        return validatorDefaultCatch(e);
      }
      try {
        let that = this,
          data = {
            id: that.id,
            real_name: name,
            phone: phone,
            address: this.address,
            detail: detail,
            is_default: isDefault,
            post_code: ""
          };
        postAddress(data).then(function() {
          if (that.id) {
            uni.showToast({
              title: "修改成功",
              icon: "none",
              duration: 2000
            });
          } else {
            uni.showToast({
              title: "已取消绑定",
              icon: "none",
              duration: 2000
            });
            that.$yrouter.replace({
              path: "/pages/user/PersonalData/index"
            });
          }
          that.$yrouter.go(-1);
        });
      } catch (err) {
        uni.showToast({
          title: err.msg || err.response.data.msg,
          icon: "none",
          duration: 2000
        });
      }
    },
    ChangeIsDefault: function() {
      this.userAddress.isDefault = !this.userAddress.isDefault;
    },
    closeaArea() {
      this.show2 = false;
    },
    result2(ret) {
      let values = ret.mp.detail.values;
      this.closeaArea();
      this.address.province = values[0].name || "";
      this.address.city = values[1].name || "";
      this.address.district = values[2].name || "";
      this.model2 =
        this.address.province + this.address.city + this.address.district;
    }
  }
};
</script>

<style lang="less">
.address{
  text{
    width: 100%;
    display: block;
  }
}
</style>
