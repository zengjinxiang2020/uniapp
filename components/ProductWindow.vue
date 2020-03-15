<template>
  <div>
    <div class="product-window" :class="attr.cartAttr === true ? 'on' : ''">
      <div class="textpic acea-row row-between-wrapper">
        <div class="pictrue">
          <img :src="attr.productSelect.image" class="image" />
        </div>
        <div class="text">
          <div class="line1">{{ attr.productSelect.store_name }}</div>
          <div class="money font-color-red">
            ￥
            <span class="num">{{ attr.productSelect.price }}</span>
            <span class="stock">库存: {{ attr.productSelect.stock }}</span>
          </div>
        </div>
        <div class="iconfont icon-guanbi" @click="closeAttr"></div>
      </div>
      <div class="productWinList">
        <div class="item" v-for="(item, indexw) in attr.productAttr" :key="indexw">
          <div class="title">{{ item.attrName }}</div>
          <div class="listn acea-row row-middle">
            <div
              class="itemn"
              :class="item.index == indexn ? 'on' : ''"
              v-for="(itemn, indexn) in item.attrValue"
              @click="tapAttr(indexw, indexn)"
              :key="indexn"
            >{{ itemn.attr }}</div>
          </div>
        </div>
      </div>
      <div class="cart">
        <div class="title">数量</div>
        <div class="carnum acea-row row-left">
          <div class="item reduce" :class="cartNum <= 1 ? 'on' : ''" @click="CartNumDes">-</div>
          <div class="item num">{{ cartNum }}</div>
          <div
            class="item plus"
            :class="
              cartNum >= attr.productSelect.stock
                ? 'on'
                : ''
            "
            @click="CartNumAdd"
          >+</div>
        </div>
      </div>
    </div>
    <div class="mask" @touchmove.prevent :hidden="attr.cartAttr === false" @click="closeAttr"></div>
  </div>
</template>
<script>
export default {
  name: "ProductWindow",
  props: {
    attr: {
      type: Object,
      default: () => {}
    },
    cartNum: {
      type: String,
      default: () => 1
    }
  },
  data: function() {
    return {};
  },
  watch: {
    attr:function(ne){
      console.log(ne)
    }
  },
  mounted: function() {
    console.log(this.attr)
  },
  methods: {
    closeAttr: function() {
      this.$emit("changeFun", { action: "changeattr", value: false });
    },
    CartNumDes: function() {
      this.$emit("changeFun", { action: "ChangeCartNum", value: false });
    },
    CartNumAdd: function() {
      this.$emit("changeFun", { action: "ChangeCartNum", value: 1 });
    },
    tapAttr: function(indexw, indexn) {
      let that = this;
      console.log(that.attr.productAttr);
      console.log(that.attr.productAttr[indexw], indexw, indexn);
      that.attr.productAttr[indexw].index = indexn;
      let value = that
        .getCheckedValue()
        .sort()
        .join(",");
      console.log(value);
      that.$emit("changeFun", { action: "ChangeAttr", value: value });
    },
    //获取被选中属性；
    getCheckedValue: function() {
      let productAttr = this.attr.productAttr;
      let value = [];
      for (let i = 0; i < productAttr.length; i++) {
        for (let j = 0; j < productAttr[i].attrValueArr.length; j++) {
          if (productAttr[i].index === j) {
            value.push(productAttr[i].attrValueArr[j]);
          }
        }
      }
      return value;
    }
  }
};
</script>
