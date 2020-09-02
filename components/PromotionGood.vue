<template>
	<view class="promotionGood" v-if="benefit.length > 0">
		<view class="goods-box" v-for="(item, promotionGoodIndex) in benefit" :key="promotionGoodIndex" @tap="routerGo(item)">
			<view class="img-box">
				<!-- <image class="tag-img" :src="item.image" mode=""></image> -->
				<image class="img" :src="item.image" lazy-load mode="aspectFill"></image>
			</view>
			<view class="tip one-t">{{ item.storeName }}</view>
			<view class="title more-t">{{ item.storeName }}</view>
			<view class="price-box">
				<view class="flex x-bc align-end">
					<view class="current">{{ item.activity_type === 'groupon' ? item.price : item.otPrice }}</view>
					<view class="sales miso-font">仅剩：{{ item.stock }}{{ item.unitName }}</view>
				</view>
				<view class="x-f tag-box">
					<!-- <view class="discount">新人礼</view>
					<view class="discount">满100减60</view> -->
				</view>
			</view>
		</view>
	</view>
</template>
<script>
export default {
	name: 'PromotionGood',
	props: ['benefit'],
	data: function() {
		return {};
	},
	methods: {
		routerGo(item) {
			this.$yrouter.push({ path: '/pages/shop/GoodsCon/index', query: { id: item.id } });
		}
	},
	mounted() {
	}
};
</script>

<style lang="scss">
.goods-box {
	width: 345rpx;
	background: #fff;
	padding-bottom: 20rpx;
	border-radius: 20rpx;
	overflow: hidden;

	.img-box {
		width: 345rpx;
		height: 345rpx;
		overflow: hidden;
		position: relative;

		.tag-img {
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 80rpx;
			height: 40rpx;
		}

		.img {
			width: 345rpx;
			height: 345rpx;
			background-color: #ccc;
		}
	}

	.tip {
		width: 346rpx;
		line-height: 56rpx;
		background: rgba(246, 242, 234, 1);
		font-size: 22rpx;
		font-family: PingFang SC;
		font-weight: 400;
		color: rgba(168, 112, 13, 1);
		padding: 0 20rpx;
	}

	.title {
		font-size: 24rpx;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 36rpx;
		height: 72rpx;
		margin: 20rpx 20rpx 10rpx;
	}

	.price-box {
		padding: 10rpx 20rpx 0;
		width: 344rpx;
		.sales {
			font-size: 20rpx;
			font-family: PingFang SC;
			font-weight: 400;
			color: rgba(153, 153, 153, 1);
			line-height: 20rpx;
			margin-bottom: 20rpx;
		}
		.current {
			font-size: 30rpx;
			font-weight: 500;
			color: rgba(225, 33, 43, 1);
			line-height: 30rpx;
			margin-bottom: 20rpx;
			&:before {
				content: '￥';
				font-size: 26rpx;
			}
		}

		.original {
			font-size: 22rpx;
			font-weight: 400;
			text-decoration: line-through;
			color: rgba(153, 153, 153, 1);
			margin-left: 14rpx;
			line-height: 22rpx;
			margin-bottom: 10rpx;
			&:before {
				content: '￥';
				font-size: 20rpx;
			}
		}

		.tag-box {
			.discount {
				line-height: 28rpx;
				border: 1rpx solid rgba(225, 33, 43, 1);
				border-radius: 8rpx;
				font-size: 18rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: rgba(225, 33, 43, 1);
				padding: 0 8rpx;
				margin-right: 10rpx;
			}
		}
	}
}
</style>
