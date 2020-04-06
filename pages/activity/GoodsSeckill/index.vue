<template>
	<view class="flash-sale" ref="container">
		<view class="header" v-if="headerImg"><image :src="headerImg" /></view>
		<view class="" v-for="(item, index) in timeList" :key="index">
			<view class="timeItem">
				<view class="time">{{ item.time }}</view>
				<view class="state">{{ item.state }}</view>
			</view>
		</view>
		<view class="" v-for="(item, index) in timeList" :key="index">
			<view v-if="active == index">
				<view class="countDown font-color-red acea-row row-center-wrapper">
					<view v-if="item.status === 0" class="activity">活动已结束</view>
					<count-down
						:is-day="false"
						:tip-text="'距结束仅剩 '"
						:day-text="''"
						:hour-text="' : '"
						:minute-text="' : '"
						:second-text="''"
						:datatime="datatime"
						v-if="item.status === 1"
					></count-down>
					<view v-if="item.status === 2" class="activity">活动即将开始</view>
				</view>
				<view class="list">
					<view class="item acea-row row-between-wrapper" v-for="(itemSeckill, indexSeckill) in seckillList" :key="indexSeckill">
						<view class="pictrue"><image :src="itemSeckill.image" /></view>
						<view class="text acea-row row-column-around">
							<view class="line1" v-text="itemSeckill.title"></view>
							<view class="money">
								限时价
								<text class="num font-color-red" v-text="'￥' + itemSeckill.price"></text>
							</view>
							<view class="progress cart-color">
								<view class="bg-red" :style="{ width: loading ? itemSeckill.percent + '%' : '' }"></view>
								<view class="piece font-color-red" v-text="'仅剩' + itemSeckill.stock + '件'"></view>
							</view>
						</view>
						<view class="grab bg-color-red" v-if="item.status === 1 && itemSeckill.stock > 0" @click="goDetail(itemSeckill.id)">马上抢</view>
						<view class="grab" v-if="item.status === 1 && itemSeckill.stock <= 0">已售磬</view>
						<view class="grab bg-color-red" v-if="item.status === 2">即将开始</view>
						<view class="grab bg-color-red" v-if="item.status === 0">已结束</view>
					</view>
				</view>
				<view class="noCommodity" style="background-color: #fff;" v-if="seckillList.length === 0 && page > 1">
					<view class="noPictrue"><image :src="$VUE_APP_RESOURCES_URL + '/images/noGood.png'" class="image" /></view>
				</view>
			</view>
		</view>
		<!-- 
		<vant-tabs :active="active" @change="setTime" :sticky="sticky" animated line-height="2" :ellipsis="false">
			<vant-tab :ellipsis="false" :title="[title[index]]">
				
			</vant-tab>
		</vant-tabs> -->
	</view>
</template>
<script>
import { getSeckillConfig, getSeckillList } from '@/api/activity';
import CountDown from '@/components/CountDown';
// import { Tab, Tabs } from "vant-weapp";
import Loading from '@/components/Loading';

export default {
	name: 'GoodsSeckill',
	components: {
		CountDown
	},
	props: {},
	data: function() {
		return {
			headerImg: '',
			timeList: [],
			sticky: false,
			loading: false,
			datatime: 0,
			active: 0,
			seckillList: [],
			status: false, //砍价列表是否获取完成 false 未完成 true 完成
			loadingList: false, //当前接口是否请求完成 false 完成 true 未完成
			page: 1, //页码
			limit: 5, //数量
			title: []
		};
	},
	mounted: function() {
		this.mountedStart();
	},
	onReachBottom() {
		!this.loadingList && this.getSeckillList();
	},
	methods: {
		mountedStart: function() {
			var that = this;
			uni.showLoading();
			getSeckillConfig().then(res => {
				that.$set(that, 'headerImg', res.data.lovely);
				that.$set(that, 'timeList', res.data.seckillTime);
				that.$set(that, 'active', res.data.seckillTimeIndex);

				let title = [];
				title = res.data.seckillTime.map((item, index) => {
					return {
						name: 'div',
						attrs: {
							class: 'timeItem'
						},
						children: [
							{
								name: 'div',
								attrs: {
									class: 'time'
								},
								children: [
									{
										type: 'text',
										text: item.time
									}
								]
							},
							{
								name: 'div',
								attrs: {
									class: 'state'
								},
								children: [
									{
										type: 'text',
										text: item.state
									}
								]
							}
						]
					};
				});
				that.$set(that, 'title', title);
				that.datatime = that.timeList[that.active].stop;
				that.getSeckillList();
				that.$nextTick(function() {
					that.sticky = true;
					uni.hideLoading();
				});
			});
		},
		setTime: function(event) {
			var that = this;
			that.active = event.mp.detail.index;
			that.datatime = that.timeList[that.active].stop;
			that.getSeckillList();
		},
		getSeckillList: function() {
			var that = this;
			if (that.loadingList) return;
			if (that.status) return;
			var time = that.timeList[that.active].id;
			getSeckillList(time, { page: that.page, limit: that.limit }).then(res => {
				that.status = res.data.length < that.limit;
				that.seckillList.push.apply(that.seckillList, res.data);
				that.page++;
				uni.hideLoading();
			});
		},
		goDetail: function(id) {
			var that = this;
			var time = that.timeList[that.active].stop;
			this.$yrouter.push({
				path: '/pages/activity/SeckillDetails/index',
				query: { id, time }
			});
		}
	}
};
</script>
<style scoped lang="less">
.timeItem {
	font-size: 0.22 * 100rpx;
	color: #282828;
	width: 100%;
	text-align: center;
	padding: 0.11 * 100rpx 0;
	height: 0.96 * 100rpx;
	background-color: #efc58f;
}
.timeItem .time {
	font-size: 0.32 * 100rpx;
	font-weight: bold;
	height: 0.37 * 100rpx;
	line-height: 0.37 * 100rpx;
}
.timeItem .state {
	height: 0.37 * 100rpx;
	line-height: 0.37 * 100rpx;
}
.activity {
	color: #333;
}
.flash-sale .list .item .grab {
	background-color: #999;
}
</style>
