<template>
	<view class="order-submission">
		<view class="allAddress" :style="systemStore ? '' : 'padding-top: 0.2*100rpx'">
			<view class="nav acea-row">
				<view class="item font-color-red" :class="shipping_type === 0 ? 'on' : 'on2'" @click="addressType(0)"
					v-if="systemStore"></view>
				<view class="item font-color-red" :class="shipping_type === 1 ? 'on' : 'on2'" @click="addressType(1)"
					v-if="systemStore && !isIntegral"></view>
				<view class="item font-color-red" :class="shipping_type === 2 ? 'on' : 'on2'" @click="addressType(2)"
					v-if="systemStore"></view>
			</view>
			<view class="address acea-row row-between-wrapper" v-if="shipping_type === 0||shipping_type === 2 "
				@click="addressTap">
				<view class="addressCon" v-if="addressInfo.realName">
					<view class="name">
						{{ addressInfo.realName }}
						<text class="phone">{{ addressInfo.phone }}</text>
					</view>
					<view>
						<text class="default font-color-red" v-if="addressInfo.isDefault">[默认]</text>
						{{calFullAddress}}
					</view>
				</view>
				<view class="addressCon" v-else>
					<view class="setaddress">设置收货地址</view>
				</view>
				<view class="iconfont icon-jiantou"></view>
			</view>
			<view class="address acea-row row-between-wrapper" v-if="shipping_type === 1" @click="showStoreList">
				<view class="addressCon" v-if="storeItems">
					<view class="name">
						{{ storeItems.name }}
						<span class="phone">{{ storeItems.phone }}</span>
					</view>
					<view>{{ storeItems.address }}</view>
				</view>
				<view class="addressCon" v-else>
					<view class="name">
						{{ systemStore.name }}
						<span class="phone">{{ systemStore.phone }}</span>
					</view>
					<view>{{ systemStore.address }}</view>
				</view>
				<view class="iconfont icon-jiantou"></view>
			</view>
			<view class="line">
				<image :src="`${$VUE_APP_RESOURCES_URL}/images/line.jpg`" />
			</view>
		</view>
		<OrderGoods :evaluate="0" :isIntegral="isIntegral" :cartInfo="orderGroupInfo.cartInfo"></OrderGoods>
		<view class="wrapper">
			<view class="item acea-row row-between-wrapper" @click="couponTap"
				v-if="deduction === false && !isIntegral">
				<view>优惠券</view>
				<view class="discount">
					{{ usableCoupon.couponTitle || '请选择' }}
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class="item acea-row row-between-wrapper"
				v-if="!isIntegral && deduction === false && enableIntegral === true">
				<view>积分抵扣</view>
				<view class="discount">
					<view class="select-btn">
						<view class="checkbox-wrapper">
							<!-- <input type="checkbox" v-model="useIntegral" @click="changeUseIntegral"/> -->
							<checkbox-group @change="changeUseIntegral">
								<label class="well-check">
									<text class="integral">
										当前积分
										<text class="num font-color-red">{{ userInfo.integral || 0 }}</text>
									</text>
									<checkbox value="true" :checked="useIntegral ? true : false"></checkbox>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="shipping_type === 0 || shipping_type === 2">
				<view>快递费用</view>
				<view class="discount">
					{{ orderPrice.payPostage > 0 ? orderPrice.payPostage : '免运费' }}
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="shipping_type === 2">
				<view>配送价格</view>
				<view class="discount">
					{{distance}}
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="shipping_type === 2" @click="timeisShow = true">
				<view>送达时间</view>
				<view class="discount" v-if="date === null">尽快送达</view>
				<view class="discount" v-else-if="date !== null">{{date}}</view>
				<text class="iconfont icon-jiantou"></text>
				<hTimeAlert title="预约时间" rangeDay="5" disabled="0,2" :timeisShow="timeisShow" @closeAlert="handelClose">
				</hTimeAlert>

			</view>
			<view v-if="shipping_type === 1">
				<view class="item acea-row row-between-wrapper">
					<view>联系人</view>
					<view class="discount">
						<input type="text" placeholder="请填写您的联系姓名" v-model="contacts" />
					</view>
				</view>
				<view class="item acea-row row-between-wrapper">
					<view>联系电话</view>
					<view class="discount">
						<input type="text" placeholder="请填写您的联系电话" v-model="contactsTel" />
					</view>
				</view>
			</view>
			<view class="item">
				<view>备注信息（150字以内）</view>
				<textarea v-model="mark"></textarea>
			</view>
		</view>
		<view class="wrapper">
			<view class="item">
				<view>支付方式</view>
				<view class="list">
					<view class="payItem acea-row row-middle" v-if="!isIntegral"
						:class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')" v-show="isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>
							微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="!isIntegral"
						:class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')" v-show="!isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>
							微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="!isIntegral" :class="active === 'yue' ? 'on' : ''"
						@click="payItem('yue')">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-icon-test" :class="active === 'yue' ? 'bounceIn' : ''"></view>
							余额支付
						</view>
						<view class="tip">可用余额：{{ userInfo.nowMoney || 0 }}</view>
					</view>
					<view class="payItem acea-row row-middle" v-if="isIntegral"
						:class="active === 'integral' ? 'on' : ''" @click="payItem('integral')">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-icon-test" :class="active === 'integral' ? 'bounceIn' : ''">
							</view>积分支付
						</view>
						<view class="tip">可用积分：{{ userInfo.integral || 0 }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="wrapper">
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.totalPrice !== undefined">
				<view>商品总价：</view>
				<view class="discount" v-if="!isIntegral">￥{{ orderPrice.totalPrice }}</view>
				<view class="discount" v-if="isIntegral">{{ orderPrice.payIntegral }}积分</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.payPostage > 0 && !isIntegral">
				<view>运费：</view>
				<view class="discount">￥{{ orderPrice.payPostage }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.couponPrice > 0 && !isIntegral">
				<view>优惠券抵扣：</view>
				<view class="discount">-￥{{ orderPrice.couponPrice }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.deductionPrice > 0 && !isIntegral">
				<view>积分抵扣：</view>
				<view class="discount">-￥{{ orderPrice.deductionPrice }}</view>
			</view>
			<view class="item acea-row row-between-wrapper">
				<view>积分抵扣：</view>
				<view class="discount"></view>
			</view>
		</view>
		<!-- 		<view style="height: 120rpx"></view> -->
		<view class="footer acea-row row-between-wrapper">
			<view>
				合计:
				<text class="font-color-red" v-if="!isIntegral">￥{{ orderPrice.payPrice }}</text>
				<text class="font-color-red" v-if="isIntegral">{{ orderPrice.payIntegral }}积分</text>
			</view>
			<view class="settlement" @click="createOrder">立即结算</view>
		</view>
		<CouponListWindow v-on:couponchange="changecoupon($event)" v-model="showCoupon" :price="orderPrice.totalPrice"
			:checked="usableCoupon.id" @checked="changeCoupon" :cartid="cartid"></CouponListWindow>
		<AddressWindow @checked="changeAddress" @redirect="addressRedirect" v-model="showAddress"
			:checked="addressInfo.id" ref="mychild"></AddressWindow>
	</view>
</template>

<script>
	import OrderGoods from '@/components/OrderGoods'
	import CouponListWindow from '@/components/CouponListWindow'
	import AddressWindow from '@/components/AddressWindow'
	import hTimeAlert from '@/components/h-time-alert/h-time-alert.vue'
	import {
		getAddressList,
	} from "@/api/user"
	import {
		postOrderConfirm,
		postOrderComputed,
		createOrder
	} from '@/api/order'
	import {
		mapGetters
	} from 'vuex'
	import {
		handleOrderPayResults,
		subscribeMessage
	} from '@/libs/order'
	import {
		weappPay
	} from '@/libs/wechat'
	import {
		isWeixin,
		handleErrorMessage
	} from '@/utils'

	var QQMapWX = require('../../../libs/qqmap-wx-jssdk.js');
	var qqmapsdk = new QQMapWX({
		key: 'AREBZ-IUBOU-4PBV2-BQ36N-OLZK6-24FKC' // 必填
	});
	const NAME = 'OrderSubmission',
		_isWeixin = isWeixin()
	export default {
		name: NAME,
		components: {
			OrderGoods,
			CouponListWindow,
			AddressWindow,
			hTimeAlert
		},
		props: {},
		data: function() {
			return {
				offlinePayStatus: 2,
				from: this.$deviceType,
				deduction: true,
				enableIntegral: true,
				enableIntegralNum: 0,
				isWeixin: _isWeixin,
				pinkId: 0,
				active: _isWeixin ? 'yue' : 'weixin',
				showCoupon: false,
				deliveryTime: false,
				showAddress: false,
				addressInfo: {},
				couponId: 0,
				orderGroupInfo: {
					priceGroup: {},
				},
				usableCoupon: {},
				addressLoaded: false,
				useIntegral: false,
				orderPrice: {
					payPrice: '计算中',
				},
				mark: '',
				systemStore: {},
				shipping_type: 0,
				contacts: '',
				contactsTel: '',
				storeSelfMention: 0,
				cartid: '',
				date: null,
				isIntegral: false,
				timeisShow: false,
				maskHide: false,
				closeBtn: false,
				rangeType: false,
				distance: 100,
				longitude: null, //经度
				latitude: null, //纬度
				fullAddress: null
			}
		},	
		computed: {
			...mapGetters(['userInfo', 'storeItems']),
			calFullAddress: {
				get() {
					var calFullAddress = this.addressInfo.province + this.addressInfo.city + this.addressInfo
						.district + this
						.addressInfo.detail;
					this.fullAddress = calFullAddress
					return calFullAddress
				},
				set(value) {
					var calFullAddress = this.addressInfo.province + this.addressInfo.city + this.addressInfo
						.district + this
						.addressInfo.detail;
					this.fullAddress = calFullAddress
				}
			}
		},
		// computed: mapGetters(['userInfo', 'storeItems']),
		watch: {
			useIntegral() {
				this.computedPrice()
			},
			shipping_type() {
				this.computedPrice()
			},
		},
		onLoad: function() {
			let that = this
			this.$store.dispatch('getUser', true)
			that.getCartInfo()

			console.log(that.$yroute)
			if (that.$yroute.query.pinkid !== undefined) {
				that.pinkId = that.$yroute.query.pinkid
			}
			this.isIntegral = that.$yroute.query.isIntegral == 'true'
			this.useIntegral = this.isIntegral
			if (this.isIntegral) {
				this.active = 'integral'
			}
			if (that.$yroute.query.id !== undefined) {
				that.cartid = that.$yroute.query.id
				console.log(that.cartid)
			}

			// that.getSetting()
			that.getLocation()

			// that.findShop()
			// that.formSubmit()
		},
		methods: {
			getLocation() {
				var that = this
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log("getLocation ing")
						that.longitude = res.longitude
						that.latitude = res.latitude
						console.log('当前位置的经度：' + that.longitude)
						console.log('当前位置的纬度：' + that.latitude)
						that.formSubmit()
					},
					fail: function(res) {
						console.error("getLocation失败" + res.errMsg)
					},
				});
			},
			formSubmit() {
				var that = this
				var address = '北京市海淀区彩和坊路海淀西大街74号'
				console.log(address)
				console.log("calFullAddress" + that.calFullAddress)
				console.log("fullAddress" + that.fullAddress)
				console.log(that.addressInfo)

				console.log(this)
				console.log(that)
				//调用地址解析接口
				qqmapsdk.geocoder({
					//获取表单传入地址
					address: that.calFullAddress, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
					success: res => { //成功后的回调
						console.log("geocoder")
						console.log(res)
						var res = res.result
						that.latitude = res.location.lat
						that.longitude = res.location.lng
						console.log('收货地址的经度：' + that.longitude)
						console.log('收货地址的纬度：' + that.latitude)
						console.log("calFullAddress" + that.calFullAddress)
						console.log("fullAddress" + that.fullAddress)
						that.findShop()
						//根据地址解析在地图上标记解析地址位置
						// that.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
						// 	markers: [{
						// 		id: 0,
						// 		title: res.title,
						// 		latitude: latitude,
						// 		longitude: longitude,
						// 		iconPath: './resources/placeholder.png', //图标路径
						// 		width: 20,
						// 		height: 20,
						// 		callout: { //可根据需求是否展示经纬度
						// 			content: latitude + ',' + longitude,
						// 			color: '#000',
						// 			display: 'ALWAYS'
						// 		}
						// 	}],
						// 	poi: { //根据自己data数据设置相应的地图中心坐标变量名称
						// 		latitude: latitude,
						// 		longitude: longitude
						// 	}
						// });
					},
					fail: function(error) {
						console.error(error)
					},
					complete: function(res) {
						console.log(res)
					}
				})
			},
			findShop() { //拿到商家的地理位置，用到了腾讯地图的api
				var that = this
				console.log("findshop")

				//调用距离计算接口
				qqmapsdk.calculateDistance({
					mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
					//from参数不填默认当前地址
					//获取表单提交的经纬度并设置from和to参数（示例为string格式）
					from: {
						latitude: that.latitude, //商家的纬度
						longitude: that.longitude, //商家的经度/
					}, //若起点有数据则采用起点坐标，若为空默认当前地址
					to: [{
						latitude: 22.914751, //商家的纬度
						longitude: 114.083267, //商家的经度
					}], //终点坐标
					success: function(res) { //成功后的回调
						console.log("成功" + res);
						console.log(res);
						// var dis = [];
						// for (var i = 0; i < res.result.elements.length; i++) {
						// 	dis.push(res.result.elements[i].distance); //将返回数据存入dis数组，
						// }
						that.distance = res.result.elements[0].distance //将返回数据存入dis数组，
						// that.distance = dis[0]
						// console.log("dis.length" + dis.length);
						console.log("res.elements.length" + res.result.elements.length);
						console.log("that.distance" + that.distance);
					},
					fail: function(res) {
						console.error("失败" + res.status);
					},
					complete: function(res) {
						console.log("完成" + res);
					}
				});
			},
			showMask() {
				this.timeisShow = true;
				console.log(this.timeisShow);
			},

			handelClose(data) {
				this.timeisShow = false;
				console.log(data.date);
				this.date = data.date;
				//data={
				//  date: "2020/3/30 09:00"
				//  _date: "2020-3-30 09:00"
				//  dateRange: "2020/3/30 09:00-09:30"
				//  _dateRange: "2020-3-30 09:00-09:30"
				//  timeStamp: 1585530000000
				// }
				return date
			},
			showStoreList() {
				this.$store.commit('get_to', 'orders')
				this.$yrouter.push({
					path: '/pages/shop/StoreList/index',
				})
			},
			addressType: function(index) {
				if (index && !this.systemStore.id) {
					uni.showToast({
						title: '暂无门店信息，您无法选择到店自提！',
						icon: 'none',
						duration: 2000,
					})
					return
				}
				console.log(this)
				this.shipping_type = index
			},
			changeUseIntegral: function(e) {
				// this.computedPrice();
				if (this.isIntegral) {
					return
				}
				this.useIntegral = e.mp.detail.value[0]
			},
			// 计算商品价格
			computedPrice() {
				let shipping_type = this.shipping_type
				postOrderComputed(this.orderGroupInfo.orderKey, {
					addressId: this.addressInfo.id,
					useIntegral: this.useIntegral ? 1 : 0,
					couponId: this.usableCoupon.id || 0,
					shipping_type: parseInt(shipping_type) + 1,
				}).then(res => {
					const data = res.data
					if (data.status === 'EXTEND_ORDER') {
						this.$yrouter.replace({
							path: '/pages/order/OrderDetails/index',
							query: {
								id: data.result.orderId,
							},
						})
					} else {
						this.orderPrice = data.result
					}
				})
			},
			getCartInfo() {
				let cartIds = this.$yroute.query.id
				// 拼团id
				if (this.$yroute.query.pinkId) {
					cartIds = this.$yroute.query.pinkId
				}
				if (!cartIds) {
					uni.showToast({
						title: '参数有误',
						icon: 'none',
						duration: 2000,
					})
					return this.$yrouter.back()
				}
				postOrderConfirm(cartIds)
					.then(res => {
						this.offlinePayStatus = res.data.offline_pay_status
						this.orderGroupInfo = res.data
						this.deduction = res.data.deduction
						this.usableCoupon = res.data.usableCoupon || {}
						this.addressInfo = res.data.addressInfo || {}
						// 用来显示到店自提的店铺地址
						this.systemStore = res.data.systemStore || {}
						this.storeSelfMention = res.data.storeSelfMention
						this.computedPrice()
					})
					.catch((error) => {
						console.log(error)
						uni.showToast({
							title: '加载订单数据失败',
							icon: 'none',
							duration: 2000,
						})
					})
			},
			addressTap: function() {
				this.showAddress = true
				if (!this.addressLoaded) {
					this.addressLoaded = true
					this.$refs.mychild.getAddressList()
				}
			},
			addressRedirect() {
				this.addressLoaded = false
				this.showAddress = false
			},
			couponTap: function() {
				this.showCoupon = true
			},
			timeTap: function() {
				this.deliveryTime = true
			},
			changeCoupon: function(coupon) {
				if (!coupon) {
					this.usableCoupon = {
						couponTitle: '不使用优惠券',
						id: 0,
					}
				} else {
					this.usableCoupon = coupon
				}
				this.computedPrice()
			},
			showTime: function(event) {
				console.log("日历");
			},
			payItem: function(index) {
				this.active = index
			},
			changeAddress(addressInfo) {
				this.addressInfo = addressInfo
				this.computedPrice()
				this.getLocation()
			},
			createOrder() {
				subscribeMessage()
				// 送达时间限制
				if (this.shipping_type === 2) {
					if (this.date === null) {
						uni.showToast({
							title: '请填写时间段',
							icon: 'none',
							duration: 2000,
						})
						return
					}
				}
				if (this.isIntegral) {
					// 积分支付
					if (this.userInfo.integral < this.orderPrice.payIntegral) {
						uni.showToast({
							title: '积分不足',
							icon: 'none',
							duration: 2000,
						})
						return
					}
					this.active = 'integral'
				}
				let shipping_type = this.shipping_type
				if (!this.isIntegral && !this.active) {
					uni.showToast({
						title: '请选择支付方式',
						icon: 'none',
						duration: 2000,
					})
					return
				}
				if (!this.addressInfo.id && !this.shipping_type) {
					uni.showToast({
						title: '请选择收货地址',
						icon: 'none',
						duration: 2000,
					})
					return
				}

				if (this.shipping_type === 1) {
					if ((this.contacts === '' || this.contactsTel === '') && this.shipping_type) {
						console.log("*****")
						uni.showToast({
							title: '请填写联系人或联系人电话',
							icon: 'none',
							duration: 2000,
						})
						return
					}

					if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.contactsTel)) {
						uni.showToast({
							title: '请填写正确的手机号',
							icon: 'none',
							duration: 2000,
						})
						return
					}
					if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(this.contacts)) {
						uni.showToast({
							title: '请填写您的真实姓名',
							icon: 'none',
							duration: 2000,
						})
						return
					}
				}

				uni.showLoading({
					title: '生成订单中',
				})
				let from = {}
				if (this.$deviceType == 'app') {
					from.from = 'app'
				}
				console.log(this.$deviceType)
				// #ifdef MP-WEIXIN
				subscribeMessage()
				// #endif
				createOrder(this.orderGroupInfo.orderKey, {
						realName: this.contacts,
						phone: this.contactsTel,
						addressId: this.addressInfo.id,
						useIntegral: this.useIntegral ? 1 : 0,
						couponId: this.usableCoupon.id || 0,
						payType: this.active,
						pinkId: this.pinkId,
						seckillId: this.orderGroupInfo.seckill_id,
						combinationId: this.orderGroupInfo.combination_id,
						bargainId: this.orderGroupInfo.bargain_id,
						from: this.from,
						mark: this.mark || '',
						shippingType: parseInt(shipping_type) + 1,
						storeId: this.storeItems ? this.storeItems.id : this.systemStore.id,
						...from,
					})
					.then(res => {
						uni.hideLoading()
						handleOrderPayResults.call(this, res.data, 'create', this.active)
					})
					.catch(err => {
						handleErrorMessage(err, '创建订单失败')
					})
			},
		},
	}
