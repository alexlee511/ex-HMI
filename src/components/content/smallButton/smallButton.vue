<template>
  <div
    id="header_conf_aply_icon"
    class="header__icon"
    style="display: block"
    @click="itemClick"
  >
    <button class="header__button" :class="{ change: isChange }">
      <slot></slot>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    // isChange: {
    //   type: Boolean,
    //   default: false,
    // },
    path: {
      type: String,
      default: "",
    },
    devId: {
      type: String,
      default: "",
    },
  },
  created() {
    // console.log(this.$route.path.split('/'))
  },
  computed: {
    activePath() {
      return this.$route.path.split('/').pop();
    },
    isChange() {
      return this.path === this.activePath? true: false
    }
  },
  methods: {
    itemClick() {
      this.$router.replace({
        path: this.path,
        query: {
          devId: this.devId,
        },
      });
    },
  },
};
</script>

<style scoped>
.header__icon {
  height: 3.5vh;
  font-size: 1vw;
}

.header__button {
  height: 3.5vh;
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  border-radius: 3px;
  color: #ffffff;
  font-weight: bold;

  width: 8vw;
  margin: 0vh 1vw;
  outline: none;
}
.change {
  /* background: linear-gradient(
    rgba(101, 212, 207, 0.8),
    rgba(210, 230, 174, 0.8)
  ); */
  color: rgb(247, 250, 106);
}
</style>