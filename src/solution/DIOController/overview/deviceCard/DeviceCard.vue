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

import DIControllerCard from "./DICard/DICard";
import DOControllerCard from "./DOCard/DOCard";
import MultiControl from "./multiControl/MultiControl";

import deviceCardMixin from "common/mixin/deviceCardMixin"

export default {
  components: {
    DIControllerCard,
    DOControllerCard,
    MultiControl
  },
  mixins: [deviceCardMixin],
  created() {
    this.$store.dispatch("getSolutionData").then(() => {
      this.getCard("DIOController");
    });
  }
};
</script>

