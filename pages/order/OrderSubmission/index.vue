<template>
	<view class="order-submission">
		<view class="allAddress">
			<view class="nav acea-row">
				<view class="item font-color-red" :class="shipping_type === 0 ? 'on' : 'on2'" @click="addressType(0)"></view>
				<view class="item font-color-red" :class="shipping_type === 1 ? 'on' : 'on2'" @click="addressType(1)" v-if="storeSelfMention"></view>
			</view>
			<view class="address acea-row row-between-wrapper" v-if="shipping_type === 0" @click="addressTap">
				<view class="addressCon" v-if="addressInfo.realName">
					<view class="name">
						{{ addressInfo.realName }}
						<text class="phone">{{ addressInfo.phone }}</text>
					</view>
					<view>
						<text class="default font-color-red" v-if="addressInfo.isDefault">[默认]</text>
						{{ addressInfo.province }}{{ addressInfo.city
            }}{{ addressInfo.district }}{{ addressInfo.detail }}
					</view>
				</view>
				<view class="addressCon" v-else>
					<view class="setaddress">设置收货地址</view>
				</view>
				<view class="iconfont icon-jiantou"></view>
			</view>
			<!--<view class="address acea-row row-between-wrapper" v-else>-->
			<!--<view class="addressCon">-->
			<!--<view class="name">-->
			<!--{{ systemStore.name }}-->
			<!--<text class="phone">{{ systemStore.phone }}</text>-->
			<!--</view>-->
			<!--<view>-->
			<!--{{ systemStore._detailed_address }}-->
			<!--</view>-->
			<!--</view>-->
			<!--</view>-->
			<view class="line">
				<image :src="$VUE_APP_RESOURCES_URL+'/images/line.jpg'" />
			</view>
		</view>
		<OrderGoods :evaluate="0" :cartInfo="orderGroupInfo.cartInfo"></OrderGoods>
		<view class="wrapper">
			<view class="item acea-row row-between-wrapper" @click="couponTap" v-if="deduction === false">
				<view>优惠券</view>
				<view class="discount">
					{{ usableCoupon.couponTitle || "请选择" }}
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="deduction === false">
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
									<checkbox value :checked="useIntegral ? true : false"></checkbox>
								</label>
							</checkbox-group>
						</view>
					</view>
				</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="shipping_type === 0">
				<view>快递费用</view>
				<view class="discount">
					{{
          orderGroupInfo.priceGroup.storePostage > 0
          ? orderGroupInfo.priceGroup.storePostage
          : "免运费"
          }}
				</view>
			</view>
			<view v-else>
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
				<view>备注信息</view>
				<textarea placeholder="请添加备注（150字以内）" v-model="mark"></textarea>
			</view>
		</view>
		<view class="wrapper">
			<view class="item">
				<view>支付方式</view>
				<view class="list">
					<view class="payItem acea-row row-middle" :class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')"
					 v-show="isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" :class="active === 'weixin' ? 'on' : ''" @click="payItem('weixin')"
					 v-show="!isWeixin">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-weixin2" :class="active === 'weixin' ? 'bounceIn' : ''"></view>微信支付
						</view>
						<view class="tip">微信快捷支付</view>
					</view>
					<view class="payItem acea-row row-middle" :class="active === 'yue' ? 'on' : ''" @click="payItem('yue')">
						<view class="name acea-row row-center-wrapper">
							<view class="iconfont icon-icon-test" :class="active === 'yue' ? 'bounceIn' : ''"></view>余额支付
						</view>
						<view class="tip">可用余额：{{ userInfo.nowMoney || 0 }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="moneyList">
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.totalPrice !== undefined">
				<view>商品总价：</view>
				<view class="money">￥{{ orderPrice.totalPrice }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.payPostage > 0">
				<view>运费：</view>
				<view class="money">￥{{ orderPrice.payPostage }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.couponPrice > 0">
				<view>优惠券抵扣：</view>
				<view class="money">-￥{{ orderPrice.couponPrice }}</view>
			</view>
			<view class="item acea-row row-between-wrapper" v-if="orderPrice.deductionPrice > 0">
				<view>积分抵扣：</view>
				<view class="money">-￥{{ orderPrice.deductionPrice }}</view>
			</view>
		</view>
		<view style="height:120rpx"></view>
		<view class="footer acea-row row-between-wrapper">
			<view>
				合计:
				<text class="font-color-red">￥{{ orderPrice.payPrice }}</text>
			</view>
			<view class="settlement" @click="createOrder">立即结算</view>
		</view>
		<CouponListWindow v-on:couponchange="changecoupon($event)" v-model="showCoupon" :price="orderPrice.totalPrice"
		 :checked="usableCoupon.id" @checked="changeCoupon"></CouponListWindow>
		<AddressWindow @checked="changeAddress" @redirect="addressRedirect" v-model="showAddress" :checked="addressInfo.id"
		 ref="mychild"></AddressWindow>
	</view>
</template>
<style scoped lang="less">
	.order-submission .wrapper .shipping select {
		color: #999;
		padding-right: 0.15*100rpx;
	}

	.order-submission .wrapper .shipping .iconfont {
		font-size: 0.3*100rpx;
		color: #515151;
	}

	.order-submission .allAddress {
		width: 100%;
		background-image: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
		background-image: -webkit-linear-gradient(to bottom,
			#e93323 0%,
			#f5f5f5 100%);
		background-image: -moz-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
		padding-top: 0.2*100rpx;
	}

	.order-submission .allAddress .nav {
		width: 7.1*100rpx;
		margin: 0 auto;
	}

	.order-submission .allAddress .nav .item {
		width: 3.55*100rpx;
	}

	.order-submission .allAddress .nav .item.on {
		position: relative;
		width: 2.5*100rpx;
	}

	.order-submission .allAddress .nav .item.on:before {
		position: absolute;
		bottom: 0;
		/*content: "快递配送";*/
		font-size: 0.28*100rpx;
		display: block;
		height: 0;
		width: 3.55*100rpx;
		border-width: 0 0.2*100rpx 0.8*100rpx 0;
		border-style: none solid solid;
		border-color: transparent transparent #fff;
		z-index: 9;
		border-radius: 0.07*100rpx 0.3*100rpx 0 0;
		text-align: center;
		line-height: 0.8*100rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(2).on:before {
		content: "到店自提";
		border-width: 0 0 0.8*100rpx 0.2*100rpx;
		border-radius: 0.3*100rpx 0.07*100rpx 0 0;
	}

	.order-submission .allAddress .nav .item.on2 {
		position: relative;
	}

	.order-submission .allAddress .nav .item.on2:before {
		position: absolute;
		bottom: 0;
		content: "到店自提";
		font-size: 0.28*100rpx;
		display: block;
		height: 0;
		width: 4.6*100rpx;
		border-width: 0 0 0.6*100rpx 0.6*100rpx;
		border-style: none solid solid;
		border-color: transparent transparent #f7c1bd;
		border-radius: 0.4*100rpx 0.06*100rpx 0 0;
		text-align: center;
		line-height: 0.6*100rpx;
	}

	.order-submission .allAddress .nav .item:nth-of-type(1).on2:before {
		content: "快递配送";
		border-width: 0 0.6*100rpx 0.6*100rpx 0;
		border-radius: 0.06*100rpx 0.4*100rpx 0 0;
	}

	.order-submission .allAddress .address {
		box-sizing: border-box;
		width: 100%;
		height: 1.5*100rpx;
		margin: 0 auto;
	}

	.order-submission .allAddress .line {
		box-sizing: border-box;
		width: 100%;
		margin: 0 auto;
	}

	.order-submission .wrapper .item .discount input::placeholder {
		color: #ccc;
	}
</style>
<script>
	import OrderGoods from "@/components/OrderGoods";
	import CouponListWindow from "@/components/CouponListWindow";
	import AddressWindow from "@/components/AddressWindow";
	import {
		postOrderConfirm,
		postOrderComputed,
		createOrder
	} from "@/api/order";
	import {
		mapGetters
	} from "vuex";
	import {
		weappPay
	} from "@/libs/wechat";
	import {
		isWeixin
	} from "@/utils";

	const NAME = "OrderSubmission",
		_isWeixin = isWeixin();
	export default {
		name: NAME,
		components: {
			OrderGoods,
			CouponListWindow,
			AddressWindow
		},
		props: {},
		data: function() {
			return {
				offlinePayStatus: 2,
				from: "routine",
				// from: _isWeixin ? "weixin" : "weixinh5",
				deduction: true,
				isWeixin: _isWeixin,
				pinkId: 0,
				active: "weixin",
				showCoupon: false,
				showAddress: false,
				addressInfo: {},
				couponId: 0,
				orderGroupInfo: {
					priceGroup: {}
				},
				usableCoupon: {},
				addressLoaded: false,
				useIntegral: false,
				orderPrice: {
					payPrice: "计算中"
				},
				mark: "",
				system_store: {},
				shipping_type: 0,
				contacts: "",
				contactsTel: "",
				store_self_mention: 0
			};
		},
		computed: mapGetters(["userInfo"]),
		watch: {
			useIntegral() {
				this.computedPrice();
			},
			$yroute(n) {
				if (n.name === NAME) this.getCartInfo();
			},
			shipping_type() {
				this.computedPrice();
			}
		},
		mounted: function() {
			let that = this;
			that.getCartInfo();
			if (that.$yroute.query.pinkid !== undefined)
				that.pinkId = that.$yroute.query.pinkid;
		},
		methods: {
			addressType: function(index) {
				if (index && !this.system_store.id) {
					uni.showToast({
						title: "暂无门店信息，您无法选择到店自提！",
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.shipping_type = index;
			},
			changeUseIntegral: function(e) {
				// this.computedPrice();
				this.useIntegral = e.mp.detail.value[0];
			},
			computedPrice() {
				let shipping_type = this.shipping_type;
				postOrderComputed(this.orderGroupInfo.orderKey, {
					addressId: this.addressInfo.id,
					useIntegral: this.useIntegral ? 1 : 0,
					couponId: this.usableCoupon.id || 0,
					shipping_type: parseInt(shipping_type) + 1
				}).then(res => {
					const data = res.data;
					if (data.status === "EXTEND_ORDER") {
						this.$yrouter.replace({
							path: "/pages/order/OrderDetails/index",
							query: {
								id: data.result.orderId
							}
						});
					} else {
						this.orderPrice = data.result;
					}
				});
			},
			getCartInfo() {
				const cartIds = this.$yroute.query.id;
				if (!cartIds) {
					uni.showToast({
						title: "参数有误",
						icon: 'none',
						duration: 2000
					});
					return this.$yrouter.back();
				}
				postOrderConfirm(cartIds)
					.then(res => {
						this.offlinePayStatus = res.data.offline_pay_status;
						this.orderGroupInfo = res.data;
						this.deduction = res.data.deduction;
						this.usableCoupon = res.data.usableCoupon || {};
						this.addressInfo = res.data.addressInfo || {};
						this.system_store = res.data.system_store || {};
						this.store_self_mention = res.data.store_self_mention;
						this.computedPrice();
					})
					.catch(() => {
						uni.showToast({
							title: "加载订单数据失败",
							icon: 'none',
							duration: 2000
						});
					});
			},
			addressTap: function() {
				this.showAddress = true;
				if (!this.addressLoaded) {
					this.addressLoaded = true;
					this.$refs.mychild.getAddressList();
				}
			},
			addressRedirect() {
				this.addressLoaded = false;
				this.showAddress = false;
			},
			couponTap: function() {
				this.showCoupon = true;
			},
			changeCoupon: function(coupon) {
				if (!coupon) {
					this.usableCoupon = {
						couponTitle: "不使用优惠券",
						id: 0
					};
				} else {
					this.usableCoupon = coupon;
				}
				this.computedPrice();
			},
			payItem: function(index) {
				this.active = index;
			},
			changeAddress(addressInfo) {
				this.addressInfo = addressInfo;
			},
			createOrder() {
				let shipping_type = this.shipping_type;
				if (!this.active) {
					uni.showToast({
						title: "请选择支付方式",
						icon: 'none',
						duration: 2000
					});
					return
				}
				if (!this.addressInfo.id && !this.shipping_type) {
					uni.showToast({
						title: "请选择收货地址",
						icon: 'none',
						duration: 2000
					});
					return
				}

				if (this.shipping_type) {
					if (
						(this.contacts === "" || this.contactsTel === "") &&
						this.shipping_type
					) {
						uni.showToast({
							title: "请填写联系人或联系人电话",
							icon: 'none',
							duration: 2000
						});
						return
					}

					if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(this.contactsTel)) {
						uni.showToast({
							title: "请填写正确的手机号",
							icon: 'none',
							duration: 2000
						});
						return
					}
					if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(this.contacts)) {
						uni.showToast({
							title: "请填写您的真实姓名",
							icon: 'none',
							duration: 2000
						});
						return
					}
				}

				uni.showLoading({
					title: "生成订单中"
				});
				let form = {}
				if (this.$deviceType == 'app') {
					form.form = 'app'
				}
				console.log(this.orderGroupInfo.orderKey, {
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
						mark: this.mark || "",
						shippingType: parseInt(shipping_type) + 1,
						...form
					})
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
						mark: this.mark || "",
						shippingType: parseInt(shipping_type) + 1,
						...form
					})
					.then(res => {
						console.log(res)
						uni.hideLoading();
						const data = res.data;
						switch (data.status) {
							case "ORDER_EXIST":
							case "EXTEND_ORDER":
							case "PAY_DEFICIENCY":
							case "PAY_ERROR":
								uni.showToast({
									title: res.msg,
									icon: 'none',
									duration: 2000
								});
								this.$yrouter.replace({
									path: "/pages/order/OrderDetails/index",
									query: {
										id: data.result.orderId
									}
								});
								break;
							case "SUCCESS":
								uni.showToast({
									title: res.msg,
									icon: "none",
									duration: 2000
								});
								this.$yrouter.replace({
									path: "/pages/order/OrderDetails/index",
									query: {
										id: data.result.orderId
									}
								});
								break;
							case "WECHAT_H5_PAY":
								this.$yrouter.replace({
									path: "/pages/order/OrderDetails/index",
									query: {
										id: data.result.orderId
									}
								});
								setTimeout(() => {
									// location.href = data.result.jsConfig.mweb_url;
								}, 100);
								break;
							case "WECHAT_PAY":
								weappPay(data.result.jsConfig).then(res => {
									console.log(res)
									this.$yrouter.replace({
										path: "/pages/order/OrderDetails/index",
										query: {
											id: data.result.orderId
										}
									});
								});

								// 下面为原先微信支付方式，
								// pay(data.result.jsConfig).finally(() => {
								//   this.$yrouter.replace({
								//     path: "/pages/order/OrderDetails/index" ,query: { id: data.result.orderId}
								//   });
								// });
						}
					})
					.catch(err => {
						uni.hideLoading();
						uni.showToast({
							title: err.response.data.msg || "创建订单失败",
							icon: 'none',
							duration: 2000
						});
					});
			}
		}
	};
</script>
