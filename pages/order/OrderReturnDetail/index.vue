<template>
	<view class="returnList">
		<!-- 给header上与data上加on为退款订单-->
		<view class="header bg-color-red acea-row row-middle" :class="refundOrder ? 'on' : ''">
		  <view class="data" :class="refundOrder ? 'on' : ''">
		    <view class="state">{{ orderInfo._status._msg }}</view>
		    <view>{{ orderInfo.createTime ||  '' }}</view>
		  </view>
		</view>
		<!-- 退款总金额 -->
		<view class="money">
			<view class="top">
				<text>退款总金额</text>
				<text class="colorRed">￥{{200.0}}</text>
			</view>
			<!-- 退款信息 -->
			<view class="tips">
				<text class="title">您已成功发起退款申请，请耐心等待商家处理</text>
				<view class="content">
					<view>· 卖家同意或超时未处理，系统将退款给您</view>
					<view>· 如果卖家拒绝，您可以修改退款申请后再次发起，卖家会重新处理</view>
				</view>
			</view>
			<view class="bottom">
				<view class="btns def" @click="cancelReq">撤销申请</view>
				<view class="btns redBtn" @click="editReq">修改申请</view>
			</view>
		</view>
		<!-- 退款信息 -->
		<view class="rebackInfo">
			<view class="top">
				
			</view>
			<view class="Item">
				
			</view>
			<view class="bottom">
				
			</view>
		</view>
		<!-- 协商历史 -->
		<view class="history">
			<view class="top">
				
			</view>
			<view class="stepList">
				
			</view>
			<view class="bottom">
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderInfo: {}
			}
		},
		mounted() {
			this.getReturnDetail()
		},
		methods: {
			getReturnDetail() {
				console.log(this.$yroute.query)
			},
			// 撤销申请
			cancelReq() {},
			// 修改申请
			editReq() {}
		}
	}
</script>

<style scoped lang='scss'>
$red: #EB3729;
.returnList{
	.colorRed{
		color: $red;
	}
	.bgRed{
		background-color: $red;
	}
	.money{
		background-color: #FFF;
		.top{
			padding: 20rpx 30rpx;
			font-size: 30rpx;
			display: flex;
			justify-content: space-between;
			border-bottom: 2rpx solid #F3F4F5;
		}
		.tips{
			height: 160rpx;
			padding: 20rpx 30rpx;
			color: #999999;
			border-bottom: 2rpx solid #F3F4F5;
			font-size: 26rpx;
			.title{
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.content{
				font-size: 20rpx;
			}
		}
		.bottom{
			padding: 20rpx 30rpx;
			display: flex;
			justify-content: flex-end;
			.btns{
				width: 160rpx;
				height: 58rpx;
				font-size: 24rpx;
				text-align: center;
				line-height: 58rpx;
				border-radius: 180rpx;
			}
			.def{
				margin-right: 20rpx;
				color: #DDDDDD;
				border: 2rpx solid #DDDDDD;
			}
			.redBtn{
				color: #FFF;
				background-color: $red;
			}
		}
	}
}
</style>
