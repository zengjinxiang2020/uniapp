<template>
    <view class="banner-swiper-box">
        <canvas canvas-id="colorThief" class="hide-canvas"></canvas>
        <swiper class="banner-carousel shopro-selector-rect" circular @change="swiperChange" :autoplay="true">
            <swiper-item v-for="(item, index) in list" :key="index" class="carousel-item" @tap="routerTo(item.path)">
                <image class="swiper-image " :src="item.pic" @click="goRoll(item)" mode="widthFix" lazy-load>
                </image>
            </swiper-item>
        </swiper>
        <view class="banner-swiper-dots">
            <text :class="swiperCurrent === index ? 'banner-dot-active' : 'banner-dot'"
                v-for="(dot, index) in list.length" :key="index"></text>
        </view>
    </view>
</template>

<script>
    import colorThief from 'miniapp-color-thief';

    export default {
        data() {
            return {
                swiperCurrent: 0, //轮播下标
                webviewId: 0,
                bgcolorAry: [],
                list: []
            };
        },
        props: {
            banner: {
                type: Array,
                default: []
            }
        },
        created: async function () {
            await this.doColorThief();

        },
        async mounted() {

        },
        computed: {},
        watch: {
            banner(next) {
                this.list = next;
                this.doColorThief()
            }
        },
        methods: {
            async doColorThief() {
                let that = this;
                // 获取轮播图
                let item = this.list[this.swiperCurrent];
                if(!item){
                    return
                }
                // 获取轮播图颜色
                let bgcolor = this.bgcolorAry[this.swiperCurrent];
                // 颜色不存在
                if (!bgcolor) {
                    let ctx = uni.createCanvasContext('colorThief', that.$scope);
                    if (0 === that.webviewId || ctx.webviewId === that.webviewId) {
                        that.webviewId = ctx.webviewId;
                        uni.getImageInfo({
                            src: item.pic,
                            success: function (image) {
                                ctx.drawImage(image.path, 0, 0, image.width, image.height);
                                ctx.draw(true, function (e) {
                                    console.log(e)
                                    uni.canvasGetImageData({
                                        canvasId: 'colorThief',
                                        x: 0,
                                        y: 0,
                                        width: parseInt(image.width),
                                        height: parseInt(image.height),
                                        success(res) {
                                            let newBgcolor = colorThief(res.data)
                                                .color()
                                                .getHex();
                                            that.$set(that.bgcolorAry, that
                                                .swiperCurrent,
                                                newBgcolor);
                                            that.$emit('getbgcolor', newBgcolor);
                                        },
                                        fail: function (error) {
                                        }
                                    }, that.$scope);
                                });
                            },
                            fail: function (error) {
                            }
                        });
                    }
                } else {
                    that.$set(item, 'bgcolor', bgcolor);
                    that.$emit('getbgcolor', bgcolor);
                }
            },
            swiperChange(e) {
                this.swiperCurrent = e.detail.current;
                this.doColorThief();
                let bgcolor = this.bgcolorAry[this.swiperCurrent];
                this.$emit('getbgcolor', bgcolor);
            },

            // 路由跳转
            goRoll(item) {
                if (item.uniapp_url) {
                    this.$yrouter.push(item.uniapp_url)
                }
            },
        }

    }
</script>

<style lang="less">
    // 轮播
    .banner-swiper-box {
        background: #fff;
    }

    .banner-swiper-box,
    .banner-carousel {
        width: 750rpx;
        height: 350upx;
        position: relative;

        .carousel-item {
            width: 100%;
            height: 100%;
            // padding: 0 28upx;
            overflow: hidden;
        }

        .swiper-image {
            width: 100%;
            height: 100%;
            // border-radius: 10upx;
            // background: #ccc;
        }
    }

    .banner-swiper-dots {
        display: flex;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 20rpx;
        z-index: 5;

        .banner-dot {
            width: 14rpx;
            height: 14rpx;
            background: rgba(255, 255, 255, 1);
            border-radius: 50%;
            margin-right: 10rpx;
        }

        .banner-dot-active {
            width: 14rpx;
            height: 14rpx;
            background: #a8700d;
            border-radius: 50%;
            margin-right: 10rpx;
        }
    }


    .hide-canvas {
        position: fixed !important;
        top: -99999upx;
        left: -99999upx;
        z-index: -99999;
    }
</style>
