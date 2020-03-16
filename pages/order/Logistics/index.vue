<template>
	<view class="logistics">
		<view class="header acea-row row-between row-top" v-for="cart in cartInfo" :key="cart.id">
			<view class="pictrue">
				<image :src="cart.productInfo.image" />
			</view>
			<view class="text acea-row row-between">
				<view class="name line2">{{ cart.productInfo.store_name }}</view>
				<view class="money">
					<view>￥{{ cart.truePrice }}</view>
					<view>x{{ cart.cart_num }}</view>
				</view>
			</view>
		</view>
		<view class="logisticsCon" style="margin-bottom: 5px">
			<view class="company acea-row row-between-wrapper">
				<view class="picTxt acea-row row-between-wrapper">
					<view class="iconfont icon-wuliu"></view>
					<view class="text">
						<view>
							<text class="name line1">物流公司：</text>
							{{ orderInfo.deliveryName }}
						</view>
						<view class="express line1">
							<text class="name">快递单号：</text>
							{{ orderInfo.deliveryId }}
						</view>
					</view>
				</view>
				<view class="copy acea-row row-center-wrapper copy-data" @click="copyClipboard(orderInfo.deliveryId)">复制单号</view>
			</view>
			<view class="item" v-for="(express, expressListIndex) in expressList" :key="expressListIndex">
				<view class="circular" :class="expressListIndex === 0 ? 'on' : ''"></view>
				<view class="text">
					<view :class="expressListIndex === 0 ? 'font-color-red' : ''">{{ express.status }}</view>
					<view class="data">{{ express.time }}</view>
				</view>
			</view>
		</view>

		<!-- 物流进度条 -->
		<view class="div-bg bg-white" style="font-size:12px; background:#fff;">
			<!--物流跟踪-->
			<view style="margin-bottom:5px;">
				<view class="bg-white" style="width: 92%; margin-left: 4%;margin: auto;padding-left: 15px;padding-right: 15px;padding-top: 10px">
					<view style="font-size: .26rem;color: #111111; margin: 5px 0">
						物流跟踪
						<!--物流跟踪-->
					</view>
					<view>
						<view class="track-rcol">
							<view class="track-list">
								<view>
									<view v-for="(item,logisticsListindex) in logisticsList" :key="logisticsListindex">
										<view class="active" v-if="logisticsListindex===0">
											<view></view>
											<i class="node-icon"></i>
											<text class="txt">{{item.acceptStation}}</text>
											<text class="time">{{item.acceptTime}}</text>
										</view>
										<view v-if="logisticsListindex > 0 && logisticsListindex !== logisticsList.length-1">
											<i class="node-icon"></i>
											<text class="txt">{{item.acceptStation}}</text>
											<text class="time">{{item.acceptTime}}</text>
										</view>
										<view v-if="logisticsListindex === logisticsList.length-1" class="finall">
											<i class="div-spilander"></i>
											<i class="node-icon"></i>
											<text class="txt">{{item.acceptStation}}</text>
											<text class="time">{{item.acceptTime}}</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="no-express" v-if="loaded && !expressList.length">
			<image :src="$VUE_APP_RESOURCES_URL+'/images/noExpress.png'" />
		</view>
		<Recommend></Recommend>
	</view>
