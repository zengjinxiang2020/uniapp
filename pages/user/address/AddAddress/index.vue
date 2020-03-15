<template>
  <div class="addAddress absolute">
    <div class="list">
      <div class="item acea-row row-between-wrapper">
        <div class="name">姓名</div>
        <input type="text" placeholder="请输入姓名" v-model="userAddress.realName" required />
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">联系电话</div>
        <input type="text" placeholder="请输入联系电话" v-model="userAddress.phone" required />
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">所在地区</div>
        <div class="picker acea-row row-between-wrapper select-value form-control">
          <div class="address">
            <div slot="right" @click.stop="show2 = true">{{ model2 || "请选择收货地址" }}</div>
            <vant-popup :show="show2" position="bottom" @close="closeaArea">
              <vant-area
                :area-list="district"
                columns-num="3"
                :columns-placeholder="['请选择', '请选择', '请选择']"
                title="请选择"
                @confirm="result2"
              />
            </vant-popup>
          </div>
          <div class="iconfont icon-dizhi font-color-red"></div>
        </div>
      </div>
      <div class="item acea-row row-between-wrapper">
        <div class="name">详细地址</div>
        <input type="text" placeholder="请填写具体地址" v-model="userAddress.detail" required />
      </div>
    </div>
    <div class="default acea-row row-middle">
      <div class="select-btn">
        <div class="checkbox-wrapper">
          <checkbox-group @change="ChangeIsDefault">
            <label class="well-check">
              <checkbox value :checked="userAddress.isDefault ? true : false"></checkbox>
              <span class="def">设置为默认地址</span>
            </label>
          </checkbox-group>
        </div>
      </div>
    </div>
    <div></div>
    <div class="keepBnt bg-color-red" @click="submit">立即保存</div>
    <div class="wechatAddress" v-if="isWechat && !id" @click="getAddress">导入微信地址</div>
  </div>
</template>
<script type="text/babel">
// import { CitySelect } from "vue-ydui/dist/lib.rem/cityselect";
// import District from "@/utils/area";
import { getAddress, postAddress, district } from "@/api/user";
import attrs, { required, chs_phone } from "@/utils/validate";
import { validatorDefaultCatch } from "@/utils/dialog";
// import { openAddress } from "@/libs/wechat";
import { isWeixin } from "@/utils";

export default {
  components: {
    // CitySelect
  },
  data() {
    return {
      show2: false,
      model2: "",
      district: {},
      id: 0,
      userAddress: { isDefault: 0 },
      address: {},
      isWechat: isWeixin()
    };
  },
  mounted: function() {
    let id = this.$yroute.query.id;
    this.id = id;
    // document.title = !id ? "添加地址" : "修改地址";
    this.getUserAddress();
    district().then(res => {
      this.district = res.data;
    });
  },
  methods: {
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
          if (that.id) that.$dialog.toast({ mes: "修改成功" });
          else that.$dialog.toast({ mes: "添加成功" });
          that.$yrouter.go(-1);
        });
      } catch (e) {
        this.$dialog.error(e.msg);
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
