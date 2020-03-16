<template>
  <text>{{time}}</text>
</template>
<script>
import { dataFormat } from "@/utils";

export default {
  name: "DataFormat",
  props: ["data"],
  data: function() {
    return {
      time: ""
    };
  },
  mounted() {
    this.time = dataFormat(this.data);
  },
  watch: {
    "$props.data"(props) {
      this.time = dataFormat(this.data);
    }
  }
};
</script>
