<template>
  <div class="shoppingCart">
    <div class="labelNav acea-row row-around row-middle">
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>100%正品保证
      </div>
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>所有商品精挑细选
      </div>
      <div class="item">
        <span class="iconfont icon-xuanzhong"></span>售后无忧
      </div>
    </div>
    <div class="nav acea-row row-between-wrapper">
      <div>
        购物数量
        <span class="num font-color-red">{{ count }}</span>
      </div>
      <div
        v-if="cartList.valid.length > 0"
        class="administrate acea-row row-center-wrapper"
        @click="manage"
      >{{ footerswitch ? "取消" : "管理" }}</div>
    </div>
    <div v-if="validList.length > 0 || cartList.invalid.length > 0">
      <div class="list">
        <div
          class="item acea-row row-between-wrapper"
          v-for="(item, cartListValidIndex) in validList"
          :key="cartListValidIndex"
        >
          <div class="select-btn">
            <div class="checkbox-wrapper">
              <checkbox-group @change="switchSelect(cartListValidIndex)">
                <label class="well-check">
                  <checkbox value :checked="item.checked"></checkbox>
                </label>
              </checkbox-group>
            </div>
          </div>
          <div class="picTxt acea-row row-between-wrapper">
            <div class="pictrue" @click="goGoodsCon(item)">
              <img :src="item.productInfo.attrInfo.image" v-if="item.productInfo.attrInfo" />
              <img :src="item.productInfo.image" v-else />
            </div>
            <div class="text">
              <div class="line1">{{ item.productInfo.storeName }}</div>
              <div
                class="infor line1"
                v-if="item.productInfo.attrInfo"
              >属性：{{ item.productInfo.attrInfo.suk }}</div>
              <div class="money">￥{{ item.truePrice }}</div>
            </div>
            <div class="carnum acea-row row-center-wrapper">
              <div
                class="reduce"
                :class="validList[cartListValidIndex].cartNum <= 1 ? 'on' : ''"
                @click.prevent="reduce(cartListValidIndex)"
              >-</div>
              <div class="num">{{ item.cartNum }}</div>
              <div
                class="plus"
                v-if="validList[cartListValidIndex].attrInfo"
                :class="
                  validList[cartListValidIndex].cartNum >=
                  validList[cartListValidIndex].attrInfo.stock
                    ? 'on'
                    : ''
                "
                @click.prevent="plus(cartListValidIndex)"
              >+</div>
              <div
                class="plus"
                v-else
                :class="
                  validList[cartListValidIndex].cartNum >= validList[cartListValidIndex].stock
                    ? 'on'
                    : ''
                "
                @click.prevent="plus(cartListValidIndex)"
              >+</div>
            </div>
          </div>
        </div>
      </div>
      <div class="invalidGoods" v-if="cartList.invalid.length > 0">
        <div class="goodsNav acea-row row-between-wrapper">
          <div @click="goodsOpen">
            <span
              class="iconfont"
              :class="goodsHidden === true ? 'icon-xiangyou' : 'icon-xiangxia'"
            ></span>失效商品
          </div>
          <div class="del" @click="delInvalidGoods">
            <span class="iconfont icon-shanchu1"></span>清空
          </div>
        </div>
        <div class="goodsList" :hidden="goodsHidden">
          <div v-for="(item, cartListinvalidIndex) in cartList.invalid" :key="cartListinvalidIndex">
            <div
              @click="goGoodsCon(item)"
              class="item acea-row row-between-wrapper"
              v-if="item.productInfo"
            >
              <div class="invalid acea-row row-center-wrapper">失效</div>
              <div class="pictrue">
                <img :src="item.productInfo.attrInfo.image" v-if="item.productInfo.attrInfo" />
                <img :src="item.productInfo.image" v-else />
              </div>
              <div class="text acea-row row-column-between">
                <div class="line1">{{ item.productInfo.storeName }}</div>
                <div
                  class="infor line1"
                  v-if="item.productInfo.attrInfo"
                >属性：{{ item.productInfo.attrInfo.suk }}</div>
                <div class="acea-row row-between-wrapper">
                  <div class="end">该商品已下架</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--购物车暂无商品-->
    <div class="noCart" v-if="cartList.valid.length === 0 && cartList.invalid.length === 0">
      <div class="pictrue">
        <img :src="$VUE_APP_RESOURCES_URL+'/images/noCart.png'" />
      </div>
      <Recommend></Recommend>
    </div>
    <div style="height:2.1rem"></div>
    <div
      :class="['footer acea-row row-between-wrapper']"
      v-if="cartList.valid.length > 0"
    >
      <div>
        <div class="select-btn">
          <div class="checkbox-wrapper">
            <!-- <label class="well-check">
              <input
                type="checkbox"
                name
                value
                :checked="isAllSelect && cartCount > 0"
                @click="allChecked"
              />
              <i class="icon"></i>
              <span class="checkAll">全选 ({{ cartCount }})</span>
            </label>-->

            <checkbox-group @change="allChecked">
              <label class="well-check">
                <checkbox value :checked="isAllSelect && cartCount > 0"></checkbox>
                <span class="checkAll">全选 ({{ cartCount }})</span>
              </label>
            </checkbox-group>
          </div>
        </div>
      </div>
      <div class="money acea-row row-middle" v-if="footerswitch === false">
        <span class="font-color-red">￥{{ countmoney }}</span>
        <div class="placeOrder bg-color-red" @click="placeOrder">立即下单</div>
      </div>
      <div class="button acea-row row-middle" v-else>
        <div class="bnt cart-color" @click="collectAll">收藏</div>
        <div class="bnt" @click="delgoods">删除</div>
      </div>
    </div>
  </div>
