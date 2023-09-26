<template>
  <div class="footer">
    <div id="date" class="footer_date">{{ nowDay }} {{ nowTime }}</div>
    <div style="display: flex; flex-direction: column; justify-content: flex-end;">
      <div class="contractCap">
        <slot name="text">
          <span>{{footText}}</span>
          <span></span>
        </slot>
      </div>
      <span class="contractCap" style="font-size: 2vh; color: #9aa9bf; height: 50%">{{
        copyright
      }}</span>
    </div>
  </div>
</template>

<script>
import footerMixin from "common/mixin/footerMixin"

export default {
  mixins: [footerMixin],
  mounted() {
  },
  computed: {
    footText() {
      return this.$store.state.footText
    }
  }
};
</script>

<style scoped>
.footer {
  display: flex;
  position: absolute;
  margin-top: 90vh;
  width: 100vw;
  height: 10vh;
  left: 0px;
  top: 0px;
}
.footer_date {
  padding: 0px 20px;
  font-size: 3vh;
  align-self: center;
}
.contractCap {
  width: 60vw;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #9e9e9e;
  font-size: 3vh;
}
</style>