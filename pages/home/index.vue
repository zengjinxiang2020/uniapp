<template>
	<view class="index">
		<view class="header fixed-header acea-row row-center-wrapper">
			<view @click="goGoodSearch()" class="search acea-row row-middle">
				<text class="iconfont icon-xiazai5"></text>
				搜索商品
			</view>
			<view class="qr" @click="startQr()">
				<image src="@/static/images/qr.png" />
			</view>
		</view>
		<view class="fixed-header-box"></view>
		<button @click="testTemplate">测试模板消息</button>
		<view class="slider-banner banner">
			<swiper indicatorDots="true" v-if="banner.length > 0" autoplay circular>
				<block v-for="(item, bannerIndex) in banner" :key="bannerIndex">
					<swiper-item>
						<view @click="goRoll(item)" class="swiper-item">
							<image :src="item.pic" />
						</view>
					</swiper-item>
				</block>
			</swiper>
		</view>

		<view class="nav acea-row">
			<view @click="goWxappUrl(item)" class="item" v-for="(item, menusIndex) in menus" :key="menusIndex">
				<view class="pictrue">
					<image :src="item.pic" />
				</view>
				<view>{{ item.name }}</view>
			</view>
		</view>
		<!-- <view class="news acea-row ">
			<view class="pictrue" v-if="$VUE_APP_RESOURCES_URL">
				<image src="@/static/images/news.png" />
			</view>
			<view class="swiper-no-swiping new-banner">
				<swiper class="swiper-wrapper" v-if="roll.length > 0" :indicator-dots="false" autoplay circular vertical>
					<block v-for="(item, rollIndex) in roll" :key="rollIndex">
						<swiper-item class="swiper-slide">
							<view @click="goRoll(item)" class="swiper-item acea-row row-between-wrapper">
								<view class="text acea-row row-between-wrapper">
									<view class="label" v-if="item.show === '是'">最新</view>
									<view class="newsTitle line1">{{ item.info }}</view>
								</view>
								<view class="iconfont icon-xiangyou"></view>
							</view>
						</swiper-item>
					</block>
				</swiper>
			</view>
		</view> -->
		<!-- <view class="wrapper hot" v-if="likeInfo.length > 0"> -->
		<uni-notice-bar scrollable="true" @click="goRoll(singNew)" single="true" speed="10" showIcon="true" :text="singNew.info"></uni-notice-bar>
		<view class="wrapper hot" v-if="bastList.length > 0">
			<image class="bg" src="../../static/images/index-bg.png" mode="widthFix"></image>
			<view class="title no-border acea-row row-between-wrapper">
				<div class="text line1">
					<span class="iconfont icon-remen"></span>
					<span class="label">热门榜单</span>
				</div>
				<view @click="goHotNewGoods(2)" class="more">
					更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class="newProducts">
				<scroll-view :show-scrollbar="false" scroll-y="false" scroll-x="true">
					<view class="newProductsScroll">
						<view @click="goGoodsCon(item)" class="newProductsItem" v-for="(item, likeInfoIndex) in likeInfo" :key="likeInfoIndex">
							<view class="img-box">
								<image :src="item.image" />
							</view>
							<view class="pro-info line1"><text>{{ item.storeName }}</text></view>
							<view class="money font-color-red"><text>￥{{ item.price }}</text></view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="wrapper" v-if="bastList.length > 0">
			<view class="title no-border acea-row row-between-wrapper">
				<view class="text">
					<div class="name line1">
						<span class="iconfont icon-jingpintuijian"></span>
						<span class="label">精品推荐</span>
					</div>
				</view>
				<view @click="goHotNewGoods(1)" class="more">
					更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<Good-list :good-list="bastList" :is-sort="false"></Good-list>
		</view>

		<view class="wrapper" v-if="firstList.length > 0">
			<view class="title acea-row row-between-wrapper">
				<view class="text">
					<view class="name line1">
						<span class="iconfont icon-xinpin"></span>
						<span class="label">首发新品</span>
					</view>
				</view>
				<view @click="goHotNewGoods(3)" class="more">
					更多
					<text class="iconfont icon-jiantou"></text>
				</view>
			</view>
			<view class="newProducts">
				<scroll-view :show-scrollbar="false" scroll-y="false" scroll-x="true">
					<view class="newProductsScroll">
						<view @click="goGoodsCon(item)" class="newProductsItem" v-for="(item, firstListIndex) in firstList" :key="firstListIndex">
							<view class="img-box">
								<image :src="item.image" />
							</view>
							<view class="pro-info line1">{{ item.storeName }}</view>
							<view class="money font-color-red">￥{{ item.price }}</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="wrapper" v-if="benefit.length > 0">
			<view class="title acea-row row-center">
				<view class="text text-center">
					<div class="name line1 new-name">
						<span class="iconfont icon-shoucang"></span>
						<span class="txt">猜你喜欢</span>
					</div>
				</view>
				<!-- <view @click="goGoodsPromotion(4)" class="more">
					更多
					<text class="iconfont icon-jiantou"></text>
				</view> -->
			</view>
		</view>
		<PromotionGood :benefit="benefit"></PromotionGood>
		<Coupon-window :coupon-list="couponList" v-if="showCoupon" @checked="couponClose" @close="couponClose"></Coupon-window>
	</view>
