<template>
	<view class="evaluate-con">
		<view class="goodsStyle acea-row row-between" v-if="orderCon.productInfo">
			<view class="pictrue">
				<image :src="orderCon.productInfo.image" class="image" />
			</view>
			<view class="text acea-row row-between">
				<view class="name line2">{{ orderCon.productInfo.storeName }}</view>
				<view class="money">
					<view>￥{{ orderCon.productInfo.price }}</view>
					<view class="num">x{{ orderCon.cartNum }}</view>
				</view>
			</view>
		</view>
		<view class="score">
			<view class="item acea-row row-middle" v-for="(item, scoreListIndexw) in scoreList" :key="scoreListIndexw">
				<view>{{ item.name }}</view>
				<view class="starsList">
					<text @click="stars(starsIndexn, scoreListIndexw)" v-for="(itemn, starsIndexn) in item.stars" :key="starsIndexn"
					 class="iconfont" :class="
              item.index >= starsIndexn
                ? 'icon-shitixing font-color-red'
                : 'icon-kongxinxing'
            "></text>
				</view>
				<text class="evaluate">
					{{
          item.index === -1 ? "" : item.index + 1 + "分"
          }}
				</text>
			</view>
			<view class="textarea">
				<textarea placeholder="商品满足你的期待么？说说你的想法，分享给想买的他们吧~" v-model="expect"></textarea>
				<view class="list acea-row row-middle">
					<view class="pictrue" v-for="(item, uploadPicturesIndex) in uploadPictures" :key="uploadPicturesIndex">
						<image :src="item" />
						<text class="iconfont icon-guanbi1 font-color-red" @click="uploadPictures.splice(uploadPicturesIndex, 1)"></text>
					</view>
					<!-- <VueCoreImageUpload
            class="btn btn-primary"
            :crop="false"
            compress="80"
            @imageuploaded="imageuploaded"
            :headers="headers"
            :max-file-size="5242880"
            :credentials="false"
            inputAccept="image/*"
            inputOfFile="file"
            :url="url"
            v-if="uploadPictures.length < 8"
          >
            <view
              class="pictrue uploadBnt acea-row row-center-wrapper row-column"
            >
              <text class="iconfont icon-icon25201"></text>
              <view>上传图片</view>
            </view>
          </VueCoreImageUpload>-->
				</view>
			</view>
			<view class="evaluateBnt bg-color-red" @click="submit">立即评价</view>
		</view>
	</view>
</template>
<style scoped lang="less">
	.evaluate-con .score .textarea .list .pictrue.uploadBnt {
		border: 1px solid #ddd;
	}
</style>
<script>
	import {
		postOrderProduct,
		postOrderComment
	} from "@/api/store";
	import {
		trim
	} from "@/utils";
	import {
		VUE_APP_API_URL
	} from "@/config";
	import {
		required
	} from "@/utils/validate";
	import {
		validatorDefaultCatch
	} from "@/utils/dialog";

	const NAME = "GoodsEvaluate";

	export default {
		name: NAME,
		components: {
			// VueCoreImageUpload
		},
		props: {},
		data: function() {
			return {
				orderCon: {
					cartProduct: {
						productInfo: {}
					}
				},
				scoreList: [{
						name: "商品质量",
						stars: ["", "", "", "", ""],
						index: -1
					},
					{
						name: "服务态度",
						stars: ["", "", "", "", ""],
						index: -1
					}
				],
				url: `${VUE_APP_API_URL}/api/qiNiuContent`,
				headers: {
					Authorization: "Bearer " + this.$store.state.token
				},
				uploadPictures: [],
				expect: "",
				unique: ""
			};
		},
		mounted: function() {
			this.unique = this.$yroute.query.id;
			this.getOrderProduct();
		},
		watch: {
			$yroute(n) {
				if (n.name === NAME && this.unique !== n.params.id) {
					this.unique = n.params.id;
					this.$set(this.scoreList[0], "index", -1);
					this.$set(this.scoreList[1], "index", -1);
					this.expect = "";
					this.uploadPictures = [];
					this.getOrderProduct();
				}
			}
		},
		methods: {
			getOrderProduct: function() {
				let that = this,
					unique = that.unique;
				postOrderProduct(unique).then(res => {
					that.orderCon = res.data;
				});
			},
			stars: function(indexn, indexw) {
				this.scoreList[indexw].index = indexn;
			},
			imageuploaded(res) {
				if (res.errno !== 0) {
					uni.showToast({
						title: res.msg || "上传图片失败",
						icon: 'none',
						duration: 2000
					});
					return
				}
				this.uploadPictures.push(res.data[0]);
			},
			async submit() {
				const expect = trim(this.expect),
					product_score =
					this.scoreList[0].index + 1 === 0 ? "" : this.scoreList[0].index + 1,
					service_score =
					this.scoreList[1].index + 1 === 0 ? "" : this.scoreList[1].index + 1;
				try {
					await this.$validator({
						product_score: [
							required("请选择商品质量分数", {
								type: "number"
							})
						],
						service_score: [
							required("请选择服务态度分数", {
								type: "number"
							})
						]
					}).validate({
						product_score,
						service_score
					});
				} catch (e) {
					return validatorDefaultCatch(e);
				}
				postOrderComment({
						productScore: product_score,
						serviceScore: service_score,
						unique: this.unique,
						pics: this.uploadPictures.join(","),
						comment: expect
					})
					.then(() => {
						uni.showToast({
							title: "评价成功",
							icon: "success",
							duration: 2000
						});
						this.$yrouter.push({
							path: "/pages/order/OrderDetails/index",
							query: {
								id: this.orderCon.orderId
							}
						});
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