</script>

<style scoped lang="less">
	.order-submission .wrapper .shipping select {
		color: #999;
		padding-right: 0.15 * 100rpx;
	}

	.order-submission .wrapper .shipping .iconfont {
		font-size: 0.3 * 100rpx;
		color: #515151;
	}

	.order-submission .allAddress {
		width: 100%;
		background-image: linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
		background-image: -webkit-linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
		background-image: -moz-linear-gradient(to bottom, #eb3729 0%, #eb3729 100%);
		padding-top: 1 * 100rpx;
	}

	.order-submission .allAddress .nav {
		margin: 0 auto;
		padding: 0 30rpx;
		width: 100%;
		box-sizing: border-box;
	}

	.order-submission .allAddress .nav .item {
		flex: 1;
		position: relative;
	}

	.order-submission .allAddress .nav .item.on {
		position: relative;
	}

	.order-submission .allAddress .nav .item.on:before {
		position: absolute;
		bottom: 0;
		content: '快递配送';
		font-size: 0.28 * 100rpx;
		display: block;
		height: 0;
		left: 0;
		right: 0;
		border-width: 0.4 * 100rpx;
		border-style: solid;
		border-color: #fff;
		z-index: 9;
		text-align: center;
		line-height: 0.14 * 100rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(2).on:before {
		content: '到店自提';
		border-width: 0.4 * 100rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(3).on:before {
		content: '同城配送';
		border-width: 0.4 * 100rpx;
	}

	.order-submission .allAddress .nav .item.on2 {
		position: relative;
	}

	.order-submission .allAddress .nav .item.on2:before {
		position: absolute;
		bottom: 0;
		content: '到店自提';
		font-size: 0.28 * 100rpx;
		display: block;
		height: 0;
		left: 0;
		right: 0;
		border-width: 0.4 * 100rpx;
		border-style: solid;
		border-color: #d5e6e6;
		text-align: center;
		line-height: 0.14 * 100rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(3).on2:before {
		position: absolute;
		bottom: 0;
		content: '同城配送';
		font-size: 28rpx;
		display: block;
		height: 0;
		left: 0;
		right: 0;
		border-width: 40rpx;
		border-style: solid;
		border-color: #d5e6e6;
		text-align: center;
		line-height: 14rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(1).on2:before {
		content: '快递配送';
		border-width: 0.4 * 100rpx;
	}

	.order-submission .allAddress .address {
		width: 6.91 * 100rpx;
		height: 1.5 * 100rpx;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.order-submission .allAddress .line {
		width: 7.1 * 100rpx;
		margin: 0 auto;
	}

	.order-submission .wrapper .item .discount input::placeholder {
		color: #ccc;
	}
</style>
