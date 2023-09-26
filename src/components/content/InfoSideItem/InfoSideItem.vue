<template>
  <div
    id="side_nav_meter_phase3"
    class="navbar__item"
    @click="itemClick"
    :class="{'navbar__item__select': isAcitve}"
  >
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    path: String
  },
  data() {
    return {
      itemInfo: this.$route.query
    }
  },
  methods: {
    itemClick() {
      this.$router.replace({
        path: this.path,
        query: { devId: this.itemInfo.devId }
      });
    }
  },
  computed: {
    currentPath() {
      return this.$route.path
    },
    isAcitve() {
      return this.currentPath.indexOf(this.path) !== -1
    }
  },
  created() {
  },
};
</script>

<style>
.navbar__item {
  margin: 2vh 0vw;
  width: 80%;
  font-size: 4vmin;
}

.navbar__item__select {
  color: #ffff33;
  border-width: 0px 0px 2px 0px;
  border-style: solid;
  border-image: linear-gradient(to right, #01ffff, #2160b8);
  border-image-slice: 1;
}
</style>