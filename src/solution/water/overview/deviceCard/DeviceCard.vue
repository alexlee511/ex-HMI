<template>
    <div class="grid-container" v-if="isCardExist">
      <component
        :is="item.cardType"
        v-for="item in pageCard[this.$store.state.pageNum - 1]"
        :key="item.deviceId"
        :item-info="item"
      ></component>
    </div>
    <div v-else>
      <no-data-back></no-data-back>
    </div>
</template>

<script>
import water from "./waterCard/waterCard";

import deviceCardMixin from "common/mixin/deviceCardMixin";

export default {
  components: {
    water,
  },
  mixins: [deviceCardMixin],
  created() {
    this.$store.dispatch("getSolutionData").then(() => {
      this.getCard("water");
    });
  },
};
</script>