</template>
<script>
	import Recommend from "@/components/Recommend";
	import {
		express,
		orderDetail
	} from "@/api/order";
	import {
		copyClipboard
	} from "@/utils";

	const NAME = "Logistics";

	export default {
		name: NAME,
		components: {
			Recommend
		},
		data: function() {
			return {
				id: "",
				cartInfo: [],
				orderInfo: {},
				expressList: [],
				loaded: false,
				logisticsList: [{
					message: "暂无数据",
					messageDate: ""
				}]
			};
		},
		watch: {
			$yroute(n) {
				if (n.name === NAME && this.$yroute.query.id !== this.id) {
					this.id = this.$yroute.query.id;
					this.getExpress();
				}
			}
		},
		mounted: function() {
			this.id = this.$yroute.query.id;
			this.getExpress();
		},
		methods: {
			copyClipboard,
			getExpressInfo() {
				let params = {
					orderCode: this.id,
					shipperCode: this.orderInfo.deliverySn,
					logisticCode: this.orderInfo.deliveryId
				};
				express(params)
					.then(res => {
						this.logisticsList = res.data.traces.reverse();
					})
					.catch(err => {
						uni.showToast({
							title: err.msg || err.response.data.msg,
							icon: 'none',
							duration: 2000
						});
					});
			},
			getExpress() {
				if (!this.id) {
					uni.showToast({
						title: err.msg || err.response.data.msg,
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.loaded = false;
				orderDetail(this.id)
					.then(res => {
						this.orderInfo = {
							deliveryId: res.data.deliveryId,
							deliveryName: res.data.deliveryName,
							deliverySn: res.data.deliverySn
						};
						this.getExpressInfo();
						// const result = res.data.express.result || {};
						// this.cartInfo = res.data.order.cartInfo;
						// this.expressList = result.list || [];
						// this.loaded = true;

					})
					.catch(err => {
						uni.showToast({
							title: err.msg || err.response.data.msg,
							icon: 'none',
							duration: 2000
						});
					});
			}
		}
	};
</script>

<style scoped>
	.no-express {
		margin: 1.5rem 0;
	}

	.no-express image {
		width: 6rem;
		margin: 0 auto;
		display: block;
	}

	.message-text {
		font-family: MicrosoftYaHei;
		font-size: 1rem;
		font-weight: normal;
		font-stretch: normal;
		line-height: 3rem;
		letter-spacing: 0rem;
		color: #333333;
		width: 50%;
	}

	.fontblack {
		color: #999999;
	}

	.img2 {
		width: 0.81rem;
		height: 0.8rem;
		float: right;
	}

	.addressshow2 {
		height: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		width: 75%;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
		font-size: 1rem;
	}

	.addressshow1 {
		height: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		width: 75%;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
		font-size: 1rem;
	}

	.orderTitle {
		font-size: 1rem;
		color: #333333;
		height: auto;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		white-space: normal;
		word-wrap: break-word;
		word-break: break-all;
		height: 2.5rem;
	}

	.orderDetail {
		font-size: 0.26rem;
		color: #666666;
		text-align: left;
	}

	.border-ceter {
		width: 92%;
		padding-left: 15px;
		padding-right: 15px;
	}

	.pay-button {
		width: 88%;
		height: 2.6rem;
		position: relative;
		background-color: red;
		color: white;

		margin-left: 6%;
	}

	ul view {
		list-style: none;
		font-size: 0.24rem;
	}

	ul {}

	.track-rcol {}

	.track-list {
		position: relative;
	}

	.track-list view {
		position: relative;
		padding: 0 0 0.5rem 5px;
		line-height: 0.3rem;
		border-left: 1px solid #d9d9d9;
		color: #999;
	}

	.track-list view.first {
		color: red;
		padding-top: 0;
		width: 100%;
		text-align: left;
		border-left: 1px solid #d9d9d9;
	}

	.track-list view.node-icon {
		position: absolute;
		left: -6.5px;
		border-radius: 50%;
		width: 0.2rem;
		height: 0.2rem;
		top: 4px;
		background-color: #b2b2b2;
	}

	.track-list view.active .node-icon {
		background-position: 0-72px;
		background-color: #ea7c0a;
		width: 0.3rem;
		z-index: 2;
		height: 0.3rem;
		position: absolute;
		left: -0.19rem;
		top: 0;
		border-radius: 50%;
	}

	.track-list view.time {
		margin-right: 20px;
		position: relative;
		top: 4px;
		display: inline-block;
		vertical-align: middle;
		color: #999;
		width: 100%;
		text-align: left;
	}

	.track-list view.txt {
		position: relative;
		display: inline-block;
		vertical-align: top;
		color: #999;
		left: 0.2rem;
		top: 0.04rem;
	}

	.track-list view.first .time {
		text-align: left;
		width: 94%;
		color: red;
	}

	.track-list view.first .txt {
		color: red;
		text-align: left;
		width: 94%;
	}

	.track-list view.finall {
		position: relative;
		padding: 0px 0 0.5rem 5px;
		line-height: 18px;
		border-color: white;
		border-left: 1px solid #ffffff;
		color: #999;
	}

	.track-list view.finall .div-spilander {
		width: 1px;
		position: absolute;
		left: -1.5px;
		height: 0.5rem;
		background-color: #d9d9d9;
	}
</style>
