<template>
  <div style="width: 100%;">
    <div style="display: flex;width: 100%;justify-content: center;" @click="itemClick">
      <div style="padding: 1vmin;">
        <span>
          <slot name="button"></slot>
        </span>
      </div>
    </div>
    <div ref="buttonbar" style="display: none">
      <slot name="buttonbar"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    path: String,
  },
  methods: {
    itemClick() {
      if (this.path) {
        // console.log(this.path)
        this.$router.push(this.path)
      } else {
        if (this.$refs.buttonbar.style.display === "none") {
          this.$refs.buttonbar.style.display = "block";
        } else {
          this.$refs.buttonbar.style.display = "none";
        }
      }
    },
  },
};
</script>

<style>
</style>