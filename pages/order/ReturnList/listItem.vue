<!-- 售后列表内容 -->
<template>
	<view class="productItem">
		<view class="title">
			<view class="shopName">
				{{ 'YSHOP商铺' }}
			</view>
			<view class="status">
				<view>审核中</view>
			</view>
		</view>
		<view class="content">
			<image src="" mode=""></image>
			<view class="info">
				<view class="infoTitle">
					工装裤男秋冬季韩版潮流潮牌ins直筒宽松阔腿休闲百搭加绒长裤子
				</view>
				<view class="infoSku">
					<view class="sku">
						黑色 XL
					</view>
					<view class="num">
						x {{ 1 }}
					</view>
				</view>
				<view class="infoMoney">
					退款：￥299.00
				</view>
			</view>
		</view>
		<view class="money">
			
		</view>
		<view class="btns">
			
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
.productItem{
	margin: 10rpx 0;
	background-color: #FFF;
	.title{
		height: 80rpx;
		padding: 0 30rpx;
		color: #333;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.content{
		padding: 20rpx 30rpx;
		display: flex;
	}
	.money{
		height: 80rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
	}
	.btns{
		height: 50rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: flex-end;
	}
}
</style>
