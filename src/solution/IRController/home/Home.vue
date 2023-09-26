<template>
  <div>
    <h2 style="color: white">我是IR控制器首頁</h2>
  </div>
</template>

<script>

export default {
  components: {
  },
  data() {
    return {
    };
  },
  async created() {
  },
  mounted() {
  },
  computed: {
    lang() {
      return this.$store.state.backData.lang;
    },
  },
  methods: {
    addFootText(text) {
      //改變footer的文字
      this.$store.commit("addFootText", text);
    },
  },
  watch: {
  }
};
</script>

<style scoped>
.content {
  position: absolute;
  width: 100vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 2.5vw;
  left: 0px;
  top: 0px;
}
.STOPWATCH__img {
  background-image: url("~assets/images/stopwatch.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 10vmin;
  width: 10vmin;
}
</style>