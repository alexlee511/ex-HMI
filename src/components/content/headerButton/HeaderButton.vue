<template>
  <div
    id="header_conf_aply_icon"
    class="header__icon"
    style="display: block"
  >
    <button class="header__button" :class="{'change': isChange}"><slot></slot></button>
  </div>
</template>

<script>
export default {
  props: {
    isChange: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
  },
};
</script>

<style scoped>
.header__icon {
  height: 7vh;
  font-size: 2vw;
}

.header__button {
  height: 7vh;
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  cursor: pointer;
  width: 11vw;
  margin: 0vh 1vw;
}
.change {
  background: linear-gradient(rgba(101, 212, 207, 0.8), rgba(210, 230, 174, 0.8));
  color: rgb(247, 250, 106);
}
</style>