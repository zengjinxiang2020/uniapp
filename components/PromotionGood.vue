<template>
	<div class="promotionGood" v-if="benefit.length > 0">
		<div class="item acea-row row-between-wrapper" v-for="(item, promotionGoodIndex) in benefit" :key="promotionGoodIndex" @click="routerGo(item)">
			<div class="pictrue"><img :src="item.image" class="image" /></div>
			<div class="text">
				<div class="name line1">{{ item.storeName }}</div>
				<div class="sp-money acea-row">
					<div class="moneyCon">
						促销价: ￥
						<span class="num">{{ item.price }}</span>
					</div>
				</div>
				<div class="acea-row row-between-wrapper">
					<div class="money">日常价：￥{{ item.otPrice }}</div>
					<div>仅剩：{{ item.stock }}{{ item.unitName }}</div>
				</div>
			</div>
		</div>
	</div>
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
		console.log(this, 999);
	}
};
</script>
