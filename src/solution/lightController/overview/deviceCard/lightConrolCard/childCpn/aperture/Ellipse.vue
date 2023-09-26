<template>
  <ellipse
    :filter="light ? 'url(#svg_2_blur)' : ''"
    :fill="light ? '#ffff33' : '#01ffff'"
    stroke-width="0"
    stroke-opacity="null"
    :cx="info.cx"
    :cy="info.cy"
    :rx="light ? '8' : '5'"
    :ry="light ? '8' : '5'"
  />
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
    },
    info: {
      type: Object,
      default: {},
    },
    currentIndex: {
      type: Number
    }
  },
  data() {
    return {};
  },
  computed: {
    light() {
      return this.index == this.currentIndex? true: false;
    },
  },
};
</script>

<style>
</style>