</template>
<script>
import Recommend from "@/components/Recommend";
import {
  getCartList,
  postCartDel,
  changeCartNum,
  getCartCount
} from "@/api/store";
import { postCollectAll } from "@/api/user";
import { mul, add } from "@/utils/bc";
import cookie from "@/utils/store/cookie";
import debounce from "lodash.debounce";

const CHECKED_IDS = "cart_checked";

export default {
  name: "ShoppingCart",
  components: {
    Recommend
  },
  props: {},
  data: function() {
    return {
      isIpx: false,
      cartList: { invalid: [], valid: [] },
      validList: [],
      isAllSelect: false,
      cartCount: 0,
      countmoney: 0,
      goodsHidden: true,
      footerswitch: false,
      count: 0,
      checkedIds: [],
      loaded: false
    };
  },
  watch: {
    $yroute(n) {
      if (n.name === "ShoppingCart") {
        this.carnum();
        this.countMoney();
        this.getCartList();
        this.gainCount();
        this.goodsHidden = true;
        this.footerswitch = false;
      }
    },
    cartList(list) {
      this.validList = list.valid;
    }
  },
  mounted: function() {
    let that = this;
    that.carnum();
    that.countMoney();
    that.getCartList();
    that.gainCount();
    wx.getSystemInfo({
      success: function(res) {
        console.log(res);
        var name = "iPhone X";
        if (res.model.indexOf(name) > -1) {
          that.isIpx = true;
        }
      }
    });
  },
  methods: {
    goGoodsCon(item) {
      this.$yrouter.push({
        path: "/pages/shop/GoodsCon/index",
        query: { id: item.productId }
      });
    },
    getCartList: function() {
      let that = this;
      getCartList().then(res => {
        that.cartList = res.data;
        let checkedIds = cookie.get(CHECKED_IDS) || [];
        if (!Array.isArray(checkedIds)) checkedIds = [];
        this.cartList.valid.forEach(cart => {
          if (checkedIds.indexOf(cart.id) !== -1) cart.checked = true;
        });
        if (checkedIds.length) {
          that.checkedIds = checkedIds;
          that.isAllSelect = checkedIds.length === this.cartList.valid.length;
          that.carnum();
          that.countMoney();
        }
        this.loaded = true;
      });
    },
    //删除商品；
    delgoods: function() {
      let that = this,
        id = [],
        valid = [],
        list = that.cartList.valid;
      list.forEach(function(val) {
        if (val.checked === true) {
          id.push(val.id);
        }
      });
      if (id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      postCartDel(id).then(function() {
        list.forEach(function(val, i) {
          if (val.checked === false || val.checked === undefined)
            valid.push(list[i]);
        });
        that.$set(that.cartList, "valid", valid);
        that.carnum();
        that.countMoney();
        that.gainCount();
        that.getCartList();
      });
    },
    // //获取数量
    gainCount: function() {
      let that = this;
      getCartCount().then(res => {
        that.count = res.data.count;
      });
    },
    //清除失效产品；
    delInvalidGoods: function() {
      let that = this,
        id = [],
        list = that.cartList.invalid;
      list.forEach(function(val) {
        id.push(val.id);
      });
      postCartDel(id).then(function() {
        list.splice(0, list.length);
        that.gainCount();
        that.getCartList();
      });
    },
    //批量收藏;
    collectAll: function() {
      let that = this,
        data = { id: [], category: "" },
        list = that.cartList.valid;
      list.forEach(function(val) {
        if (val.checked === true) {
          data.id.push(val.product_id);
          data.category = val.type;
        }
      });
      if (data.id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      postCollectAll(data).then(function() {
        that.$dialog.toast({ mes: "收藏成功!" });
      });
    },
    //立即下单；
    placeOrder: function() {
      let that = this,
        list = that.cartList.valid,
        id = [];
      list.forEach(function(val) {
        if (val.checked === true) {
          id.push(val.id);
        }
      });
      if (id.length === 0) {
        that.$dialog.toast({ mes: "请选择产品" });
        return;
      }
      console.log(id);
      this.$yrouter.push({
        path: "/pages/order/OrderSubmission/index",
        query: { id: id.join(",") }
      });
    },
    manage: function() {
      let that = this;
      that.footerswitch = !that.footerswitch;
    },
    goodsOpen: function() {
      let that = this;
      that.goodsHidden = !that.goodsHidden;
    },
    //加
    plus: function(index) {
      let that = this;
      let list = that.cartList.valid[index];
      list.cartNum++;
      if (list.attrInfo) {
        if (list.cartNum >= list.attrInfo.stock) {
          that.$set(list, "cart_num", list.attrInfo.stock);
        }
      } else {
        if (list.cartNum >= list.stock) {
          that.$set(list, "cart_num", list.stock);
        }
      }
      that.carnum();
      that.countMoney();
      that.syncCartNum(list);
    },
    //减
    reduce: function(index) {
      let that = this;
      let list = that.cartList.valid[index];
      if (list.cartNum <= 1) {
        that.$dialog.toast({ mes: "已经是底线啦!" });
        return;
      }
      list.cartNum--;
      if (list.cartNum < 1) {
        that.$set(list, "cart_num", 1);
      }
      that.carnum();
      that.countMoney();
      that.syncCartNum(list);
    },
    syncCartNum(cart) {
      if (!cart.sync) {
        changeCartNum(cart.id, Math.max(cart.cartNum, 1) || 1)
          .then(res => {
            this.getCartList();
          })
          .catch(error => {
            uni.showToast({
              title: error.response.data.msg,
              icon: "none",
              duration: 2000
            });
          });
      }
    },
    //单选
    switchSelect: function(index) {
      let that = this,
        cart = that.cartList.valid[index],
        i = this.checkedIds.indexOf(cart.id);
      cart.checked = !cart.checked;

      if (i !== -1) this.checkedIds.splice(i, 1);
      if (cart.checked) {
        this.checkedIds.push(cart.id);
      }
      let len = that.cartList.valid.length;
      let selectnum = [];
      for (let i = 0; i < len; i++) {
        if (that.cartList.valid[i].checked === true) {
          selectnum.push(true);
        }
      }
      that.isAllSelect = selectnum.length === len;
      that.$set(that, "cartList", that.cartList);
      that.$set(that, "isAllSelect", that.isAllSelect);
      cookie.set(CHECKED_IDS, that.checkedIds);
      that.carnum();
      that.countMoney();
    },
    //全选
    allChecked: function(e) {
      let that = this;
      let selectAllStatus = e.mp.detail.value[0] ? true : false;
      // let selectAllStatus = that.isAllSelect;
      let checkedIds = [];
      // for (let i = 0; i < array.length; i++) {
      //   array[i].checked = selectAllStatus;
      //   checked.push()
      // }
      that.cartList.valid.forEach(cart => {
        cart.checked = selectAllStatus;
        if (selectAllStatus) {
          checkedIds.push(cart.id);
        }
      });
      let cartList = {
        ...that.cartList
      };
      that.cartList = [];
      that.cartList = cartList;
      this.$set(this, "cartList", this.cartList);
      this.$set(this, "isAllSelect", selectAllStatus);
      this.checkedIds = checkedIds;
      cookie.set(CHECKED_IDS, checkedIds);
      that.carnum();
      that.countMoney();
      this.$forceUpdate();
    },
    //数量
    carnum: function() {
      let that = this;
      var carnum = 0;
      var array = that.cartList.valid;
      for (let i = 0; i < array.length; i++) {
        if (array[i].checked === true) {
          carnum += parseInt(array[i].cartNum);
        }
      }
      that.$set(that, "cartCount", carnum);
    },
    //总共价钱；
    countMoney: function() {
      let that = this;
      let carmoney = 0;
      let array = that.cartList.valid;
      for (let i = 0; i < array.length; i++) {
        if (array[i].checked === true) {
          carmoney = add(carmoney, mul(array[i].cartNum, array[i].truePrice));
        }
      }
      that.countmoney = carmoney;
    }
  }
};
</script>
