<template>
  <div class="grid-container" v-if="isCardExist">
    <component
      :is="item.cardType"
      v-for="(item, index) in pageCard[this.$store.state.pageNum - 1]"
      :key="index"
      :item-info="item"
    ></component>
  </div>
  <div v-else>
    <no-data-back></no-data-back>
  </div>
</template>

<script>
import LightControlCard from "./lightConrolCard/LightControlCard"

import deviceCardMixin from "common/mixin/deviceCardMixin"

export default {
  components: {
    LightControlCard
  },
  mixins: [deviceCardMixin],
  created() {
    this.$store.dispatch("getSolutionData").then(() => {
      this.getCard("lightController");
    });
  }
};
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: 50% 50%;
  grid-column-gap: 5px;
  grid-row-gap: 1em;
  color: #ffffff;
  font-weight: bold;
  margin-left: 20px;
  margin-right: 20px;
  height: 70vh;
}
</style>
