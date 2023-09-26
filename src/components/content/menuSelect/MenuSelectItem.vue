<template>
  <div class="navbar__item" @click="itemClick">
    <slot name="item-name"></slot>
  </div>
</template>

<script>
export default {
  props: {
    path: String
  },
  methods: {
    itemClick() {
      this.$router.replace(this.path)
    }
  }
};
</script>

<style scoped>
.navbar__item {
  z-index: 2;
  background: linear-gradient(rgb(40, 110, 208), rgb(21, 71, 142));
  width: 15vw;
  height: 6vh;
  font-size: 3.2vmin;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  margin: 0vh 1vw;
}

</style>