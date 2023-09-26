<template>
  <div class="FOOTER">
    <div id="date" class="footer_date">{{ nowDay }} {{ nowTime }}</div>
    <div
      style="
        display: flex;
        flex: 8;
        justify-content: flex-end;
        align-items: center;
        flex-direction: column;
      "
    >
      <div id="footer_center_area" style="color: #ffeb3b"></div>
      <span style="font-size: 2vh; color: #9aa9bf">{{
        copyright
      }}</span>
    </div>
    <div class="footer_home">
      <img class="footer_home_logo" :src="preview" />
    </div>
  </div>
</template>

<script>
import footerMixin from "common/mixin/footerMixin"

export default {
  mixins: [footerMixin],
};
</script>

<style scoped>
.FOOTER {
  display: flex;
  color: #ffffff;
  font-weight: bold;
  font-size: 2vh;
}

.footer_date {
  padding: 0px 20px;
  font-size: 3vh;
  align-self: center;
}

.footer_home {
  padding: 0px 10px;
  height: 10vh;
  display: flex;
}
.footer_home_logo {
  height: 8vh;
  width: 16vw;
  margin-top: auto;
}
</style>