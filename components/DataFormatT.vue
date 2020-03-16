<template>
  <text>{{time}}</text>
</template>
<script>
import { dataFormatT } from "@/utils";

export default {
  name: "DataFormatT",
  props: ["data"],
  data: function() {
    return {
      time: ""
    };
  },
  mounted() {
    this.time = dataFormatT(this.data);
  },
  watch: {
    "$props.data"(props) {
      this.time = dataFormatT(this.data);
    }
  }
};
</script>
