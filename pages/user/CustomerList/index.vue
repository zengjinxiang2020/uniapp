<template>
  <view class="CustomerList">
    <view
      class="item acea-row row-between-wrapper"
      v-for="item in list"
      :key="item.id"
      @click="goCustomerService(item)"
    >
      <view class="pictrue">
        <image :src="item.avatar" />
      </view>
      <view class="text line1">{{ item.nickname }}</view>
    </view>
  </view>
</template>
<script>
import { serviceList } from "@/api/user";

export default {
  name: "CustomerList",
  data() {
    return {
      list: []
    };
  },
  methods: {
    goCustomerService(item) {
      this.$yrouter.push({
        path: "/pages/user/CustomerService/index",
        query: { id: item.uid }
      });
    },
    getList() {
      serviceList().then(res => {
        this.list = res.data;
      });
    }
  },
  mounted() {
    this.getList();
  }
};
</script>
<style scoped>
.CustomerList {
  margin-top: 0.13rem;
}
.CustomerList .item {
  height: 1.38rem;
  border-bottom: 1px solid #eee;
  padding: 0 0.24rem;
  background-color: #fff;
}
.CustomerList .item .pictrue {
  width: 0.9rem;
  height: 0.9rem;
  border-radius: 50%;
  border: 0.03rem solid #fff;
  box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
  -webkit-box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
  -moz-box-shadow: 0 0 0.1rem 0.05rem #f3f3f3;
}
.CustomerList .item .pictrue image{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.CustomerList .item .text {
  width: 5.82rem;
  font-size: 0.32rem;
  color: #000;
}
</style>
