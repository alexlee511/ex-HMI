<template>
  <div class="grid-container" v-if="isCardExist">
    <component
      :is="item.cardType"
      v-for="(item, index) in pageCard[this.$store.state.pageNum - 1]"
      :key="item.deviceId"
      :item-info="item"
      :index="index"
    ></component>
  </div>
  <div v-else>
    <no-data-back></no-data-back>
  </div>
</template>

<script>
import IRControllerCard from "./IRCard/IRCard"
import TSControllerCard from "./TSCard/TSCard"

import deviceCardMixin from "common/mixin/deviceCardMixin";

export default {
  components: {
    IRControllerCard,
    TSControllerCard
  },
  mixins: [deviceCardMixin],
  async created() {
    // 獲取該方案的資料
    await this.$store.dispatch("getSolutionData");
    this.getCard("IRController");

  },
};
</script>
