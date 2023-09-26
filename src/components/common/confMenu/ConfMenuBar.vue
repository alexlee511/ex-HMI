<template>
  <div style="width: 90%;background: linear-gradient(rgb(63 37 175 / 34%), rgba(33, 96, 184));margin: auto; border-radius: 15px;" @click="itemClick">
    <div style="display: flex;width: 100%;justify-content: center;">
      <div style="padding: 1vmin;">
        <span>
          <slot></slot>
        </span>
      </div>
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
      // console.log(this.path)
      this.$router.push(this.path);
    },
  },
};
</script>

<style>
</style>