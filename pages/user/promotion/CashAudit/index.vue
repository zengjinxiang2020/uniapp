<template>
  <div class="cash-audit">
    <div class="pictrue">
      <img :src="$VUE_APP_RESOURCES_URL+'/images/examine.png'" />
    </div>
    <div class="tip">提现申请已提交，等待人工审核</div>
    <div class="time">{{ time }}</div>
    <div class="bnt bg-color-red" @click="goUserPromotion()">好的</div>
  </div>
</template>
<script>
export default {
  name: "CashAudit",
  components: {},
  props: {},
  data: function() {
    return {
      time: ""
    };
  },
  mounted: function() {
    let myData = new Date();
    this.time = myData.toLocaleString();
  },
  methods: {
    goUserPromotion() {
      this.$yrouter.push({ path: "/pages/user/promotion/UserPromotion/index" });
    }
  }
};
</script>