</template>
<script>
	// import { swiper, swiperSlide } from "vue-awesome-swiper";
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex';

	import GoodList from '@/components/GoodList';
	import PromotionGood from '@/components/PromotionGood';
	import CouponWindow from '@/components/CouponWindow';
	import uniNoticeBar from '@/components/uni-notice-bar/uni-notice-bar.vue'
	import {
		getHomeData,
		getShare
	} from '@/api/public';
	import cookie from '@/utils/store/cookie';
	import {
		isWeixin,
		handleUrlParam
	} from '@/utils/index';

	const HAS_COUPON_WINDOW = 'has_coupon_window';

	export default {
		name: 'Index',
		components: {
			// swiper,
			// swiperSlide,
			uniNoticeBar,
			GoodList,
			PromotionGood,
			CouponWindow
		},
		props: {},
		data: function() {
			return {
				showCoupon: false,
				logoUrl: '',
				banner: [],
				menus: [],
				roll: [],
				activity: [],
				activityOne: {},
				bastList: [],
				firstList: [],
				info: {
					fastList: [],
					bastBanner: [],

					bastList: []
				},
				likeInfo: [],
				lovely: [],
				benefit: [],
				couponList: [],
				swiperOption: {
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperRoll: {
					direction: 'vertical',
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperScroll: {
					freeMode: true,
					freeModeMomentum: false,
					slidesPerView: 'auto',
					observer: true,
					observeParents: true
				},
				swiperBoutique: {
					pagination: {
						el: '.swiper-pagination',
						clickable: true
					},
					autoplay: {
						disableOnInteraction: false,
						delay: 2000
					},
					loop: true,
					speed: 1000,
					observer: true,
					observeParents: true
				},
				swiperProducts: {
					freeMode: true,
					freeModeMomentum: false,
					slidesPerView: 'auto',
					observer: true,
					observeParents: true
				}
			};
		},
		computed: {
			singNew() {
				return this.roll.length > 0 ? this.roll[0] : "你还没添加通知哦！";
			}
		},
		onShow: function() {
			this.getLocation()
			let that = this;
			uni.showLoading({
				title: '加载中'
			});
			getHomeData().then(res => {
				that.logoUrl = res.data.logoUrl;
				that.$set(that, 'banner', res.data.banner);
				that.$set(that, 'menus', res.data.menus);
				that.$set(that, 'roll', res.data.roll);
				that.$set(that, 'info', res.data.info);
				that.$set(that, 'firstList', res.data.firstList);
				that.$set(that, 'bastList', res.data.bastList);
				that.$set(that, 'likeInfo', res.data.likeInfo);
				that.$set(that, 'lovely', res.data.lovely);
				that.$set(that, 'benefit', res.data.benefit);
				that.$set(that, 'couponList', res.data.couponList);
				uni.hideLoading();
				that.setOpenShare();
			});
		},
		methods: {
			...mapActions(["getLocation"]),
			testTemplate() {
				console.log('测试')
				// 调用订阅
				wx.requestSubscribeMessage({
					tmplIds: [''],
					success(res) {}
				})
			},
			goRoll(item) {
				if (item.uniapp_url) {
					this.$yrouter.push(item.uniapp_url)
				}
			},
			goGoodSearch() {
				// this.$yrouter.push('/pages/shop/GoodsEvaluate/index');
				this.$yrouter.push('/pages/shop/GoodSearch/index');
			},
			goWxappUrl(item) {
				this.$yrouter.push(item.uniapp_url);
			},
			goHotNewGoods(type) {
				this.$yrouter.push({
					path: '/pages/shop/HotNewGoods/index',
					query: {
						type
					}
				});
			},
			goGoodsCon(item) {
				this.$yrouter.push({
					path: '/pages/shop/GoodsCon/index',
					query: {
						id: item.id
					}
				});
			},
			goGoodsPromotion() {
				this.$yrouter.push('/pages/shop/GoodsPromotion/index');
			},
			setOpenShare: function() {},
			startQr: function() {
				uni.scanCode({
					success: (res) => {
						let option = handleUrlParam(res.result)
						console.log(option)


						// {productId: "19", spread: "21", codeType: "routine"}
						// {productId: "19", spread: "21", pageType: "good", codeType: "routine"}
						switch (option.pageType) {
							case 'good':
								// 跳转商品详情
								this.$yrouter.push({
									path: '/pages/shop/GoodsCon/index',
									query: {
										q: res.result
									}
								});
								break;
							case 'group':
								// 跳转团购
								this.$yrouter.push({
									path: '/pages/activity/GroupRule/index',
									query: {
										q: res.result
									}
								});
								break;
							case 'dargain':
								// 跳转砍价
								this.$yrouter.push({
									path: '/pages/activity/DargainDetails/index',
									query: {
										q: res.result
									}
								});
								break;
							default:
								// 跳转分销
								this.$yrouter.push({
									path: '/pages/Loading/index',
									query: {

									}
								});
								break;
						}


					}
				});
			}
		}
	};
</script>
<style scoped lang="less">
	.index {
		background-color: #fff;
	}

	.swiper-item {
		height: 100%;
	}

	.fixed-header {
		position: fixed;
		z-index: 99;
		top: 0;
		left: 0;
		right: 0;
		background: #fff;
		box-shadow: 0 0 20rpx -10rpx #aaa;

		&+.fixed-header-box {
			height: 98rpx
		}
	}
</style>
