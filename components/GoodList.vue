<template>
	<div class="goodList">
		<div @click="routerGo(item)" class="item acea-row row-between-wrapper" v-for="(item, goodlistIndex) in goodList" :key="goodlistIndex">
			<div class="pictrue">
				<img :src="item.image" class="image" />
				<img :src="$VUE_APP_RESOURCES_URL + '/images/one.png'" class="numPic" v-if="isSort === true && index === 0" />
				<img :src="$VUE_APP_RESOURCES_URL + '/images/two.png'" class="numPic" v-if="isSort === true && index === 1" />
				<img :src="$VUE_APP_RESOURCES_URL + '/images/three.png'" class="numPic" v-if="isSort === true && index === 2" />
			</div>
			<div class="underline">
				<div class="text">
					<div class="line1">{{ item.storeName }}</div>
					<div class="money font-color-red">
						￥
						<span class="num">{{ item.price }}</span>
					</div>
					<div class="vip-money acea-row row-middle">
						<div class="vip">￥{{ item.otPrice || 0 }}</div>
						<span class="num">已售{{ item.sales }}{{ item.unitName }}</span>
					</div>
				</div>
			</div> 
			<div class="iconfont icon-gouwuche cart-color acea-row row-center-wrapper"></div>
		</div>
	</div>
</template>
<script>
export default {
  name: "GoodList",
  props: {
    goodList: {
      type: Array,
      default: () => []
    },
    isSort: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {};
  },
  methods:{
	  routerGo(item) {
	  	this.$yrouter.push({ path: '/pages/shop/GoodsCon/index', query: { id: item.id } });
	  }
  }
};
</script>
