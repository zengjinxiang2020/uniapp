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
				<!-- <view class="picker acea-row row-between-wrapper select-value form-control">
					  <view class="address">
						<CitySelect ref="cityselect" :defaultValue="defaultAddress" @callback="result" :items="district"></CitySelect>
					  </view>
					  <view class="iconfont icon-dizhi font-color-red"></view>
				</view> -->
				<view class="center-input-input" @click="toPosition">
					<input name="houseAddress" id="houseAddress" v-model="houseAddress" placeholder="点击选择收货地址"
						placeholder-style="color:#a4a4a4;" type="text" maxlength="100" disabled></input>
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
							<checkbox :value="userAddress.isDefault == 1 ? 'checked' : ''"
								:checked="userAddress.isDefault ? true : false"></checkbox>
							<text class="def">设置为默认地址</text>
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>
		<view></view>
		<view class="keepBnt bg-color-red" @tap="submit">立即保存</view>
		<!-- <view class="wechatAddress" v-if="isWechat && !id" @click="getAddress">导入微信地址</view> -->
	</view>
</template>

<script type="text/babel">
	import CitySelect from '@/components/CitySelect'
import { getAddress, postAddress, getCity } from '@/api/user'
import attrs, { required, chs_phone } from '@/utils/validate'
import { validatorDefaultCatch } from '@/utils/dialog'
// import { openAddress } from "@/libs/wechat";
import { isWeixin } from '@/utils'

export default {
  name: 'AddAddress',
  components: {
    CitySelect,
  },
  data() {
    return {
		district: [],
		id: 0,
		userAddress: { isDefault: 0 },
		address: {
			province: null,
			city: null,
			district: null
		},
		isWechat: isWeixin(),
		defaultAddress: {},
		addressText: '',
		houseAddress: ''
    }
  },
  mounted: function() {
    let id = this.$yroute.query.id
    this.id = id
    this.getUserAddress()
    this.getCityList()
  },
  watch: {
    addressText(nextModel2) {
      console.log(nextModel2, 8585858585)
    },
  },
  methods: {
		setCityId() {
	        this.district.map(province => {
				if (province.n == this.address.province) {
					province.c.map(city => {
						if (city.n == this.address.city) {
							this.address.city_id = city.v
						}
					})
				}
			}) 
		},
	  getCityList: function() {
			let that = this
			getCity()
			  .then(res => {
				that.district = res.data
				that.ready = true
				that.setCityId()
			  })
			  .catch(err => {
				uni.showToast({
				  title: err.msg,
				  icon: 'none',
				  duration: 2000,
				})
			})
	},
	  
	toPosition:function(e){
	    let that = this;
			
	    uni.chooseLocation({
			success: function (res) {
				console.log("chooseLocation");
				console.log(that)
				console.log(res)
				var regex = /^(北京市|天津市|重庆市|上海市|香港特别行政区|澳门特别行政区)/;  
				var province=[];  
				var addressBean = {  
					REGION_PROVINCE:null,  
					REGION_COUNTRY:null,  
					REGION_CITY:null,  
					ADDRESS:null,
				}; 
				function regexAddressBean(address, addressBean){
					regex = /^(.*?[市州]|.*?地区|.*?特别行政区)(.*?)$/g;
					console.log(address)
					var addxress = regex.exec(address);  
					console.log(addxress);
					that.address.city=addxress[1];  
					that.address.district=addxress[2] + res.name;  
					that.houseAddress=res.name
					console.log(addxress);  
					console.log(that.houseAddress + "123");  
				}  
				if(!(province = regex.exec(res.address))){  
					console.log("chooseLocation1");
					regex = /^(.*?(省|自治区))(.*?)$/;  
					province = regex.exec(res.address);  
					console.log(province);
					that.address.province= province[1];  
					console.log(that.address.province);
					regexAddressBean(province[3],that.address);  
				} else {  
					console.log("chooseLocation2");
					that.address.province= province[1];  
					regexAddressBean(res.address, that.address);  
				}   
				console.log("success")
				console.log(res)
				that.houseAddress = res.address + res.name
				console.log(that.houseAddress)
				this.getCityList()
			},
			complete: function (res) {
				//that.houseAddress = res.address + res.name
			},
			cancel: function (res) {
			},
			fail: function (res) {
				console.log(res)
			}
	    })
	},
    getUserAddress: function() {
      if (!this.id) return false
      let that = this
      getAddress(that.id).then(res => {
        that.userAddress = res.data
        that.defaultAddress = {
          province: {
            n: res.data.province,
          },
          city: {
            n: res.data.city,
          },
          district: {
            n: res.data.district,
          },
        }
        // that.addressText = res.data.province + ' ' + res.data.city + ' ' + res.data.district
        that.houseAddress = res.data.province + res.data.city + res.data.district
        that.address.province = res.data.province
        that.address.city = res.data.city
        that.address.district = res.data.district
      })
    },
    // getAddress() {},
    async submit() {
      let name = this.userAddress.realName,
        phone = this.userAddress.phone,
        // addressText = this.addressText,
        houseAddress = this.houseAddress,
        detail = this.userAddress.detail,
        isDefault = this.userAddress.isDefault
      try {
        await this.$validator({
          name: [required(required.message('姓名')), attrs.range([2, 16], attrs.range.message('姓名'))],
          phone: [required(required.message('联系电话')), chs_phone(chs_phone.message())],
          // addressText: [required('请选择地址')],
          houseAddress: [required('请选择地址')],
          detail: [required(required.message('具体地址'))],
        }).validate({ name, phone, houseAddress, detail })
      } catch (e) {
        return validatorDefaultCatch(e)
      }
      try {
        let that = this,
			
          data = {
            id: that.id,
            real_name: name,
            phone: phone,
            address: this.address,
            detail: detail,
            is_default: isDefault ? true : false,
            post_code: '',
          }
        postAddress(data).then(function() {
          if (that.id) {
            uni.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000,
            })
          } else {
            uni.showToast({
              title: '操作成功',
              icon: 'none',
              duration: 2000,
            })
            // uni.showToast({
            //   title: "已取消绑定",
            //   icon: "none",
            //   duration: 2000
            // });
            // that.$yrouter.replace({
            //   path: "/pages/user/PersonalData/index"
            // });
          }
          that.$yrouter.back()
        })
      } catch (err) {
        uni.showToast({
          title: err.msg || err.response.data.msg || err.response.data.message,
          icon: 'none',
          duration: 2000,
        })
      }
    },
    ChangeIsDefault: function() {
      this.userAddress.isDefault = !this.userAddress.isDefault
    }
  },
}
</script>

<style lang="less">
	.address {
		text {
			width: 100%;
			display: block;
		}
	}
</style>
